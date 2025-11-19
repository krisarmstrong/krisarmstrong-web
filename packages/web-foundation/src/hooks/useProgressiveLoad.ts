import { useState, useMemo, useCallback, useEffect } from 'react';

export interface UseProgressiveLoadOptions {
  /** Number of items to load per "Load More" action */
  itemsPerLoad?: number;
  /** Initial number of items to show */
  initialCount?: number;
}

export interface UseProgressiveLoadReturn<T> {
  /** Items currently visible (sliced from input array) */
  visibleItems: T[];
  /** Number of items remaining to load */
  remainingCount: number;
  /** Function to load more items */
  loadMore: () => void;
  /** Function to reset to initial count */
  reset: () => void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Current display count */
  displayCount: number;
}

/**
 * useProgressiveLoad - Hook for progressive/lazy loading of items
 *
 * Manages state for progressively loading items in chunks (e.g., "Load More" pattern).
 * Automatically resets when the input items array changes.
 *
 * @example
 * ```tsx
 * const { visibleItems, remainingCount, loadMore, hasMore } = useProgressiveLoad(
 *   filteredPosts,
 *   { itemsPerLoad: 12, initialCount: 12 }
 * );
 *
 * return (
 *   <>
 *     <PostGrid posts={visibleItems} />
 *     {hasMore && (
 *       <LoadMoreButton
 *         remainingCount={remainingCount}
 *         itemsPerLoad={12}
 *         onLoadMore={loadMore}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export function useProgressiveLoad<T>(
  items: T[],
  options: UseProgressiveLoadOptions = {}
): UseProgressiveLoadReturn<T> {
  const {
    itemsPerLoad = 12,
    initialCount = itemsPerLoad,
  } = options;

  const [displayCount, setDisplayCount] = useState(initialCount);

  // Reset display count when items array changes (e.g., new search/filter)
  useEffect(() => {
    setDisplayCount(initialCount);
  }, [items, initialCount]);

  // Slice items to show only visible ones
  const visibleItems = useMemo(() => {
    return items.slice(0, displayCount);
  }, [items, displayCount]);

  // Calculate remaining count
  const remainingCount = useMemo(() => {
    return Math.max(0, items.length - displayCount);
  }, [items.length, displayCount]);

  // Check if there are more items to load
  const hasMore = remainingCount > 0;

  // Load more function
  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + itemsPerLoad);
  }, [itemsPerLoad]);

  // Reset function
  const reset = useCallback(() => {
    setDisplayCount(initialCount);
  }, [initialCount]);

  return {
    visibleItems,
    remainingCount,
    loadMore,
    reset,
    hasMore,
    displayCount,
  };
}

export default useProgressiveLoad;
