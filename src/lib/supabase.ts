import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// import type { Database } from "./types"; // If you have generated types

let browserClient: SupabaseClient /*<Database>*/ | null = null;

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

const SUPABASE_URL = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_ANON_KEY = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export function getSupabase(): SupabaseClient /*<Database>*/ {
  if (typeof window === "undefined") {
    // In SSR contexts, prefer getServerSupabase()
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

export function getServerSupabase(): SupabaseClient /*<Database>*/ {
  // New client per request on the server (no session persistence)
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
