import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  console.error("Routing Error:", error);

  let errorMessage = "Sorry, an unexpected error has occurred.";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = `Error ${error.status}`;
    errorMessage = error.statusText || errorMessage;

    if (error.status === 404) {
      errorStatus = "404 - Page Not Found";
      errorMessage = "Oops! The page you're looking for doesn't seem to exist.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-base text-text-primary p-6 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">{errorStatus}</h1>
      <p className="text-lg text-text-muted mb-8 max-w-md">{errorMessage}</p>

      {import.meta.env.DEV && isRouteErrorResponse(error) && error.data && (
        <pre className="bg-surface-raised p-4 rounded-md text-left text-sm text-status-error overflow-auto max-w-xl mb-8">
          {typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2)}
        </pre>
      )}
      {import.meta.env.DEV && error instanceof Error && error.stack && (
         <details className="text-left text-xs text-text-muted mb-8 max-w-xl">
            <summary className="cursor-pointer">Error Stack (Development)</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
        </details>
      )}

      <Link
        to="/"
        className="px-6 py-3 bg-brand-accent hover:bg-interactive-hover text-white font-semibold rounded-lg transition"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
