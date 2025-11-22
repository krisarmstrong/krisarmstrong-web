// src/pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { H1, P, AccentLink } from '../components/ui/Typography';

export default function ErrorPage(): React.ReactElement {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-text-primary p-6 text-center">
      <AlertTriangle size={64} className="text-error mb-6" />
      <H1 className="!text-3xl sm:!text-4xl mb-3">{errorStatus}</H1>
      <P className="text-lg text-text-primary mb-8 max-w-md">{errorMessage}</P>

      {/* You can provide more details in development */}
      {import.meta.env.DEV && isRouteErrorResponse(error) && error.data && (
        <pre className="bg-surface-raised p-4 rounded-md text-left text-sm text-error overflow-auto max-w-xl mb-8">
          {typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2)}
        </pre>
      )}
      {import.meta.env.DEV && error instanceof Error && error.stack && (
         <details className="text-left text-xs text-text-muted mb-8 max-w-xl">
            <summary>Error Stack (Development)</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
        </details>
      )}

      <AccentLink to="/" iconLeft={<ArrowLeft size={16}/>}>
        Go Back to Home
      </AccentLink>
    </div>
  );
}
