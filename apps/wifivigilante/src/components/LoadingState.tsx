import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 48, className = '' }: LoadingSpinnerProps) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 size={size} className="animate-spin text-text-brand-primary" />
  </div>
);

interface LoadingCardProps {
  message?: string;
}

export const LoadingCard = ({ message = 'Loading...' }: LoadingCardProps) => (
  <div className="bg-surface-raised rounded-lg p-8 text-center">
    <LoadingSpinner size={48} className="mb-4" />
    <p className="text-text-primary">{message}</p>
  </div>
);

export const LoadingPage = ({ message = 'Loading...' }: LoadingCardProps) => (
  <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-white">
    <LoadingSpinner size={64} />
    <p className="mt-4 text-lg text-text-primary">{message}</p>
  </div>
);

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export const LoadingSkeleton = ({ lines = 3, className = '' }: LoadingSkeletonProps) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-surface-raised rounded mb-3 last:mb-0"
        style={{ width: `${100 - i * 10}%` }}
      />
    ))}
  </div>
);
