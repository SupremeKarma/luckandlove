import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!token || token !== process.env.INTERNAL_ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = required("NEXT_PUBLIC_SUPABASE_URL");
  const service = required("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const body = await req.json().catch(() => ({}));
  // example: upsert a product
  const { data, error } = await supabase
    .from("products")
    .upsert([{ id: body.id, name: body.name, price: body.price, stock: body.stock, active: !!body.active }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
