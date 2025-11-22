import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { captureException } from "../lib/sentry";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("Uncaught error:", error, errorInfo);
    }

    // Send to Sentry error tracking
    captureException(error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-base px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold mb-4 text-white">Something went wrong</h1>
            <p className="text-text-muted mb-6">
              We're sorry, but something unexpected happened. The error has been logged.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-surface-raised p-4 rounded-lg">
                <summary className="cursor-pointer text-text-accent font-semibold mb-2">
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
                className="px-6 py-3 bg-brand-accent hover:bg-interactive-hover text-white font-semibold rounded-lg transition"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-surface-raised hover:bg-surface-raised text-white font-semibold rounded-lg transition"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
