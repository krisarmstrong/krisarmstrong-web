// src/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Import environment variables for Supabase URL and Publishable Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Validate and log at module load (but don't throw)
const envVarsValid = Boolean(supabaseUrl && supabasePublishableKey);
if (!envVarsValid) {
  console.error(
    '[supabaseClient] Missing Supabase environment variables. ' +
      'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.'
  );
}

// Create and export Supabase client - only if env vars are valid
// If env vars are missing, export a client anyway to prevent module load failures
// API calls will fail with auth errors, but the module won't break
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-application-name': 'wi-fi-vigilante',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      timeout: 30000,
    },
  }
);
