import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This file is being replaced by the Supabase client.
// All Firebase logic will be removed and replaced with Supabase.

let supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl) {
      throw new Error('Supabase URL is not defined in environment variables.');
    }
    if (!supabaseAnonKey) {
      throw new Error('Supabase Anon Key is not defined in environment variables.');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}
