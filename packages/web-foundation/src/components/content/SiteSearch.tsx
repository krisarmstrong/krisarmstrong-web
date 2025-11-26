import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: string;
}

interface SiteSearchProps {
  /** Searchable content array */
  searchableContent: SearchResult[];
  /** Placeholder text */
  placeholder?: string;
  /** Color variant for type badges */
  variant?: 'violet' | 'blue' | 'sage' | 'default';
  /** Custom type colors - maps type names to Tailwind classes */
  typeColors?: Record<string, string>;
  /** Max results to show */
  maxResults?: number;
}

const defaultTypeColors: Record<string, Record<string, string>> = {
  violet: {
    default: 'bg-violet-500/20 text-violet-400',
  },
  blue: {
    default: 'bg-blue-500/20 text-blue-400',
  },
  sage: {
    default: 'bg-brand-accent/20 text-brand-accent',
  },
  default: {
    default: 'bg-text-muted/20 text-text-muted',
  },
};

export function SiteSearch({
  searchableContent,
  placeholder = 'Search...',
  variant = 'violet',
  typeColors,
  maxResults = 8,
}: SiteSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = searchableContent.filter((item) => {
      const searchText = `${item.title} ${item.excerpt}`.toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    });

    setResults(filtered.slice(0, maxResults));
    setSelectedIndex(filtered.length > 0 ? 0 : -1); // Auto-select first result
  }, [query, searchableContent, maxResults]);

  const handleResultClick = useCallback(
    (path: string) => {
      void navigate(path);
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(-1);
    },
    [navigate]
  );

  // Handle keyboard navigation in search input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex].path);
        } else if (results.length > 0) {
          // If no selection, navigate to first result
          handleResultClick(results[0].path);
        }
      }
    },
    [results, selectedIndex, handleResultClick]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const getTypeColor = (type: string) => {
    if (typeColors && typeColors[type]) {
      return typeColors[type];
    }
    return defaultTypeColors[variant]?.default || defaultTypeColors.default.default;
  };

  return (
    <>
      {/* Search Button - Always visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-interactive-default/10 hover:bg-interactive-default/20 transition-colors text-interactive-default hover:text-interactive-hover border border-interactive-default/30"
        title="Search (Ctrl+K)"
      >
        <SearchIcon size={18} />
        <span className="hidden sm:inline text-sm font-medium">Search</span>
        <kbd className="hidden sm:inline px-2 py-0.5 text-xs bg-surface-base/50 rounded border border-interactive-default/30">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal - Only when open */}
      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
              role="presentation"
              aria-hidden="true"
            />

            {/* Search Modal */}
            <div className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50">
              <div className="rounded-xl shadow-2xl border-2 border-surface-border overflow-hidden bg-surface-base text-text-primary">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b-2 border-surface-border bg-surface-raised">
                  <SearchIcon size={20} className="text-brand-primary flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted font-medium"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                    aria-activedescendant={
                      selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined
                    }
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded transition-colors text-text-muted hover:text-brand-primary hover:bg-surface-hover flex-shrink-0"
                    aria-label="Close search"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Results */}
                {results.length > 0 ? (
                  <div
                    ref={resultsRef}
                    id="search-results"
                    role="listbox"
                    className="max-h-96 overflow-y-auto bg-surface-base"
                  >
                    {results.map((result, index) => (
                      <button
                        key={index}
                        id={`search-result-${index}`}
                        role="option"
                        aria-selected={index === selectedIndex}
                        onClick={() => handleResultClick(result.path)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left p-4 transition-colors border-b last:border-0 border-surface-border text-text-primary ${
                          index === selectedIndex
                            ? 'bg-surface-raised border-brand-primary/30'
                            : 'hover:bg-surface-raised hover:border-brand-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`px-2 py-0.5 text-xs rounded font-semibold flex-shrink-0 ${getTypeColor(result.type)}`}
                          >
                            {result.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold mb-1 text-text-primary">
                              {result.title}
                            </div>
                            <div className="text-sm line-clamp-2 text-text-muted">
                              {result.excerpt}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="p-8 text-center text-text-muted bg-surface-base">
                    <p className="font-medium">No results found for &quot;{query}&quot;</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-muted bg-surface-base">
                    <p className="font-medium">Start typing to search...</p>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
