/**
 * Error tracking and logging utility
 * Integrated with Sentry for production error monitoring
 */
import * as Sentry from '@sentry/react';

interface ErrorData {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  [key: string]: unknown;
}

interface ErrorStats {
  total: number;
  errorsByType: Record<string, number>;
  errorsByUrl: Record<string, number>;
  mostRecent?: ErrorData;
}

class ErrorTracker {
  private errors: ErrorData[];
  private maxErrors: number;
  private enabled: boolean;

  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.enabled = !import.meta.env.DEV;
  }

  /**
   * Log an error
   * @param error - Error object
   * @param context - Additional context
   */
  logError(error: Error, context: Record<string, unknown> = {}): void {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };

    // Add to local errors array
    this.errors.unshift(errorData);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[Error Tracker]', errorData);
    }

    // In production, send to error tracking service
    if (this.enabled) {
      this.sendToService(errorData);
    }
  }

  /**
   * Send error to tracking service
   * @param errorData - Error data
   */
  private sendToService(errorData: ErrorData): void {
    const endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT;

    if (!endpoint) return;

    // Use sendBeacon for better reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(errorData)], {
        type: 'application/json',
      });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
        keepalive: true,
      }).catch(() => {});
    }
  }

  /**
   * Get all logged errors
   * @returns Error log
   */
  getErrors(): ErrorData[] {
    return this.errors;
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get error statistics
   * @returns Error stats
   */
  getStats(): ErrorStats {
    const errorsByType: Record<string, number> = {};
    const errorsByUrl: Record<string, number> = {};

    this.errors.forEach(error => {
      // Count by error message
      const type = error.message || 'Unknown';
      // eslint-disable-next-line security/detect-object-injection
      errorsByType[type] = (errorsByType[type] || 0) + 1;

      // Count by URL
      const url = error.url || 'Unknown';
      // eslint-disable-next-line security/detect-object-injection
      errorsByUrl[url] = (errorsByUrl[url] || 0) + 1;
    });

    return {
      total: this.errors.length,
      errorsByType,
      errorsByUrl,
      mostRecent: this.errors[0],
    };
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

/**
 * Set up global error handlers
 */
export function setupErrorTracking(): void {
  // Initialize Sentry if DSN is provided
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn && !import.meta.env.DEV) {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.VITE_APP_ENV || 'production',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event, hint) {
        // Filter out low-value errors
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message).toLowerCase();
          if (message.includes('network error') || message.includes('failed to fetch')) {
            // Log but don't send routine network errors
            return null;
          }
        }
        return event;
      },
    });
  }

  // Handle unhandled errors
  window.addEventListener('error', (event: ErrorEvent) => {
    const error = event.error || new Error(event.message);
    errorTracker.logError(error, {
      type: 'unhandled',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });

    // Also send to Sentry
    if (sentryDsn && !import.meta.env.DEV) {
      Sentry.captureException(error);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // Prevent default behavior (crash)
    event.preventDefault();

    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

    errorTracker.logError(error, {
      type: 'unhandledRejection',
    });

    // Send to Sentry
    if (sentryDsn && !import.meta.env.DEV) {
      Sentry.captureException(error, {
        tags: { type: 'unhandledRejection' },
      });
    }

    // Log user-friendly message
    if (import.meta.env.DEV) {
      console.error('Unhandled promise rejection:', error);
    }
  });

  // Log performance issues
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 3000) {
            errorTracker.logError(new Error('Slow operation detected'), {
              type: 'performance',
              name: entry.name,
              duration: entry.duration,
              entryType: entry.entryType,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch {
      // PerformanceObserver not supported
    }
  }
}

/**
 * Wrapper to track errors in async functions
 * @param fn - Async function to wrap
 * @param context - Context description
 * @returns Wrapped function
 */
export const withErrorTracking = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  context: string
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.logError(error as Error, { context, args });
      throw error;
    }
  };
};

export default errorTracker;
