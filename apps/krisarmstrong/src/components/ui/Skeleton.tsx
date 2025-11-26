interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-raised rounded ${className}`}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={`skeleton-line-${i}`}
          className={`h-4 ${i === lines - 1 ? 'w-5/6' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-raised shadow-lg p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={3} />
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  );
}
