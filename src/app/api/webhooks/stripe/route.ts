
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Helper function to restock items for a given order
async function restockItems(supabase: ReturnType<typeof createClient>, orderId: string) {
    const { data: items } = await supabase.from("order_items").select("product_id, qty").eq("order_id", orderId);
    if (items && items.length) {
        for (const item of items) {
            const { error: stockError } = await supabase.rpc('increment_product_stock', {
                p_product_id: item.product_id,
                p_quantity: item.qty
            });

            if (stockError) {
                console.error(`Webhook: Failed to restock product ${item.product_id} for order ${orderId}:`, stockError);
            }
        }
    }
}

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
        await supabase.from("orders").update({ status: "refunded" }).eq("id", order.id);
        await supabase.from("order_events").insert({
            order_id: order.id, type: "webhook", message: "Payment refunded",
        });
        await restockItems(supabase, order.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
