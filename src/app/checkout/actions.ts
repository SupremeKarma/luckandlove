
"use server";

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type CartItem = {
  productId: string;
  name: string;
  price: number; // unit price in major units (e.g., 12.34 USD)
  qty: number;
};

export async function createCheckoutSession(input: {
  email: string;
  items: CartItem[];
}) {
  if (!input.email?.includes("@")) throw new Error("Valid email required");
  if (!Array.isArray(input.items) || input.items.length === 0) throw new Error("Cart is empty");

  const supabaseUrl = req("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = req("SUPABASE_SERVICE_ROLE_KEY"); // server-only
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Compute totals safely on the server
  const currency = process.env.STRIPE_CURRENCY || "usd";
  const subtotal = input.items.reduce((n, i) => n + (i.price || 0) * (i.qty || 0), 0);
  const tax = 0; // plug in your tax calc if needed
  const shipping = 0; // plug in shipping if needed
  const total = subtotal + tax + shipping;

  // Create order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([
      {
        email: input.email,
        status: "pending",
        subtotal,
        tax,
        shipping,
        total,
        currency: currency.toUpperCase(),
      },
    ])
    .select()
    .single();

  if (orderErr || !order) throw new Error(orderErr?.message || "Order create failed");

  // Insert order items
  const itemsPayload = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    name: i.name,
    unit_price: i.price,
    qty: i.qty,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsErr) throw new Error(itemsErr.message);

  // If Stripe is not configured, stop here (dev-friendly)
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    revalidatePath("/admin/orders");
    return { orderId: order.id, checkoutUrl: null };
  }

  // Create Stripe Checkout Session
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const successUrl = req("STRIPE_SUCCESS_URL");
  const cancelUrl = req("STRIPE_CANCEL_URL");

  const line_items = input.items.map((i) => ({
    quantity: i.qty,
    price_data: {
      currency,
      product_data: { name: i.name },
      unit_amount: Math.round((i.price || 0) * 100), // cents
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    success_url: `${successUrl}?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    line_items,
    metadata: { order_id: order.id },
  });

  revalidatePath("/admin/orders");
  return { orderId: order.id, checkoutUrl: session.url };
}
