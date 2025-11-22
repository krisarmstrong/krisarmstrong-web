// src/pages/Search.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIconLucide, Loader2, AlertCircle, SearchX as NoResultsIcon, Clock, X } from "lucide-react";
import { H1, P, MutedText, CardTitle, Tag } from '../components/ui/Typography.jsx';
import { useCaseSearch } from '../hooks/useCaseSearch';
import { TransformedCase } from '../types';
import { getRecentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches, RecentSearch } from '../utils/recentSearches';

// Highlight function
function highlight(text: string | undefined, queryToHighlight: string): React.ReactNode {
  if (!queryToHighlight || !text) return text;
  const q = String(queryToHighlight).trim().toLowerCase();
  const textStr = String(text);
  if (!q) return textStr;

  // eslint-disable-next-line security/detect-non-literal-regexp
  const parts = textStr.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q ? (
      <mark key={i} className="bg-brand-accent/70 text-surface-raised px-0.5 rounded-sm">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function Search(): React.ReactElement {
  const {
    query,
    setQuery,
    searchResults,
    isLoading,
    error,
  } = useCaseSearch();

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const searchAttempted = query.trim() !== "";

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Save search query when user searches
  useEffect(() => {
    if (searchAttempted && !isLoading && searchResults.length > 0) {
      addRecentSearch(query);
      setRecentSearches(getRecentSearches());
    }
  }, [query, searchAttempted, isLoading, searchResults.length]);

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleRemoveRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <H1 icon={<SearchIconLucide size={32} className="text-text-brand-primary" />} className="!mb-3">
            Search Cases
          </H1>
        </header>

        <div className="mb-6 sm:mb-8 max-w-2xl">
          <label htmlFor="search-input" className="sr-only">Search cases input</label>
          <input
            id="search-input"
            type="search"
            value={query}
            placeholder="Type keywords (e.g., rogue, EtherScope, cybersecurity)..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="w-full bg-surface-raised border border-surface-border text-text-primary px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder-text-muted text-base"
            aria-label="Search cases input"
            autoFocus
          />
        </div>

        {/* Recent Searches - Show when not searching */}
        {!searchAttempted && !isLoading && recentSearches.length > 0 && (
          <div className="mb-8 max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-text-muted">
                <Clock size={18} />
                <h2 className="text-sm font-semibold uppercase tracking-wider">Recent Searches</h2>
              </div>
              <button
                onClick={handleClearRecentSearches}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
                aria-label="Clear all recent searches"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <div
                  key={search.timestamp}
                  className="flex items-center gap-1 rounded-md border border-surface-border bg-surface-raised text-sm text-text-primary transition-all hover:border-brand-accent"
                >
                  <button
                    type="button"
                    onClick={() => handleRecentSearchClick(search.query)}
                    className="flex items-center gap-2 px-3 py-2 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-l-md"
                    aria-label={`Search for ${search.query}`}
                  >
                    <SearchIconLucide size={14} className="text-text-muted" />
                    <span>{search.query}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecentSearch(search.query, e)}
                    className="p-2 text-text-muted hover:text-status-error focus:outline-none focus-visible:ring-2 focus-visible:ring-status-error rounded-r-md"
                    aria-label={`Remove ${search.query} from recent searches`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10">
            <Loader2 size={48} className="animate-spin text-text-brand-primary mb-4" />
            <P className="text-lg">Searching cases...</P>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center p-10 bg-surface-raised border border-status-error/50 rounded-lg">
            <AlertCircle size={48} className="text-status-error mb-4" />
            <P className="text-lg text-text-primary">{error}</P>
          </div>
        )}

        {!isLoading && !error && searchAttempted && (
          <MutedText className="mb-6 text-text-primary">
            Found <strong>{searchResults.length}</strong> case
            {searchResults.length !== 1 ? 's' : ''} for{" "}
            <span className="text-text-brand-primary font-medium">"{query}"</span>
          </MutedText>
        )}

        {!isLoading && !error && searchAttempted && searchResults.length > 0 && (
          <section aria-live="polite" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((c: TransformedCase) => (
              <Link
                key={c.publicId ?? c.id}
                to={`/cases/${c.publicId ?? c.id}`}
                className="group block bg-surface-raised border border-surface-border rounded-lg shadow-lg hover:shadow-xl focus:outline-none transition-all duration-200 ease-in-out hover:border-brand-accent hover:scale-[1.02]"
                aria-label={`View details for case: ${c.title}`}
              >
                <div className="p-5">
                  <CardTitle className="group-hover:text-text-brand-primary transition-colors truncate">
                    {highlight(c.title, query)}
                  </CardTitle>
                  <MutedText className="mb-2 text-xs text-text-muted">
                    {c.sector} {c.tool && `• ${c.tool}`}
                  </MutedText>
                    <P size="sm" className="line-clamp-3">
                      {highlight(c.summary || c.incidentOverview, query)}
                    </P>
                  {(c.tags && c.tags.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags.slice(0, 3).map((tag: string) => (
                        <Tag key={tag} colorScheme="blue">#{highlight(tag, query)}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}

        {!isLoading && !error && searchAttempted && searchResults.length === 0 && (
           <div className="col-span-full text-center py-12">
            <NoResultsIcon size={48} className="mx-auto text-text-muted mb-4" />
            <P className="text-xl text-text-primary">No results found for "{query}".</P>
            <MutedText className="mt-1 text-text-primary">Try a different search term.</MutedText>
          </div>
        )}
      </div>
    </div>
  );
}
