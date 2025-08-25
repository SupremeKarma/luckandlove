'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This file is being replaced by the Supabase client.
// All Firebase logic will be removed and replaced with Supabase.

let supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully handle missing env vars without crashing the app.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined in environment variables.');
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
