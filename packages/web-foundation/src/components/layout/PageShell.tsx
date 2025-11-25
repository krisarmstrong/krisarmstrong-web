import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-surface-base text-text-primary transition-colors duration-200 ${className}`}
    >
      <main
        id="main-content"
        className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pt-8 pb-32"
      >
        {children}
      </main>
    </div>
  );
}
