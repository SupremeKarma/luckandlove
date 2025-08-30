import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export function getSupabase(): SupabaseClient {
  // Bypassing process.env for now to ensure the app can start.
  const url = "https://kkocuxnaiiyxwimzbqkd.supabase.co";
  const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrb2N1eG5haWl5eHdpbXpicWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjM3MzMsImV4cCI6MjA3MDYzOTczM30._QHOBr4QfARij4zfCO-aWakt7tK8q6ndJoVoLqOmMa8";

  if (typeof window === "undefined") {
    return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  if (!browserClient) {
    browserClient = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return browserClient;
}

export function getServerSupabase(): SupabaseClient {
  // Bypassing process.env for now to ensure the app can start.
  const url = "https://kkocuxnaiiyxwimzbqkd.supabase.co";
  const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrb2N1eG5haWl5eHdpbXpicWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjM3MzMsImV4cCI6MjA3MDYzOTczM30._QHOBr4QfARij4zfCO-aWakt7tK8q6ndJoVoLqOmMa8";
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}
