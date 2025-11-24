import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageShell } from '@krisarmstrong/web-foundation';
import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';

export default function Layout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <header>
        <Navbar />
      </header>
      <PageShell>
        <Suspense fallback={<PageLoadingFallback message="Loading page..." />}>
          <div id="main-content">
            <Outlet />
          </div>
        </Suspense>
      </PageShell>
      <Footer />
    </>
  );
}
