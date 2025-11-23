import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry error tracking
 *
 * Set VITE_SENTRY_DSN in .env to enable error tracking:
 * VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.info('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in prod, 100% in dev

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% when error occurs

    // Ignore expected errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Failed to fetch',
      // React Router
      'ResizeObserver loop limit exceeded',
    ],

    beforeSend: (event, _hint) => {
      // Filter out events from localhost in production
      if (import.meta.env.PROD && event.request?.url?.includes('localhost')) {
        return null;
      }
      return event;
    },
  });
}

/**
 * Capture an exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}
