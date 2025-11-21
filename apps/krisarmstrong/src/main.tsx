import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ThemeProvider,
  krisArmstrongTheme,
  ErrorBoundary,
} from '@krisarmstrong/web-foundation';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';
import { initSentry } from './lib/sentry.ts';
import './index.css';

// Initialize error tracking
initSentry();

// Lazy load all page components
const Home = React.lazy(() => import('./pages/Home.tsx'));
const Resume = React.lazy(() => import('./pages/Resume.tsx'));
const About = React.lazy(() => import('./pages/About.tsx'));
const Skills = React.lazy(() => import('./pages/Skills.tsx'));
const Projects = React.lazy(() => import('./pages/Projects.tsx'));
const Contact = React.lazy(() => import('./pages/Contact.tsx'));
const Blog = React.lazy(() => import('./pages/Blog.tsx'));
const BlogPost = React.lazy(() => import('./pages/BlogPost.tsx'));
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
        path: 'skills',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Skills />
          </Suspense>
        )
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Projects />
          </Suspense>
        )
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Blog />
          </Suspense>
        )
      },
      {
        path: 'blog/:id',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <BlogPost />
          </Suspense>
        )
      },
      {
        path: 'resume',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Resume />
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
      {
        path: 'certifications',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <Skills />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFound />
          </Suspense>
        )
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider initialTheme={krisArmstrongTheme} initialMode="auto">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
