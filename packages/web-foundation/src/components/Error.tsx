import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { isDevelopmentEnvironment, getSentry } from '../utils/env';
import DOMPurify from 'dompurify';

// ============================================================================
// Error Message
// ============================================================================

export interface ErrorMessageProps {
  /** Error to display (can be Error object, string, or object with message property) */
  error?: { message?: string } | Error | string | null;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Optional CSS class name */
  className?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

const errorBorderColors = {
  violet: 'border-violet-500',
  blue: 'border-blue-500',
  green: 'border-green-500',
  red: 'border-red-500',
  yellow: 'border-yellow-500',
  gray: 'border-gray-500',
};

const errorBgColors = {
  violet: 'bg-violet-900/20',
  blue: 'bg-blue-900/20',
  green: 'bg-green-900/20',
  red: 'bg-red-900/20',
  yellow: 'bg-yellow-900/20',
  gray: 'bg-gray-900/20',
};

const errorTextColors = {
  violet: 'text-violet-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  gray: 'text-gray-400',
};

const errorButtonColors = {
  violet: 'bg-violet-600 hover:bg-violet-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
  gray: 'bg-gray-600 hover:bg-gray-700',
};

/**
 * ErrorMessage - Inline error message component
 */
export function ErrorMessage({
  error,
  onRetry,
  className = '',
  variant = 'red',
}: ErrorMessageProps) {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error && typeof error === 'object' && 'message' in error
        ? error.message
        : 'An unexpected error occurred. Please try again.';

  const sanitizedErrorMessage = { __html: DOMPurify.sanitize(errorMessage || '') };

  return (
    <div
      className={`${errorBgColors[variant]} border ${errorBorderColors[variant]} rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className={`${errorTextColors[variant]} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          <h3 className={`${errorTextColors[variant]} font-semibold mb-1`}>Error</h3>
          <p className={`${errorTextColors[variant]} text-sm`}>
            {sanitizedErrorMessage.__html && sanitizedErrorMessage.__html.length > 0 ? (
              <span dangerouslySetInnerHTML={sanitizedErrorMessage} />
            ) : (
              errorMessage
            )}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 flex items-center gap-2 px-3 py-1.5 ${errorButtonColors[variant]} text-white text-sm rounded transition-colors`}
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error Card
// ============================================================================

export interface ErrorCardProps {
  /** Error to display */
  error?: { message?: string } | Error | string | null;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

/**
 * ErrorCard - Card-style error display
 */
export function ErrorCard({ error, onRetry, variant = 'red' }: ErrorCardProps) {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error && typeof error === 'object' && 'message' in error
        ? error.message
        : 'We encountered an error while loading this content.';

  const sanitizedErrorMessage = { __html: DOMPurify.sanitize(errorMessage || '') };

  return (
    <div className="bg-gray-800 rounded-lg p-8 text-center">
      <div
        className={`mx-auto w-16 h-16 ${errorBgColors[variant]} rounded-full flex items-center justify-center mb-4`}
      >
        <AlertCircle className={errorTextColors[variant]} size={32} />
      </div>
      <h3 className={`text-xl font-semibold ${errorTextColors[variant]} mb-2`}>
        Something went wrong
      </h3>
      <p className="text-gray-300 mb-4">
        {sanitizedErrorMessage.__html && sanitizedErrorMessage.__html.length > 0 ? (
          <span dangerouslySetInnerHTML={sanitizedErrorMessage} />
        ) : (
          errorMessage
        )}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`flex items-center gap-2 mx-auto px-4 py-2 ${errorButtonColors[variant]} text-white rounded transition-colors`}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Error Page
// ============================================================================

export interface ErrorPageProps {
  /** Error to display */
  error?: { message?: string } | Error | string | null;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

/**
 * ErrorPage - Full-page error display
 */
export function ErrorPage({ error, onRetry, variant = 'red' }: ErrorPageProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-white px-4">
      <div className="max-w-md w-full">
        <ErrorCard error={error} onRetry={onRetry} variant={variant} />
      </div>
    </div>
  );
}

// ============================================================================
// Error Boundary
// ============================================================================

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Optional error handler callback (e.g., for Sentry) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional home link path (default: "/") */
  homePath?: string;
  /** Color variant for default fallback */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  /** Show dev details in development mode */
  showDevDetails?: boolean;
  /** Enable automatic Sentry error tracking (default: true if Sentry is available) */
  enableSentry?: boolean;
  /** Additional context to attach to error reports */
  errorContext?: Record<string, unknown>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary - React error boundary component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => captureException(error, errorInfo)}
 *   variant="violet"
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, showDevDetails = true, enableSentry = true, errorContext = {} } = this.props;

    // Structured telemetry logging
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      context: errorContext,
    };

    // Log to console in development
    if (isDevelopmentEnvironment && showDevDetails) {
      console.error('[ErrorBoundary] Caught error:', errorData);
    }

    // Automatically send to Sentry if available and enabled
    if (enableSentry) {
      const Sentry = getSentry();
      if (Sentry) {
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
            custom: errorContext,
          },
          tags: {
            errorBoundary: 'true',
            location: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
          },
          level: 'error',
        });
      }
    }

    // Call optional error handler for custom tracking
    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  public render() {
    const {
      children,
      fallback,
      homePath = '/',
      variant = 'violet',
      showDevDetails = true,
    } = this.props;

    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }

      const buttonClasses = errorButtonColors[variant];

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold mb-4 text-white">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We're sorry, but something unexpected happened. The error has been logged.
            </p>

            {isDevelopmentEnvironment && showDevDetails && this.state.error && (
              <details className="mb-6 text-left bg-gray-900 p-4 rounded-lg">
                <summary
                  className={`cursor-pointer ${errorTextColors[variant]} font-semibold mb-2`}
                >
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className={`px-6 py-3 ${buttonClasses} text-white font-semibold rounded-lg transition`}
              >
                Reload Page
              </button>
              <a
                href={homePath}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
