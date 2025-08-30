
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import ReceiptEmail from "@/emails/ReceiptEmail";
import React from "react";


export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed. ${err.message}` }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

    if (orderId) {
        // Idempotent: only update if not already paid.
        // The on_order_status_change trigger will decrement stock.
        const { error } = await supabase.from("orders")
          .update({ status: "paid", stripe_payment_intent_id: paymentIntentId ?? null })
          .eq("id", orderId)
          .neq("status", "paid");
        
        if (error) {
            console.error(`Webhook: Supabase order update error for order ${orderId}:`, error);
        } else {
             await supabase.from("order_events").insert({
                order_id: orderId, type: "webhook", message: "Payment succeeded",
            });

            // Send receipt email
            try {
              const { data: fullOrder } = await supabase
                .from("orders")
                .select("id, email, created_at, subtotal, tax, shipping, total, currency, shipping_address")
                .eq("id", orderId)
                .maybeSingle();

              const { data: items } = await supabase
                .from("order_items")
                .select("name, qty, unit_price, line_total")
                .eq("order_id", orderId)
                .order("created_at", { ascending: true });

              if (fullOrder?.email && items) {
                const resend = new Resend(process.env.RESEND_API_KEY!);
                const from = process.env.EMAIL_FROM || "Store <no-reply@example.com>";

                await resend.emails.send({
                  from,
                  to: fullOrder.email,
                  subject: `Your receipt · Order ${String(fullOrder.id).slice(0, 8)}…`,
                  react: React.createElement(ReceiptEmail, {
                    orderId: fullOrder.id,
                    email: fullOrder.email,
                    createdAt: fullOrder.created_at,
                    items: items as any,
                    subtotal: Number(fullOrder.subtotal),
                    tax: Number(fullOrder.tax),
                    shipping: Number(fullOrder.shipping),
                    total: Number(fullOrder.total),
                    currency: (fullOrder.currency || "USD").toUpperCase(),
                    shippingAddress: (fullOrder.shipping_address as any) ?? null,
                  }),
                });

                await supabase.from("order_events").insert({
                  order_id: orderId, type: "email", message: "Receipt sent",
                });
              }
            } catch (e: any) {
              await supabase.from("order_events").insert({
                order_id: orderId, type: "email", message: `Receipt failed: ${e?.message ?? "unknown error"}`,
              });
            }
        }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;

    if (paymentIntentId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .maybeSingle();

      if (order && order.status !== "refunded") {
        // The on_order_status_change trigger will restock items.
        // We just need to set the status here.
        await supabase.from("orders").update({ status: "refunded" }).eq("id", order.id);
        await supabase.from("order_events").insert({
            order_id: order.id, type: "webhook", message: "Payment refunded",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
