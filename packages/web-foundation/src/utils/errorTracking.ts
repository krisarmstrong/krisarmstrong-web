/**
 * Lightweight error tracking utility
 * Can be extended with Sentry or other services in individual apps
 */

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

type ErrorCallback = (error: Error, data: ErrorData) => void;

class ErrorTracker {
  private errors: ErrorData[];
  private maxErrors: number;
  private callbacks: ErrorCallback[];

  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.callbacks = [];
  }

  /**
   * Register a callback to be called when errors are logged
   * Useful for integrating with Sentry or other services
   */
  onError(callback: ErrorCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Log an error
   */
  logError(error: Error, context: Record<string, unknown> = {}): void {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...context,
    };

    this.errors.unshift(errorData);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log to console in development (localhost)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('[Error Tracker]', errorData);
    }

    // Notify callbacks
    this.callbacks.forEach((cb) => cb(error, errorData));
  }

  /**
   * Get all logged errors
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
   */
  getStats(): ErrorStats {
    const errorsByType: Record<string, number> = {};
    const errorsByUrl: Record<string, number> = {};

    this.errors.forEach((error) => {
      const type = error.message || 'Unknown';
      errorsByType[type] = (errorsByType[type] || 0) + 1;

      const url = error.url || 'Unknown';
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

// Singleton instance
export const errorTracker = new ErrorTracker();

/**
 * Set up global error handlers
 * Call this in your app's main.tsx
 */
export function setupErrorTracking(): void {
  if (typeof window === 'undefined') return;

  // Handle unhandled errors
  window.addEventListener('error', (event: ErrorEvent) => {
    const error: Error = event.error instanceof Error ? event.error : new Error(event.message);
    errorTracker.logError(error, {
      type: 'unhandled',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    event.preventDefault();

    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    errorTracker.logError(error, {
      type: 'unhandledRejection',
    });

    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
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

export type { ErrorData, ErrorStats, ErrorCallback };
export default errorTracker;
