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
    icon: 'text-brand-accent',
    title: 'text-text-accent',
    button: 'bg-interactive-active hover:bg-interactive-hover',
  },
  emerald: {
    icon: 'text-brand-accent',
    title: 'text-text-accent',
    button: 'bg-interactive-active hover:bg-interactive-hover',
  },
  blue: {
    icon: 'text-brand-accent',
    title: 'text-text-accent',
    button: 'bg-interactive-active hover:bg-interactive-hover',
  },
  amber: {
    icon: 'text-brand-accent',
    title: 'text-text-accent',
    button: 'bg-interactive-active hover:bg-interactive-hover',
  },
  rose: {
    icon: 'text-brand-accent',
    title: 'text-text-accent',
    button: 'bg-interactive-active hover:bg-interactive-hover',
  },
  gray: {
    icon: 'text-text-muted',
    title: 'text-text-primary',
    button: 'bg-interactive-default hover:bg-interactive-hover',
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
      <div className={`mb-4 ${colors.icon}`}>{icon || defaultIcon}</div>

      {/* Title */}
      <h3 className={`text-xl font-semibold mb-2 ${colors.title}`}>{title}</h3>

      {/* Description */}
      {description && <p className="text-text-muted text-sm max-w-md mb-4">{description}</p>}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            mt-2 px-4 py-2
            ${colors.button}
            text-white rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-interactive-focus
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
