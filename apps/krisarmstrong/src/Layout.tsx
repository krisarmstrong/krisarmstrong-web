import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageShell } from '@krisarmstrong/web-foundation';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { PageLoadingFallback } from './components/PageLoadingFallback';

export default function Layout() {
  return (
    <>
      <Navbar />
      <PageShell>
        <Suspense fallback={<PageLoadingFallback message="Loading page..." />}>
          <Outlet />
        </Suspense>
      </PageShell>
      <Footer />
    </>
  );
}
