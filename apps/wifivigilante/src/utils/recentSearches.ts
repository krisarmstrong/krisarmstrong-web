// src/utils/recentSearches.ts

const RECENT_SEARCHES_KEY = 'wifi-vigilante-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];

    const searches = JSON.parse(stored) as RecentSearch[];
    return searches.filter(s => s.query && s.timestamp);
  } catch (error) {
    console.warn('Failed to load recent searches:', error);
    return [];
  }
}

/**
 * Add a search to recent searches
 */
export function addRecentSearch(query: string): void {
  if (!query || query.trim().length === 0) return;

  try {
    const searches = getRecentSearches();

    // Remove duplicate if exists
    const filtered = searches.filter(s => s.query.toLowerCase() !== query.toLowerCase());

    // Add new search at the beginning
    const updated: RecentSearch[] = [
      { query: query.trim(), timestamp: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.warn('Failed to clear recent searches:', error);
  }
}

/**
 * Remove a specific search from recent searches
 */
export function removeRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(s => s.query !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to remove recent search:', error);
  }
}
