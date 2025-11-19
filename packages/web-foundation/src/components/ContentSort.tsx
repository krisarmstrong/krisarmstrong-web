import { ArrowUpDown } from 'lucide-react';

export interface SortOption<T extends string = string> {
  /** Unique value for this sort option */
  value: T;
  /** Display label */
  label: string;
  /** Optional description for tooltips */
  description?: string;
}

export interface ContentSortProps<T extends string = string> {
  /** Current sort value */
  value: T;
  /** Callback when sort changes */
  onChange: (value: T) => void;
  /** Available sort options */
  options: SortOption<T>[];
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  /** Label text (default: "Sort by") */
  label?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

const accentColors = {
  violet: 'focus:border-violet-500 focus:ring-violet-500/20',
  emerald: 'focus:border-emerald-500 focus:ring-emerald-500/20',
  blue: 'focus:border-blue-500 focus:ring-blue-500/20',
  amber: 'focus:border-amber-500 focus:ring-amber-500/20',
  rose: 'focus:border-rose-500 focus:ring-rose-500/20',
};

/**
 * ContentSort - A reusable sort dropdown component
 *
 * @example
 * ```tsx
 * const sortOptions = [
 *   { value: 'newest', label: 'Newest First' },
 *   { value: 'oldest', label: 'Oldest First' },
 *   { value: 'popular', label: 'Most Popular' },
 * ];
 *
 * <ContentSort
 *   value={sortBy}
 *   onChange={setSortBy}
 *   options={sortOptions}
 *   accentColor="violet"
 * />
 * ```
 */
export function ContentSort<T extends string = string>({
  value,
  onChange,
  options,
  accentColor = 'violet',
  label = 'Sort by',
  showIcon = true,
  className = '',
}: ContentSortProps<T>) {
  const colors = accentColors[accentColor];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <ArrowUpDown size={16} className="text-gray-400" />
      )}
      <label htmlFor="content-sort" className="text-sm text-gray-400 whitespace-nowrap">
        {label}
      </label>
      <select
        id="content-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`
          px-3 py-2 pr-10
          bg-gray-900/50 backdrop-blur-sm
          border border-gray-700 rounded-lg
          text-white text-sm
          transition-all duration-200
          ${colors}
          focus:outline-none focus:ring-2
          cursor-pointer
          hover:border-gray-600
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ContentSort;
