// src/config/env.ts

interface EnvVars {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
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
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;

  const missing = required.filter(
    // eslint-disable-next-line security/detect-object-injection
    (key) => !import.meta.env[key] || import.meta.env[key].trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((key) => `  - ${key}`).join('\n')}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for required variables.`
    );
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  };
}

// Export validated env vars
export const env = validateEnv();
