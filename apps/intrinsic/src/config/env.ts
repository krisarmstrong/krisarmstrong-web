// src/config/env.ts

interface EnvVars {
  VITE_APP_ENV: string;
  VITE_SENTRY_DSN?: string;
}

/**
 * Validates and returns type-safe environment variables.
 * Intrinsic app doesn't require Supabase.
 *
 * @returns Validated environment variables
 */
function validateEnv(): EnvVars {
  const appEnv = import.meta.env.VITE_APP_ENV as string | undefined;
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

  return {
    VITE_APP_ENV: appEnv || 'development',
    VITE_SENTRY_DSN: sentryDsn,
  };
}

// Export validated env vars
export const env = validateEnv();
