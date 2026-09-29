import { createClient } from '@supabase/supabase-js';

// These are public client credentials for this project's Supabase instance. Cloudflare
// Workers Builds do not read .env.example, and blank build variables are possible.
const productionSupabaseUrl = 'https://rrgrjbgnrumkfrvmpsxv.supabase.co';
const productionSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3JqYmducnVta2Zydm1wc3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTA0NTcsImV4cCI6MjA5OTE4NjQ1N30.XZcYLZLELI1wHWmEQcm9zsFhKlLsWVKEWo6MtOM7Eas';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() ||
  (import.meta.env.PROD ? productionSupabaseUrl : '');
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  (import.meta.env.PROD ? productionSupabaseAnonKey : '');

export const isSupabaseAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseClient = isSupabaseAuthConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
