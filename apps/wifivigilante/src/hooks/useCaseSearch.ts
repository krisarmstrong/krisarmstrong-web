// src/hooks/useCaseSearch.ts
import { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { searchCases } from '../api'; // Your API function
import { transformApiData } from '../utils/caseUtils'; // The utility we just defined
import type { TransformedCase } from '@/types';

interface UseCaseSearchReturn {
  query: string;
  setQuery: (newQuery: string) => void;
  searchResults: TransformedCase[];
  isLoading: boolean;
  error: string | null;
}

export function useCaseSearch(): UseCaseSearchReturn {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TransformedCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // React 19: Defer query processing to keep input responsive during API calls
  const deferredQuery = useDeferredValue(query);

  // Derive whether we should show empty state
  const hasEmptyQuery = useMemo(() => deferredQuery.trim() === '', [deferredQuery]);

  useEffect(() => {
    if (hasEmptyQuery) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading/error states for async search
    setIsLoading(true);
    setError(null);

    // Cancellation flag to prevent race conditions
    let cancelled = false;

    const handler = setTimeout(() => {
      searchCases(deferredQuery.trim())
        .then((data) => {
          // Ignore stale results if component unmounted or new search started
          if (cancelled) return;

          if (!Array.isArray(data)) {
            console.error('searchCases did not return an array:', data);
            throw new Error('Data format error from API.');
          }
          const transformed = data
            .map(transformApiData)
            .filter((item): item is TransformedCase => item !== null);
          setSearchResults(transformed);
        })
        .catch((err) => {
          // Ignore errors from cancelled requests
          if (cancelled) return;

          console.error('Search API call failed:', err);
          setError('Search operation failed. Please try again.');
          setSearchResults([]); // Clear results on error
        })
        .finally(() => {
          // Only update loading state if not cancelled
          if (!cancelled) {
            setIsLoading(false);
          }
        });
    }, 500); // 500ms debounce

    // Cleanup function: cancel in-flight requests
    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [deferredQuery, hasEmptyQuery]); // Effect depends on deferred query

  // useCallback for setQuery to stabilize its identity if passed down
  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  // Derive final values based on query state
  const derivedSearchResults = useMemo(
    () => (hasEmptyQuery ? [] : searchResults),
    [hasEmptyQuery, searchResults]
  );
  const derivedIsLoading = useMemo(
    () => (hasEmptyQuery ? false : isLoading),
    [hasEmptyQuery, isLoading]
  );
  const derivedError = useMemo(() => (hasEmptyQuery ? null : error), [hasEmptyQuery, error]);

  return {
    query,
    setQuery: handleSetQuery, // Expose a stable setQuery
    searchResults: derivedSearchResults,
    isLoading: derivedIsLoading,
    error: derivedError,
  };
}
