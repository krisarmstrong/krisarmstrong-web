import { ChevronDown } from 'lucide-react';

export interface LoadMoreButtonProps {
  /** Number of items remaining to load */
  remainingCount: number;
  /** Number of items to load per click */
  itemsPerLoad: number;
  /** Callback when button is clicked */
  onLoadMore: () => void;
  /** Label for items (e.g., 'posts', 'cases', 'items') */
  itemLabel?: string;
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  /** Button variant */
  variant?: 'primary' | 'secondary';
  /** Custom className */
  className?: string;
}

const accentColors = {
  violet: {
    primary: 'bg-violet-600 hover:bg-violet-700',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-violet-500/30',
  },
  emerald: {
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-emerald-500/30',
  },
  blue: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-blue-500/30',
  },
  amber: {
    primary: 'bg-amber-600 hover:bg-amber-700',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-amber-500/30',
  },
  rose: {
    primary: 'bg-rose-600 hover:bg-rose-700',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-rose-500/30',
  },
};

/**
 * LoadMoreButton - Progressive loading button with remaining count
 *
 * Displays a button to load more items with the count of items to be loaded
 * and remaining count indicator.
 *
 * @example
 * ```tsx
 * <LoadMoreButton
 *   remainingCount={25}
 *   itemsPerLoad={12}
 *   onLoadMore={loadMore}
 *   itemLabel="posts"
 *   accentColor="violet"
 *   variant="primary"
 * />
 * ```
 */
export function LoadMoreButton({
  remainingCount,
  itemsPerLoad,
  onLoadMore,
  itemLabel = 'items',
  accentColor = 'violet',
  variant = 'primary',
  className = '',
}: LoadMoreButtonProps) {
  if (remainingCount <= 0) return null;

  const colors = accentColors[accentColor][variant];
  const loadCount = Math.min(remainingCount, itemsPerLoad);
  const singularLabel = itemLabel.replace(/s$/, '');
  const displayLabel = loadCount === 1 ? singularLabel : itemLabel;

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={onLoadMore}
        className={`
          inline-flex items-center gap-2
          px-6 py-3
          ${colors}
          text-white font-semibold rounded-lg
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        `}
        aria-label={`Load ${loadCount} more ${displayLabel}`}
      >
        Load {loadCount} More {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
        <ChevronDown size={20} />
      </button>
      <p className="text-sm text-gray-500 mt-2">
        {remainingCount} remaining
      </p>
    </div>
  );
}

export default LoadMoreButton;
