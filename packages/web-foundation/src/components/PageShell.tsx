import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { layoutTokens } from '../tokens';

interface PageShellProps {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  className?: string;
}

export function PageShell({ breadcrumbs, children, className = '' }: PageShellProps) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-surface-base text-text-primary transition-colors duration-200 ${className}`}
    >
      <main
        id="main-content"
        className="flex-grow px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: layoutTokens.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          paddingTop: '2rem',
          paddingBottom: '8rem'
        }}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        )}
        {children}
      </main>
    </div>
  );
}
