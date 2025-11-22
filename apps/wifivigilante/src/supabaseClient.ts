// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Import environment variables for Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables BEFORE creating client
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please copy .env.example to .env and add your Supabase credentials.'
  );
}

// Create and export Supabase client with timeout configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'wi-fi-vigilante',
    },
  },
  // Network timeout configuration (30 seconds)
  db: {
    schema: 'public',
  },
  realtime: {
    timeout: 30000,
  },
});
