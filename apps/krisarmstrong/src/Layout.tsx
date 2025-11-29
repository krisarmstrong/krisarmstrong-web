import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageShell } from '@krisarmstrong/web-foundation';
import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';

/**
 * Scroll to top on route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
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
