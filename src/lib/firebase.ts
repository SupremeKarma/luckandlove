'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
 * @returns {SupabaseClient | null} The Supabase client instance, or null if
 * environment variables are not set.
 */
export function getSupabase() {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing from environment variables.');
    // In a real app, you might want to show a user-friendly message or redirect.
    return null;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
}
