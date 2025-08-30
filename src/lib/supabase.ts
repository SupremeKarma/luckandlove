import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getPublicEnv() {
  // Literal access so Next.js inlines these in client bundles
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return { url, anon };
}

export function getSupabase(): SupabaseClient {
  const { url, anon } = getPublicEnv();
  if (typeof window === "undefined") {
    return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  if (!browserClient) {
    browserClient = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return browserClient;
}

export function getServerSupabase(): SupabaseClient {
  const { url, anon } = getPublicEnv();
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}
