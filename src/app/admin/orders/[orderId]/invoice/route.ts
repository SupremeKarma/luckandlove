
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  const adminToken = process.env.INTERNAL_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "Missing INTERNAL_ADMIN_TOKEN" }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  const url = `${origin}/api/orders/${params.orderId}/invoice.pdf`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-admin-token": adminToken },
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    const msg = await res.text().catch(() => "Invoice fetch failed");
    return NextResponse.json({ error: msg }, { status: res.status || 500 });
  }

  const headers = new Headers();
  headers.set("Content-Type", res.headers.get("Content-Type") || "application/pdf");
  headers.set(
    "Content-Disposition",
    res.headers.get("Content-Disposition") || `inline; filename="invoice-${params.orderId}.pdf"`
  );
  headers.set("Cache-Control", "private, max-age=0, must-revalidate");

  return new NextResponse(res.body, { status: 200, headers });
}
