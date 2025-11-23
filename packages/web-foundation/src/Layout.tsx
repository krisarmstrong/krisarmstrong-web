import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageShell } from './components/PageShell';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { LoadingPage } from './components/Loading';
import 'react/jsx-runtime';

export default function Layout() {
  return (
    <>
      {/* Hidden div to ensure Tailwind generates the necessary CSS classes */}
      <div className="hidden bg-surface-raised text-text-primary border-surface-border bg-interactive-active text-interactive-hover bg-surface-hover"></div>
      <div className="header-token">
        <Navbar logo="" navItems={[]} />
      </div>
      <PageShell>
        <Suspense fallback={<LoadingPage message="Loading page..." />}>
          <Outlet />
        </Suspense>
      </PageShell>
      <Footer legalLinks={[]} copyright="" />
    </>
  );
}
