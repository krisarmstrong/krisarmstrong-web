import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageShell } from '@krisarmstrong/web-foundation';
import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';

export default function Layout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <PageShell>
        <Suspense fallback={<PageLoadingFallback message="Loading page..." />}>
          <Outlet />
        </Suspense>
      </PageShell>
      <Footer />
    </>
  );
}
