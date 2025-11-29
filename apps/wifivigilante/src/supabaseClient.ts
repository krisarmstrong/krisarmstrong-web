// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Import environment variables for Supabase URL and Publishable Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Validate environment variables BEFORE creating client
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Please copy .env.example to .env and add your Supabase credentials.'
  );
}

// Create and export Supabase client with timeout configuration
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
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
