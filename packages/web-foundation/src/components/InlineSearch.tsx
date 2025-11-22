import { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: string;
}

interface InlineSearchProps {
  /** Searchable content array */
  searchableContent: SearchResult[];
  /** Placeholder text */
  placeholder?: string;
  /** Max results to show in dropdown */
  maxResults?: number;
}

export function InlineSearch({
  searchableContent,
  placeholder = 'Search...',
  maxResults = 6,
}: InlineSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = searchableContent.filter((item) => {
      const searchText = `${item.title} ${item.excerpt} ${item.type}`.toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    });

    setResults(filtered.slice(0, maxResults));
    setIsOpen(filtered.length > 0);
  }, [query, searchableContent, maxResults]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleResultClick = (path: string) => {
    void navigate(path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-64 md:w-80">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-surface-base border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border-2 border-surface-border rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result.path)}
              className="w-full text-left p-3 hover:bg-surface-hover transition-colors border-b last:border-0 border-surface-border"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 text-xs rounded font-semibold bg-brand-primary/20 text-brand-accent flex-shrink-0 uppercase">
                  {result.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-sm mb-1">{result.title}</div>
                  <div className="text-xs line-clamp-2 text-text-muted">
                    {result.excerpt}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border-2 border-surface-border rounded-lg shadow-xl p-4 z-50">
          <p className="text-sm text-text-muted text-center">No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
