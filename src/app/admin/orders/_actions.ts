'use server';

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// This is a server action, so it only runs on the server.
// It's safe to use secret keys here.

function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type OrderStatus = "pending" | "paid" | "shipped" | "cancelled" | "refunded";

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ error: string | null }> {
  try {
    const url = reqEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = reqEnv("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      throw new Error(error.message);
    }
    
    // Revalidate the orders page to show the updated status
    revalidatePath("/admin/orders");

    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}
