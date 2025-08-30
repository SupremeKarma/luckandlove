import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET() {
  const details: Record<string, unknown> = { env: {}, db: {} };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  details.env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(url),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(anon),
  };

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("products").select("id").limit(1);
    details.db = { ok: !error, error: error?.message ?? null };
  } catch (e: any) {
    details.db = { ok: false, error: e?.message ?? "unknown" };
  }

  const ok = (details.env as any).NEXT_PUBLIC_SUPABASE_URL && (details.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY && (details.db as any).ok;
  return NextResponse.json({ ok, details }, { status: ok ? 200 : 500 });
}
