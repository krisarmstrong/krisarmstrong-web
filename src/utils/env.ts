/**
 * Shared environment and Sentry utilities
 */

// Type declaration for process (when available at runtime)
declare const process: { env?: { NODE_ENV?: string } };

/**
 * Safely check if we're in development mode.
 * This works for both Vite (import.meta.env.MODE) and webpack (process.env.NODE_ENV).
 */
export const isDevelopmentEnvironment = (() => {
  // Check process.env.NODE_ENV (webpack/CRA)
  if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production') {
    return false;
  }

  // Check import.meta.env.MODE (Vite) - safe because import.meta is statically analyzed
  // at build time and replaced with the actual value
  try {
    // @ts-ignore - import.meta may not be available in all environments
    return import.meta.env?.MODE !== 'production';
  } catch {
    // Fallback to process.env check if import.meta is not available
    return typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production';
  }
})();

/**
 * Safely try to get Sentry from the global window object if available.
 * Returns null if Sentry is not installed (optional peer dependency).
 * This avoids CommonJS require() in an ESM project.
 */
export function getSentry(): any | null {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    return (window as any).Sentry;
  }
  return null;
}
