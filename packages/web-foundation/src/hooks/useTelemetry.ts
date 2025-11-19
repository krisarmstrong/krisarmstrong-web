import { useCallback, useEffect, useRef } from 'react';

// Type declarations for third-party analytics globals
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    GA_MEASUREMENT_ID?: string;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Telemetry event properties
 */
export interface TelemetryEventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Error context for error tracking
 */
export interface TelemetryErrorContext {
  message: string;
  stack?: string;
  componentStack?: string;
  [key: string]: unknown;
}

/**
 * Page view properties
 */
export interface TelemetryPageViewProperties {
  path?: string;
  title?: string;
  referrer?: string;
  [key: string]: unknown;
}

/**
 * Telemetry provider interface
 */
export interface TelemetryProvider {
  trackEvent: (eventName: string, properties?: TelemetryEventProperties) => void;
  trackError: (error: Error | TelemetryErrorContext) => void;
  trackPageView: (properties?: TelemetryPageViewProperties) => void;
  identify?: (userId: string, traits?: Record<string, unknown>) => void;
}

/**
 * Configuration options for telemetry
 */
export interface TelemetryConfig {
  /** Enable/disable all telemetry tracking */
  enabled?: boolean;
  /** Custom telemetry provider implementation */
  provider?: TelemetryProvider;
  /** Default properties to include with all events */
  defaultProperties?: TelemetryEventProperties;
  /** Enable debug logging */
  debug?: boolean;
  /** Enable automatic error tracking */
  trackErrors?: boolean;
  /** Enable automatic page view tracking */
  trackPageViews?: boolean;
  /** Maximum retries for provider detection (default: 10) */
  maxProviderRetries?: number;
  /** Retry interval in ms for provider detection (default: 500) */
  providerRetryInterval?: number;
  /** Current page path for SPA tracking */
  currentPath?: string;
}

/**
 * Return type for useTelemetry hook
 */
export interface UseTelemetryReturn {
  trackEvent: (eventName: string, properties?: TelemetryEventProperties) => void;
  trackError: (error: Error | TelemetryErrorContext) => void;
  trackPageView: (properties?: TelemetryPageViewProperties) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  isEnabled: boolean;
}

/**
 * Default console-based telemetry provider (for development)
 */
const consoleProvider: TelemetryProvider = {
  trackEvent: (eventName, properties) => {
    console.log('[Telemetry Event]', eventName, properties);
  },
  trackError: (error) => {
    console.error('[Telemetry Error]', error);
  },
  trackPageView: (properties) => {
    console.log('[Telemetry Page View]', properties);
  },
  identify: (userId, traits) => {
    console.log('[Telemetry Identify]', userId, traits);
  },
};

/**
 * Google Analytics provider (if window.gtag is available)
 */
const createGoogleAnalyticsProvider = (): TelemetryProvider | null => {
  if (typeof window === 'undefined' || !window.gtag) {
    return null;
  }

  const gtag = window.gtag;

  return {
    trackEvent: (eventName, properties) => {
      gtag('event', eventName, properties);
    },
    trackError: (error) => {
      const errorMessage = error instanceof Error ? error.message : error.message;
      gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
      });
    },
    trackPageView: (properties) => {
      gtag('event', 'page_view', properties);
    },
    identify: (userId) => {
      if (window.GA_MEASUREMENT_ID) {
        gtag('config', window.GA_MEASUREMENT_ID, {
          user_id: userId,
        });
      }
    },
  };
};

/**
 * Plausible Analytics provider (if window.plausible is available)
 */
const createPlausibleProvider = (): TelemetryProvider | null => {
  if (typeof window === 'undefined' || !window.plausible) {
    return null;
  }

  const plausible = window.plausible;

  return {
    trackEvent: (eventName, properties) => {
      plausible(eventName, { props: properties });
    },
    trackError: (error) => {
      const errorMessage = error instanceof Error ? error.message : error.message;
      plausible('Error', { props: { error: errorMessage } });
    },
    trackPageView: () => {
      plausible('pageview');
    },
  };
};

/**
 * Custom React hook for telemetry tracking
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const telemetry = useTelemetry({ enabled: true });
 *
 *   const handleClick = () => {
 *     telemetry.trackEvent('button_clicked', { button: 'submit' });
 *   };
 *
 *   return <button onClick={handleClick}>Submit</button>;
 * }
 * ```
 */
