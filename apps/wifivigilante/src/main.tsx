import React, { Suspense, ComponentType } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary, initTheme } from '@krisarmstrong/web-foundation';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';
import { reportWebVitals } from './utils/webVitals.ts';
import { setupErrorTracking } from './utils/errorTracking.ts';
import './index.css';

// Initialize theme (system preference listening, cross-tab sync)
initTheme();

// Start Web Vitals monitoring
reportWebVitals();

// Set up error tracking
setupErrorTracking();

/**
 * Retry wrapper for lazy imports - handles chunk load failures after deployments.
 * When Vercel deploys, old chunk hashes become invalid. This catches the error
 * and reloads the page to fetch fresh assets.
 */
function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    importFn().catch((error: Error) => {
      // Check if this is a chunk load error (failed to fetch module)
      if (
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk')
      ) {
        // Prevent infinite reload loops - check if we just reloaded
        const lastReload = sessionStorage.getItem('chunk-reload-time');
        const now = Date.now();
        if (lastReload && now - parseInt(lastReload, 10) < 10000) {
          // Reloaded within 10 seconds, don't reload again
          throw error;
        }
        sessionStorage.setItem('chunk-reload-time', now.toString());
        window.location.reload();
      }
      throw error;
    })
  );
}

// Lazy load all page components with chunk error handling
const Home = lazyWithRetry(() => import('./pages/Home.tsx'));
const CaseOverview = lazyWithRetry(() => import('./pages/CaseOverview.tsx'));
const CaseDetail = lazyWithRetry(() => import('./pages/CaseDetail.tsx'));
const CaseOfTheDay = lazyWithRetry(() => import('./pages/CaseOfTheDay.tsx'));
const About = lazyWithRetry(() => import('./pages/About.tsx'));
const Contact = lazyWithRetry(() => import('./pages/Contact.tsx'));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy.tsx'));
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService.tsx'));

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
        path: 'cases',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseOverview />
          </Suspense>
        ),
      },
      {
        path: 'cases/:id',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseDetail />
          </Suspense>
        ),
      },
      {
        path: 'case-of-the-day',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseOfTheDay />
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
