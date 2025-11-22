/**
 * Client-side caching utility for API responses
 * Implements stale-while-revalidate strategy
 */

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

interface CachedData<T = unknown> {
  data: T;
  isStale: boolean;
  age: number;
}

interface CacheStats {
  total: number;
  fresh: number;
  stale: number;
  expired: number;
}

class CacheManager<T = unknown> {
  private cache: Map<string, CacheEntry<T>>;
  private ttl: number;

  constructor(ttl: number = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Generate cache key from endpoint and params
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Cache key
   */
  generateKey(endpoint: string, params: Record<string, unknown> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      // eslint-disable-next-line security/detect-object-injection
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  /**
   * Get cached data if valid
   * @param key - Cache key
   * @returns Cached data or null
   */
  get(key: string): CachedData<T> | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    const now = Date.now();
    const age = now - cached.timestamp;

    // Return cached data if still fresh
    if (age < this.ttl) {
      return {
        data: cached.data,
        isStale: false,
        age,
      };
    }

    // Return stale data but mark it as needing revalidation
    if (age < this.ttl * 2) {
      return {
        data: cached.data,
        isStale: true,
        age,
      };
    }

    // Data too old, remove it
    this.cache.delete(key);
    return null;
  }

  /**
   * Store data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove item from cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns Cache stats
   */
  getStats(): CacheStats {
    const now = Date.now();
    let fresh = 0;
    let stale = 0;
    let expired = 0;

    this.cache.forEach(({ timestamp }) => {
      const age = now - timestamp;
      if (age < this.ttl) fresh++;
      else if (age < this.ttl * 2) stale++;
      else expired++;
    });

    return {
      total: this.cache.size,
      fresh,
      stale,
      expired,
    };
  }

  /**
   * Remove expired entries
   */
  cleanup(): number {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach(({ timestamp }, key) => {
      if (now - timestamp > this.ttl * 2) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    return keysToDelete.length;
  }
}

// Create singleton instances
export const caseCache = new CacheManager(300000); // 5 minutes
export const sectorCache = new CacheManager(600000); // 10 minutes (sectors change less)

/**
 * Wrapper function to add caching to async functions
 * @param fn - Async function to wrap
 * @param cache - Cache manager instance
 * @param keyGenerator - Function to generate cache key
 * @returns Cached version of the function
 */
export const withCache = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  cache: CacheManager<T>,
  keyGenerator: (...args: Args) => string
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);

    if (cached && !cached.isStale) {
      // Return fresh cached data
      return cached.data;
    }

    // Fetch new data
    const promise = fn(...args);

    if (cached && cached.isStale) {
      // Return stale data immediately, revalidate in background
      promise.then(data => cache.set(key, data)).catch((err) => {
        console.warn('Cache revalidation failed:', err);
        // Consider notifying error tracking service in production
      });
      return cached.data;
    }

    // No cached data, wait for fetch
    const data = await promise;
    cache.set(key, data);
    return data;
  };
};

export default CacheManager;