export function useTelemetry(config: TelemetryConfig = {}): UseTelemetryReturn {
  const {
    enabled = true,
    provider,
    defaultProperties = {},
    debug = false,
    trackErrors = false,
    trackPageViews = false,
    maxProviderRetries = 10,
    providerRetryInterval = 500,
    currentPath,
  } = config;

  const providerRef = useRef<TelemetryProvider | null>(null);
  const retriesRef = useRef(0);

  // Initialize provider with retry logic
  useEffect(() => {
    if (!enabled) {
      providerRef.current = null;
      return;
    }

    // Use custom provider if provided
    if (provider) {
      providerRef.current = provider;
      if (debug) console.log('[Telemetry] Using custom provider');
      return;
    }

    // Auto-detect analytics provider with retry logic
    const detectProvider = () => {
      const gaProvider = createGoogleAnalyticsProvider();
      const plausibleProvider = createPlausibleProvider();

      if (gaProvider) {
        providerRef.current = gaProvider;
        if (debug) console.log('[Telemetry] Using Google Analytics provider');
        return true;
      } else if (plausibleProvider) {
        providerRef.current = plausibleProvider;
        if (debug) console.log('[Telemetry] Using Plausible Analytics provider');
        return true;
      }
      return false;
    };

    // Try immediate detection
    if (detectProvider()) {
      return;
    }

    // Retry detection if analytics scripts load asynchronously
    const retryInterval = setInterval(() => {
      retriesRef.current += 1;

      if (detectProvider()) {
        clearInterval(retryInterval);
      } else if (retriesRef.current >= maxProviderRetries) {
        clearInterval(retryInterval);
        // Fallback to console provider in debug mode
        providerRef.current = debug ? consoleProvider : null;
        if (debug) {
          console.log(
            `[Telemetry] No provider detected after ${maxProviderRetries} retries, using console provider (debug mode)`
          );
        }
      }
    }, providerRetryInterval);

    return () => clearInterval(retryInterval);
  }, [enabled, provider, debug, maxProviderRetries, providerRetryInterval]);

  // Automatic error tracking
  useEffect(() => {
    if (!enabled || !trackErrors || !providerRef.current) return;

    const handleError = (event: ErrorEvent) => {
      if (providerRef.current) {
        providerRef.current.trackError({
          message: event.message,
          stack: event.error?.stack,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (providerRef.current) {
        providerRef.current.trackError({
          message: `Unhandled Promise Rejection: ${event.reason}`,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enabled, trackErrors]);

  // Automatic page view tracking with SPA support
  useEffect(() => {
    if (!enabled || !trackPageViews || !providerRef.current) return;

    providerRef.current.trackPageView({
      path: currentPath || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });

    if (debug) {
      console.log('[Telemetry] Page view tracked:', currentPath || window.location.pathname);
    }
  }, [enabled, trackPageViews, currentPath, debug]);

  const trackEvent = useCallback(
    (eventName: string, properties: TelemetryEventProperties = {}) => {
      if (!enabled || !providerRef.current) return;

      const mergedProperties = { ...defaultProperties, ...properties };
      providerRef.current.trackEvent(eventName, mergedProperties);

      if (debug) {
        console.log('[Telemetry trackEvent]', eventName, mergedProperties);
      }
    },
    [enabled, defaultProperties, debug]
  );

  const trackError = useCallback(
    (error: Error | TelemetryErrorContext) => {
      if (!enabled || !providerRef.current) return;

      providerRef.current.trackError(error);

      if (debug) {
        console.log('[Telemetry trackError]', error);
      }
    },
    [enabled, debug]
  );

  const trackPageView = useCallback(
    (properties: TelemetryPageViewProperties = {}) => {
      if (!enabled || !providerRef.current) return;

      const defaultPageViewProps = {
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      };

      providerRef.current.trackPageView({ ...defaultPageViewProps, ...properties });

      if (debug) {
        console.log('[Telemetry trackPageView]', properties);
      }
    },
    [enabled, debug]
  );

  const identify = useCallback(
    (userId: string, traits: Record<string, unknown> = {}) => {
      if (!enabled || !providerRef.current?.identify) return;

      providerRef.current.identify(userId, traits);

      if (debug) {
        console.log('[Telemetry identify]', userId, traits);
      }
    },
    [enabled, debug]
  );

  return {
    trackEvent,
    trackError,
    trackPageView,
    identify,
    isEnabled: enabled,
  };
}
