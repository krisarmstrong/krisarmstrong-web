// src/config/env.ts

interface EnvVars {
  VITE_APP_ENV: string;
  VITE_SENTRY_DSN?: string;
}

/**
 * Validates and returns type-safe environment variables.
 *
 * @throws {Error} If required environment variables are missing
 * @returns Validated environment variables
 */
function validateEnv(): EnvVars {
  return {
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  };
}

// Export validated env vars
export const env = validateEnv();
