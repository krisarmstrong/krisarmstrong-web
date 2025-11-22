// src/utils/errorMessages.ts

export class UserFriendlyError extends Error {
  constructor(
    public userMessage: string,
    public technicalMessage?: string,
    public code?: string
  ) {
    super(userMessage);
    this.name = 'UserFriendlyError';
  }
}

interface HttpResponse {
  status?: number;
  data?: { message?: string };
}

interface HttpError extends Error {
  response?: HttpResponse;
}

interface DatabaseError extends Error {
  code?: string;
}

function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as HttpError).response === 'object' &&
    (error as HttpError).response !== null
  );
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as DatabaseError).code === 'string'
  );
}

/**
 * Converts technical errors to user-friendly messages.
 *
 * @param error - The error to convert
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  // Already user-friendly
  if (error instanceof UserFriendlyError) {
    return error.userMessage;
  }

  // Network errors
  if (error instanceof Error) {
    if (error.message === 'Failed to fetch' || !navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }
  }

  // HTTP errors (Supabase/fetch errors)
  if (isHttpError(error)) {
    const response = error.response;

    switch (response?.status) {
      case 400:
        return 'The request was invalid. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested item could not be found. It may have been deleted.";
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return response.data?.message || 'The data provided is invalid. Please check your input.';
      case 429:
        return "You're making too many requests. Please wait a moment and try again.";
      case 500:
        return "We're experiencing technical difficulties. Please try again later.";
      case 503:
        return 'The service is temporarily unavailable. Please try again in a few minutes.';
      default:
        if (response?.status && response.status >= 500) {
          return "We're experiencing technical difficulties. Please try again later.";
        }
    }
  }

  // Database/Supabase errors
  if (isDatabaseError(error)) {
    const code = error.code;

    switch (code) {
      case '23505': // Unique violation
        return 'This item already exists. Please use a different value.';
      case '23503': // Foreign key violation
        return 'This action cannot be completed because other items depend on it.';
      case '23502': // Not null violation
        return 'Please fill in all required fields.';
      case 'PGRST116': // JWT expired
        return 'Your session has expired. Please log in again.';
      default:
        if (import.meta.env.DEV) {
          console.error('Database error code:', code, error);
        }
    }
  }

  // Fallback
  return 'Something went wrong. Please try again.';
}

/**
 * Logs error for developers while showing user-friendly message.
 *
 * @param error - The error to handle
 * @param context - Additional context for logging
 * @returns User-friendly error message
 */
export function handleError(error: unknown, context?: string): string {
  // Log for developers
  if (import.meta.env.DEV) {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  } else {
    // Send to error tracking service in production (future)
    // Sentry.captureException(error, { tags: { context } });
  }

  return getUserFriendlyMessage(error);
}
