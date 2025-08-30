export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { createClient } from "@supabase/supabase-js";
import { getServerSupabase } from "@/lib/supabase";

function reqEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function money(n: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(n || 0));
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;
  // Access mode:
  // - Customer (RLS) → anon key via getServerSupabase()
  // - Admin          → provide header x-admin-token = INTERNAL_ADMIN_TOKEN to use service role
  //   (You can add this header from the admin UI when linking to this PDF.)
  const isAdmin = typeof _req.headers.get("x-admin-token") === "string" &&
                  _req.headers.get("x-admin-token") === process.env.INTERNAL_ADMIN_TOKEN;

  const supabase = isAdmin
    ? createClient(reqEnv("NEXT_PUBLIC_SUPABASE_URL"), reqEnv("SUPABASE_SERVICE_ROLE_KEY"), {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : getServerSupabase();

  // Load order + items
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .select("id,email,created_at,subtotal,tax,shipping,total,currency,shipping_address,shipping_method,stripe_payment_intent_id")
    .eq("id", orderId)
    .maybeSingle();

  if (oErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: items, error: iErr } = await supabase
    .from("order_items")
    .select("name,qty,unit_price,line_total")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (iErr) {
    return NextResponse.json({ error: "Could not load items" }, { status: 500 });
  }

  // Build PDF
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const brand = (process.env.EMAIL_FROM || "Store <no-reply@example.com>").replace(/<.*?>/g, "").trim();
  const currency = (order.currency || "USD").toUpperCase();

  // Header
  doc.font("Helvetica-Bold").fontSize(18).text(brand);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(10).fillColor("#666").text("Invoice / Payment Receipt");
  doc.moveDown(0.6);
  doc.fillColor("#000");

  const leftX = 50;
  const rightX = 320;

  doc.fontSize(10);
  doc.text(`Order ID: ${order.id}`, leftX, 90);
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, leftX, 105);
  doc.text(`Customer: ${order.email || "—"}`, leftX, 120);

  const sa: any = order.shipping_address || {};
  doc.text("Ship to:", rightX, 90);
  doc.text(`${sa.name ?? "—"}`, rightX, 105);
  doc.text(`${sa.line1 ?? ""} ${sa.line2 ?? ""}`.trim(), rightX, 120);
  doc.text(`${sa.city ?? ""} ${sa.state ?? ""} ${sa.postal_code ?? ""}`.trim(), rightX, 135);
  doc.text(`${sa.country ?? ""}`, rightX, 150);
  if (sa.phone) doc.text(`${sa.phone}`, rightX, 165);
  if (order.shipping_method) doc.text(`Method: ${order.shipping_method}`, rightX, 180);

  // Items table
  let y = 210;
  const tableX = leftX;
  const tableW = 495 - tableX;
  doc.moveTo(tableX, y).lineTo(tableX + tableW, y).strokeColor("#e5e7eb").stroke();
  y += 8;

  doc.fillColor("#666").font("Helvetica-Bold");
  doc.text("Item", tableX, y, { width: tableW - 190 });
  doc.text("Qty", tableX + tableW - 180, y, { width: 40, align: "right" });
  doc.text("Unit", tableX + tableW - 130, y, { width: 60, align: "right" });
  doc.text("Total", tableX + tableW - 60, y, { width: 60, align: "right" });
  doc.fillColor("#000").font("Helvetica");
  y += 16;

  items?.forEach((i) => {
    const lineH = 16;
    doc.text(i.name, tableX, y, { width: tableW - 190 });
    doc.text(String(i.qty), tableX + tableW - 180, y, { width: 40, align: "right" });
    doc.text(money(Number(i.unit_price), currency), tableX + tableW - 130, y, { width: 60, align: "right" });
    doc.text(money(Number(i.line_total), currency), tableX + tableW - 60, y, { width: 60, align: "right" });
    y += lineH;
  });

  y += 6;
  doc.moveTo(tableX, y).lineTo(tableX + tableW, y).strokeColor("#e5e7eb").stroke();
  y += 12;

  // Totals
  const labelX = tableX + tableW - 160;
  const valueX = tableX + tableW - 60;

  doc.font("Helvetica").fillColor("#666");
  doc.text("Subtotal", labelX, y, { width: 100, align: "right" });
  doc.fillColor("#000").text(money(Number(order.subtotal), currency), valueX, y, { width: 60, align: "right" }); y += 16;

  doc.fillColor("#666").text("Tax", labelX, y, { width: 100, align: "right" });
  doc.fillColor("#000").text(money(Number(order.tax), currency), valueX, y, { width: 60, align: "right" }); y += 16;

  doc.fillColor("#666").text("Shipping", labelX, y, { width: 100, align: "right" });
  doc.fillColor("#000").text(money(Number(order.shipping), currency), valueX, y, { width: 60, align: "right" }); y += 16;

  doc.moveTo(labelX, y + 6).lineTo(valueX + 60, y + 6).strokeColor("#e5e7eb").stroke(); y += 12;

  doc.font("Helvetica-Bold").fillColor("#000").text("Total", labelX, y, { width: 100, align: "right" });
  doc.text(money(Number(order.total), currency), valueX, y, { width: 60, align: "right" }); y += 22;

  // Payment info
  doc.font("Helvetica").fillColor("#666");
  doc.text(`Payment: ${order.stripe_payment_intent_id ? "Stripe" : "—"}`, tableX, y);
  if (order.stripe_payment_intent_id) {
    doc.text(`Payment Intent: ${order.stripe_payment_intent_id}`, tableX, y + 14);
  }

  // Footer
  doc.fillColor("#999").fontSize(9);
  doc.text("Thank you for your business!", leftX, 760, { align: "center", width: 495 - leftX });

  doc.end();
  const pdf = await done;

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${orderId}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}