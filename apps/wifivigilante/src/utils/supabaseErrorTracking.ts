/**
 * Supabase error tracking utilities
 * Wraps Supabase calls with error tracking and logging
 */
import { PostgrestError } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';
import { errorTracker } from './errorTracking';

interface SupabaseErrorContext {
  operation: string;
  table?: string;
  query?: string | Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Track Supabase errors
 * @param error - Supabase error
 * @param context - Error context
 */
export function trackSupabaseError(
  error: PostgrestError | Error,
  context: SupabaseErrorContext
): void {
  const errorMessage = 'message' in error ? error.message : String(error);
  const errorDetails = 'details' in error ? error.details : undefined;
  const errorCode = 'code' in error ? error.code : undefined;

  // Log to our error tracker
  errorTracker.logError(
    error instanceof Error ? error : new Error(errorMessage),
    {
      ...context,
      errorCode,
      errorDetails,
      service: 'supabase',
    }
  );

  // Send to Sentry in production
  if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: {
        service: 'supabase',
        operation: context.operation,
        table: context.table,
      },
      extra: {
        errorCode,
        errorDetails,
        ...context,
      },
      level: errorCode === '23505' ? 'warning' : 'error', // Unique violation is warning
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[Supabase Error]', {
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
      context,
    });
  }
}

/**
 * Wrap Supabase query with error tracking
 * @param queryFn - Query function that returns a promise
 * @param context - Error context
 * @returns Query result
 */
export async function withSupabaseErrorTracking<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  context: SupabaseErrorContext
): Promise<{ data: T | null; error: PostgrestError | null }> {
  try {
    const result = await queryFn();

    // Track errors returned by Supabase
    if (result.error) {
      trackSupabaseError(result.error, context);
    }

    return result;
  } catch (error) {
    // Track unexpected errors
    trackSupabaseError(
      error instanceof Error ? error : new Error(String(error)),
      { ...context, unexpected: true }
    );
    throw error;
  }
}

/**
 * Create a Supabase error tracking wrapper for a specific table
 * @param tableName - Table name
 * @returns Error tracking functions for the table
 */
export function createTableErrorTracker(tableName: string) {
  return {
    /**
     * Track select operation error
     * @param error - Supabase error
     * @param query - Query details
     */
    trackSelectError(error: PostgrestError | Error, query?: Record<string, unknown>) {
      trackSupabaseError(error, { operation: 'select', table: tableName, query });
    },

    /**
     * Track insert operation error
     * @param error - Supabase error
     * @param data - Insert data
     */
    trackInsertError(error: PostgrestError | Error, data?: Record<string, unknown>) {
      trackSupabaseError(error, { operation: 'insert', table: tableName, data });
    },

    /**
     * Track update operation error
     * @param error - Supabase error
     * @param data - Update data
     */
    trackUpdateError(error: PostgrestError | Error, data?: Record<string, unknown>) {
      trackSupabaseError(error, { operation: 'update', table: tableName, data });
    },

    /**
     * Track delete operation error
     * @param error - Supabase error
     * @param query - Query details
     */
    trackDeleteError(error: PostgrestError | Error, query?: Record<string, unknown>) {
      trackSupabaseError(error, { operation: 'delete', table: tableName, query });
    },
  };
}

export default {
  trackSupabaseError,
  withSupabaseErrorTracking,
  createTableErrorTracker,
};
