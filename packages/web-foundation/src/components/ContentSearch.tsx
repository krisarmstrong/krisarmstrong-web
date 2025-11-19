import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchableItem {
  [key: string]: unknown;
}

export interface ContentSearchProps<T extends SearchableItem> {
  /** Array of items to search through */
  items: T[];
  /** Callback when search results change */
  onSearch: (filtered: T[]) => void;
  /** Fields to search within each item (supports nested paths like 'author.name') */
  searchFields?: string[];
  /** Placeholder text for search input */
  placeholder?: string;
  /** Accent color theme */
  accentColor?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  /** Show result count */
  showResultCount?: boolean;
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
  searchFields = ['title', 'excerpt'],
  placeholder = 'Search...',
  accentColor = 'violet',
  showResultCount = true,
  debounceMs = 300,
  className = '',
}: ContentSearchProps<T>) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const colors = accentColors[accentColor];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

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
    if (!debouncedQuery.trim()) {
      return items;
    }

    const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean);

    return items.filter((item) => {
      // Build searchable text from all specified fields
      const searchableText = searchFields
        .map((field) => {
          const value = getNestedValue(item, field);

          // Handle arrays (like tags)
          if (Array.isArray(value)) {
            return value.join(' ');
          }

          // Handle strings and numbers
          return String(value || '');
        })
        .join(' ')
        .toLowerCase();

      // All search terms must be present
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [items, debouncedQuery, searchFields]);

  // Notify parent of filtered results
  useEffect(() => {
    onSearch(filteredItems);
  }, [filteredItems, onSearch]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search size={20} className={`absolute left-4 ${colors.text} pointer-events-none`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-12 py-3
              bg-gray-900/50 backdrop-blur-sm
              border border-gray-700 rounded-lg
              text-white placeholder-gray-500
              transition-all duration-200
              ${colors.border} ${colors.ring}
              focus:outline-none focus:ring-2
            `}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-gray-700 rounded transition-colors"
              aria-label="Clear search"
            >
              <X size={18} className="text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Result Count */}
      {showResultCount && debouncedQuery && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">
            Found {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          </span>
          {filteredItems.length > 0 && <span className="text-gray-600">•</span>}
          {filteredItems.length > 0 && (
            <span className={`${colors.text} font-medium`}>"{debouncedQuery}"</span>
          )}
        </div>
      )}

      {/* No Results Message */}
      {showResultCount && debouncedQuery && filteredItems.length === 0 && (
        <div className={`p-4 rounded-lg ${colors.bg} border border-gray-700`}>
          <p className="text-sm text-gray-400 text-center">
            No results found for{' '}
            <span className={`${colors.text} font-medium`}>"{debouncedQuery}"</span>
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
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
