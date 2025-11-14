import { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

export interface EmptyStateProps {
  /** Icon to display (defaults to SearchX) */
  icon?: ReactNode;
  /** Main title/heading */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose' | 'gray';
  /** Minimum height for the empty state container */
  minHeight?: string;
  /** Custom className */
  className?: string;
}

const accentColors = {
  violet: {
    icon: 'text-violet-400',
    title: 'text-violet-300',
    button: 'bg-violet-600 hover:bg-violet-700',
  },
  emerald: {
    icon: 'text-emerald-400',
    title: 'text-emerald-300',
    button: 'bg-emerald-600 hover:bg-emerald-700',
  },
  blue: {
    icon: 'text-blue-400',
    title: 'text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  amber: {
    icon: 'text-amber-400',
    title: 'text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700',
  },
  rose: {
    icon: 'text-rose-400',
    title: 'text-rose-300',
    button: 'bg-rose-600 hover:bg-rose-700',
  },
  gray: {
    icon: 'text-gray-500',
    title: 'text-gray-400',
    button: 'bg-gray-700 hover:bg-gray-600',
  },
};

/**
 * EmptyState - Display empty state with icon, message, and optional action
 *
 * Used to show when there are no results, no data, or filtered results are empty.
 * Includes optional icon, title, description, and action button.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SearchX size={48} />}
 *   title="No cases found"
 *   description="Try adjusting your search or filters"
 *   action={{
 *     label: 'Clear Filters',
 *     onClick: handleClearFilters
 *   }}
 *   accentColor="blue"
 *   minHeight="300px"
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  accentColor = 'gray',
  minHeight = '300px',
  className = '',
}: EmptyStateProps) {
  const colors = accentColors[accentColor];
  const defaultIcon = <SearchX size={48} className="mx-auto" />;

  return (
    <div
      className={`
        text-center py-12 px-4
        flex flex-col justify-center items-center
        ${className}
      `}
      style={{ minHeight }}
    >
      {/* Icon */}
      <div className={`mb-4 ${colors.icon}`}>
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-semibold mb-2 ${colors.title}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-400 text-sm max-w-md mb-4">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            mt-2 px-4 py-2
            ${colors.button}
            text-white rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
