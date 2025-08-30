
"use server";

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function refundOrder(orderId: string) {
  const url = req("NEXT_PUBLIC_SUPABASE_URL");
  const service = req("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: order, error } = await supabase.from("orders").select("id, status, stripe_payment_intent_id").eq("id", orderId).maybeSingle();
  
  if (error || !order) {
    throw new Error(error?.message ?? "Order not found");
  }
  if (order.status !== "paid") {
    throw new Error("Only paid orders can be refunded");
  }
  if (!order.stripe_payment_intent_id) {
    throw new Error("Missing payment intent ID. Cannot process refund.");
  }

  const secret = req("STRIPE_SECRET_KEY");
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  // Stripe will trigger a 'charge.refunded' webhook, which will handle the status update and restock via DB trigger.
  // We only need to initiate the refund here.
  await stripe.refunds.create({ payment_intent: order.stripe_payment_intent_id });

  // Revalidate paths to reflect potential immediate changes shown to the admin.
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}
