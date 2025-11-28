import { useState, useEffect, useMemo, useDeferredValue, useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchableItem {
  [key: string]: unknown;
}

export interface ContentSearchProps<T extends SearchableItem> {
  /** Array of items to search through */
  items: T[];
  /**
   * Callback when search results change.
   * Receives the filtered items and search metadata (trimmed query + terms).
   */
  onSearch: (filtered: T[], meta?: { query: string; terms: string[] }) => void;
  /**
   * Optional callback when query changes (trimmed). Use to track search state.
   */
  onQueryChange?: (query: string) => void;
  /** Fields to search within each item (supports nested paths like 'author.name') */
  searchFields?: string[];
  /** Placeholder text for search input */
  placeholder?: string;
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  /** Show result count */
  showResultCount?: boolean;
  /** Show search icon */
  showIcon?: boolean;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Custom className for wrapper */
  className?: string;
}

const accentColors = {
  violet: {
    border: 'focus:border-violet-500',
    ring: 'focus:ring-violet-500/20',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  emerald: {
    border: 'focus:border-emerald-500',
    ring: 'focus:ring-emerald-500/20',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  blue: {
    border: 'focus:border-blue-500',
    ring: 'focus:ring-blue-500/20',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  amber: {
    border: 'focus:border-amber-500',
    ring: 'focus:ring-amber-500/20',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  rose: {
    border: 'focus:border-rose-500',
    ring: 'focus:ring-rose-500/20',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
};

/**
 * ContentSearch - A flexible search component for filtering content
 *
 * @example
 * ```tsx
 * <ContentSearch
 *   items={blogPosts}
 *   onSearch={(filtered) => setFilteredPosts(filtered)}
 *   searchFields={['title', 'excerpt', 'tags']}
 *   placeholder="Search blog posts..."
 *   accentColor="violet"
 *   showResultCount
 * />
 * ```
 */
export function ContentSearch<T extends SearchableItem>({
  items,
  onSearch,
  onQueryChange,
  searchFields = ['title', 'excerpt'],
  placeholder = 'Search...',
  accentColor = 'violet',
  showResultCount = true,
  showIcon = false,
  debounceMs = 300,
  className = '',
}: ContentSearchProps<T>) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  // Track if clear was just called to prevent useEffect from overwriting with stale deferred value
  const justClearedRef = useRef(false);

  const colors = accentColors[accentColor];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onQueryChange?.(query.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onQueryChange]);

  // React 19: Defer filtering to keep input responsive during expensive operations
  const deferredQuery = useDeferredValue(debouncedQuery);

  // Normalized query & split terms (reused for filtering + callbacks)
  const normalizedQuery = useMemo(() => deferredQuery.trim(), [deferredQuery]);
  const searchTerms = useMemo(
    () => normalizedQuery.toLowerCase().split(' ').filter(Boolean),
    [normalizedQuery]
  );

  // Get nested value from object using dot notation path
  const getNestedValue = (obj: SearchableItem, path: string): unknown => {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);
  };

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      // Build searchable text from all specified fields
      const searchableText = searchFields
        .map((field) => {
          const value = getNestedValue(item, field);

          // Handle arrays (like tags)
          if (Array.isArray(value)) {
            return value.join(' ');
          }

          // Handle objects (convert to empty string to avoid [object Object])
          if (typeof value === 'object' && value !== null) {
            return '';
          }

          // Handle strings and numbers
          // At this point, value can only be a primitive (string, number, boolean, etc.)
          if (value === undefined || value === null) {
            return '';
          }
          return String(value as string | number | boolean);
        })
        .join(' ')
        .toLowerCase();

      // All search terms must be present
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [items, normalizedQuery, searchTerms, searchFields]);

  // Notify parent of filtered results
  useEffect(() => {
    // Skip if clear was just called - we already called onSearch with all items
    // Wait for deferredQuery to catch up (become empty string)
    if (justClearedRef.current) {
      if (normalizedQuery === '') {
        // Deferred value has caught up, reset the flag
        justClearedRef.current = false;
      }
      // Skip this effect until deferred value catches up
      return;
    }
    onSearch(filteredItems, { query: normalizedQuery, terms: searchTerms });
  }, [filteredItems, normalizedQuery, onSearch, searchTerms]);

  const handleClear = () => {
    // Set flag to prevent useEffect from overwriting with stale deferred value
    justClearedRef.current = true;
    setQuery('');
    setDebouncedQuery('');
    // Immediately notify parent with all items to avoid useDeferredValue lag
    onSearch(items, { query: '', terms: [] });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          {showIcon && (
            <Search size={20} className={`absolute left-4 ${colors.text} pointer-events-none`} />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`
              w-full ${showIcon ? 'pl-12' : 'pl-4'} pr-12 py-3
              bg-surface-raised backdrop-blur-sm
              border border-surface-border rounded-lg
              text-text-primary placeholder-text-muted
              transition-all duration-200
              ${colors.border} ${colors.ring}
              focus:outline-none focus:ring-2
            `}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-surface-hover rounded transition-colors"
              aria-label="Clear search"
            >
              <X size={18} className="text-text-muted hover:text-text-primary" />
            </button>
          )}
        </div>
      </div>

      {/* Result Count */}
      {showResultCount && debouncedQuery && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">
            Found {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          </span>
          {filteredItems.length > 0 && <span className="text-text-muted opacity-50">•</span>}
          {filteredItems.length > 0 && (
            <span className={`${colors.text} font-medium`}>&quot;{debouncedQuery}&quot;</span>
          )}
        </div>
      )}

      {/* No Results Message */}
      {showResultCount && debouncedQuery && filteredItems.length === 0 && (
        <div className={`p-4 rounded-lg ${colors.bg} border border-surface-border`}>
          <p className="text-sm text-text-muted text-center">
            No results found for{' '}
            <span className={`${colors.text} font-medium`}>&quot;{debouncedQuery}&quot;</span>
          </p>
          <p className="text-xs text-text-muted opacity-75 text-center mt-1">
            Try different keywords or{' '}
            <button onClick={handleClear} className={`${colors.text} hover:underline`}>
              clear search
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default ContentSearch;
