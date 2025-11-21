import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ThemeProvider,
  defaultDarkTheme,
  ErrorBoundary,
} from '@krisarmstrong/web-foundation';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';
import { reportWebVitals } from './utils/webVitals.ts';
import { setupErrorTracking } from './utils/errorTracking.ts';
import './index.css';

// Start Web Vitals monitoring
reportWebVitals();

// Set up error tracking
setupErrorTracking();

// Lazy load all your page components
const Home = React.lazy(() => import('./pages/Home.tsx'));
const CaseOverview = React.lazy(() => import('./pages/CaseOverview.tsx'));
const CaseDetail = React.lazy(() => import('./pages/CaseDetail.tsx'));
const CaseOfTheDay = React.lazy(() => import('./pages/CaseOfTheDay.tsx'));
const About = React.lazy(() => import('./pages/About.tsx'));
const Contact = React.lazy(() => import('./pages/Contact.tsx'));
const PrivacyPolicy = React.lazy(() => import('./pages/Privacy.tsx'));
const TermsOfService = React.lazy(() => import('./pages/Terms.tsx'));

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
        ) 
      },
      { 
        path: 'cases', 
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseOverview />
          </Suspense>
        ) 
      },
      { 
        path: 'cases/:id', 
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseDetail />
          </Suspense>
        ) 
      }, 
      { 
        path: 'case-of-the-day', 
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CaseOfTheDay />
          </Suspense>
        ) 
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <About />
          </Suspense>
        )
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Contact />
          </Suspense>
        )
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        )
      },
      {
        path: 'terms-of-service',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <TermsOfService />
          </Suspense>
        )
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider initialTheme={defaultDarkTheme} initialMode="auto">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
