import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Theme } from '../types';
import { themeTokens } from '../tokens';
import { isDevelopmentEnvironment, getSentry } from '../utils/env';

// ============================================================================
// Loading Spinner
// ============================================================================

export interface LoadingSpinnerProps {
  /** Size of the spinner in pixels */
  size?: number;
  /** Optional CSS class name */
  className?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  /** Track slow loading (milliseconds, default: 5000ms) */
  trackSlowLoadingAfter?: number;
  /** Context for telemetry */
  loadingContext?: string;
}

const spinnerColors = {
  violet: 'text-violet-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  gray: 'text-gray-400',
};

/**
 * LoadingSpinner - Animated spinner for loading states
 */
export function LoadingSpinner({
  size = 48,
  className = '',
  variant = 'blue',
  trackSlowLoadingAfter = 5000,
  loadingContext = 'unknown'
}: LoadingSpinnerProps) {
  const startTimeRef = useRef<number>(Date.now());
  const trackedRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    trackedRef.current = false;

    const timer = setTimeout(() => {
      if (!trackedRef.current) {
        trackedRef.current = true;
        const duration = Date.now() - startTimeRef.current;

        // Log slow loading to console in development
        if (isDevelopmentEnvironment) {
          console.warn('[LoadingSpinner] Slow loading detected:', {
            context: loadingContext,
            duration,
            threshold: trackSlowLoadingAfter,
          });
        }

        // Send to Sentry if available
        const Sentry = getSentry();
        if (Sentry) {
          Sentry.captureMessage('Slow loading detected', {
            level: 'warning',
            tags: {
              component: 'LoadingSpinner',
              context: loadingContext,
            },
            extra: {
              duration,
              threshold: trackSlowLoadingAfter,
            },
          });
        }
      }
    }, trackSlowLoadingAfter);

    return () => {
      clearTimeout(timer);
      // Track total loading time on unmount
      const totalDuration = Date.now() - startTimeRef.current;
      if (totalDuration > trackSlowLoadingAfter && isDevelopmentEnvironment) {
        console.log('[LoadingSpinner] Completed after slow load:', {
          context: loadingContext,
          duration: totalDuration,
        });
      }
    };
  }, [trackSlowLoadingAfter, loadingContext]);

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <Loader2 size={size} className={`animate-spin ${spinnerColors[variant]}`} aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Loading Card
// ============================================================================

export interface LoadingCardProps {
  /** Loading message to display */
  message?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  /** Theme for surface/text colors */
  theme?: Theme;
}

/**
 * LoadingCard - Card-style loading indicator
 */
export function LoadingCard({
  message = 'Loading...',
  variant = 'blue',
  theme = 'dark',
}: LoadingCardProps) {
  const palette = themeTokens[theme] || themeTokens.dark;
  return (
    <div
      className="rounded-lg p-8 text-center border"
      style={{ backgroundColor: palette.surfaceRaised, borderColor: palette.border, color: palette.textPrimary }}
    >
      <LoadingSpinner size={48} className="mb-4" variant={variant} />
      <p style={{ color: palette.textMuted }}>{message}</p>
    </div>
  );
}

// ============================================================================
// Loading Page
// ============================================================================

export interface LoadingPageProps {
  /** Loading message to display */
  message?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  /** Theme for surface/text colors */
  theme?: Theme;
}

/**
 * LoadingPage - Full-page loading indicator
 */
export function LoadingPage({
  message = 'Loading...',
  variant = 'blue',
  theme = 'dark',
}: LoadingPageProps) {
  const palette = themeTokens[theme] || themeTokens.dark;
  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
      style={{ color: palette.textPrimary }}
    >
      <LoadingSpinner size={64} variant={variant} />
      <p className="mt-4 text-lg" style={{ color: palette.textMuted }}>
        {message}
      </p>
    </div>
  );
}

// ============================================================================
// Skeleton Components
// ============================================================================

export interface SkeletonProps {
  /** Optional CSS class name */
  className?: string;
}

/**
 * Skeleton - Base skeleton loading placeholder
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--theme-surface-hover, #1e293b)' }}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

export interface SkeletonTextProps {
  /** Number of skeleton lines to display */
  lines?: number;
}

/**
 * SkeletonText - Multiple skeleton lines for text content
 */
export function SkeletonText({ lines = 3 }: SkeletonTextProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-5/6' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Skeleton placeholder for card content
 */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-lg p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={3} />
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  );
}
