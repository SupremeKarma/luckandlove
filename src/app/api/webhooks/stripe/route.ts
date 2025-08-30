
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

        // Idempotent: only update if not already paid
        const { error } = await supabase.from("orders")
          .update({ status: "paid" })
          .eq("id", orderId)
          .neq("status", "paid");
        
        if (error) {
           console.error(`Webhook: Supabase order update error for order ${orderId}:`, error);
           return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      } catch (dbError: any) {
        console.error(`Webhook: Database connection error for order ${orderId}:`, dbError);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
