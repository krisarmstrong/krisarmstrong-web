import { Filter, X } from 'lucide-react';

export interface ActiveFilter {
  /** Unique identifier for the filter */
  id: string;
  /** Display label for the filter type (e.g., "Tag", "Category") */
  label?: string;
  /** Current value of the filter */
  value: string;
  /** Callback when filter is removed */
  onRemove: () => void;
}

export interface ActiveFilterBadgesProps {
  /** Array of active filters to display */
  filters: ActiveFilter[];
  /** Optional result count to display */
  resultCount?: number;
  /** Label for results (e.g., "posts", "cases", "items") */
  resultLabel?: string;
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  /** Callback to clear all filters */
  onClearAll?: () => void;
  /** Message to show when no filters are active */
  emptyMessage?: string;
  /** Custom className */
  className?: string;
}

const accentColors = {
  violet: {
    icon: 'text-violet-400',
    badge: 'bg-violet-500 hover:bg-violet-600',
  },
  emerald: {
    icon: 'text-emerald-400',
    badge: 'bg-emerald-500 hover:bg-emerald-600',
  },
  blue: {
    icon: 'text-blue-400',
    badge: 'bg-blue-500 hover:bg-blue-600',
  },
  amber: {
    icon: 'text-amber-400',
    badge: 'bg-amber-500 hover:bg-amber-600',
  },
  rose: {
    icon: 'text-rose-400',
    badge: 'bg-rose-500 hover:bg-rose-600',
  },
};

/**
 * ActiveFilterBadges - Display active filters as removable badges
 *
 * Shows currently applied filters with the ability to remove individual filters
 * or clear all at once. Displays result count when provided.
 *
 * @example
 * ```tsx
 * <ActiveFilterBadges
 *   filters={[
 *     { id: 'tag', value: 'networking', onRemove: () => clearTag() }
 *   ]}
 *   resultCount={12}
 *   resultLabel="posts"
 *   accentColor="violet"
 *   emptyMessage="Click tags to filter"
 * />
 * ```
 */
export function ActiveFilterBadges({
  filters,
  resultCount,
  resultLabel = 'items',
  accentColor = 'violet',
  onClearAll,
  emptyMessage = 'No filters applied',
  className = '',
}: ActiveFilterBadgesProps) {
  const colors = accentColors[accentColor];
  const hasFilters = filters.length > 0;

  if (!hasFilters) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-text-muted">{emptyMessage}</span>
        {resultCount !== undefined && (
          <span className="text-sm text-text-muted">
            • {resultCount} {resultCount === 1 ? resultLabel.replace(/s$/, '') : resultLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <Filter size={16} className={colors.icon} />
      <span className="text-sm text-text-muted">Filtered by:</span>

      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={filter.onRemove}
          className={`
            px-3 py-1
            ${colors.badge}
            text-white text-sm rounded-full
            transition-colors
            inline-flex items-center gap-1.5
            hover:shadow-md
          `}
          aria-label={`Remove filter: ${filter.label || ''} ${filter.value}`}
        >
          {filter.label && <span className="font-medium">{filter.label}:</span>}
          <span>{filter.value}</span>
          <X size={14} className="opacity-80" />
        </button>
      ))}

      {resultCount !== undefined && (
        <span className="text-sm text-text-muted">
          ({resultCount} {resultCount === 1 ? resultLabel.replace(/s$/, '') : resultLabel})
        </span>
      )}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-text-muted hover:text-text-primary underline ml-2"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

export default ActiveFilterBadges;
