// src/Layout.tsx
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageShell } from '@krisarmstrong/web-foundation';
import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import { PageLoadingFallback } from './components/PageLoadingFallback.tsx';
export default function Layout(): React.ReactElement {
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
