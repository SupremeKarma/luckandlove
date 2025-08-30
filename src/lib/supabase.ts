import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export function getSupabase(): SupabaseClient {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (typeof window === "undefined") {
    return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  if (!browserClient) {
    browserClient = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return browserClient;
}

export function getServerSupabase(): SupabaseClient {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}
