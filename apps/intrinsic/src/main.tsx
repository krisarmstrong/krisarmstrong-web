import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@krisarmstrong/web-foundation';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';
import * as Sentry from '@sentry/react';
import './index.css';

// Initialize Sentry for error tracking
if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
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
  });
}

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home.tsx'));
const About = React.lazy(() => import('./pages/About.tsx'));
const Services = React.lazy(() => import('./pages/Services.tsx'));
const Contact = React.lazy(() => import('./pages/Contact.tsx'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy.tsx'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService.tsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Services />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: 'terms-of-service',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
