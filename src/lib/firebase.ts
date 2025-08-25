'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Gets a Supabase client instance.
 *
 * This function ensures that only one instance of the Supabase client is created.
 * It retrieves the Supabase URL and anon key from environment variables.
 *
 * Note: This function is client-side safe. The anon key is designed to be
 * public and only allows access based on your Row Level Security (RLS) policies.
 *
 * @returns {SupabaseClient} The Supabase client instance.
 * @throws {Error} If Supabase environment variables are not set.
 */
export function getSupabase(): SupabaseClient {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // This will be caught by the developer during development.
    // In a production environment, these variables should be set.
    throw new Error('Supabase URL or Anon Key is missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
  }

  // Initialize the Supabase client.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
