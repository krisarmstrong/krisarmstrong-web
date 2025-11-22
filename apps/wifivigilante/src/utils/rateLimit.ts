/**
 * Client-side rate limiting utility to prevent API abuse
 */

interface RateLimitResult {
  allowed: boolean;
  retryAfter: number | null;
}

interface UsageStats {
  used: number;
  remaining: number;
  total: number;
}

class RateLimiter {
  private maxRequests: number;
  private timeWindowMs: number;
  private requests: Map<string, number[]>; // Map of endpoint -> array of timestamps

  constructor(maxRequests: number = 100, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.requests = new Map();
  }

  /**
   * Check if a request is allowed based on rate limits
   * @param endpoint - The API endpoint being called
   * @returns Object with allowed status and optional retryAfter time
   */
  checkLimit(endpoint: string): RateLimitResult {
    const now = Date.now();
    const requestTimestamps = this.requests.get(endpoint) || [];

    // Remove timestamps outside the current time window
    const validTimestamps = requestTimestamps.filter(
      timestamp => now - timestamp < this.timeWindowMs
    );

    if (validTimestamps.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validTimestamps);
      const retryAfter = Math.ceil((oldestRequest + this.timeWindowMs - now) / 1000);

      return {
        allowed: false,
        retryAfter
      };
    }

    // Add current timestamp and update the map
    validTimestamps.push(now);
    this.requests.set(endpoint, validTimestamps);

    return {
      allowed: true,
      retryAfter: null
    };
  }

  /**
   * Reset rate limit for a specific endpoint
   * @param endpoint - The endpoint to reset
   */
  reset(endpoint: string): void {
    this.requests.delete(endpoint);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.requests.clear();
  }

  /**
   * Get current usage for an endpoint
   * @param endpoint - The endpoint to check
   * @returns Usage statistics
   */
  getUsage(endpoint: string): UsageStats {
    const now = Date.now();
    const requestTimestamps = this.requests.get(endpoint) || [];

    const validTimestamps = requestTimestamps.filter(
      timestamp => now - timestamp < this.timeWindowMs
    );

    return {
      used: validTimestamps.length,
      remaining: this.maxRequests - validTimestamps.length,
      total: this.maxRequests
    };
  }
}

// Create singleton instances for different rate limits
export const searchRateLimiter = new RateLimiter(30, 60000); // 30 searches per minute
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 API calls per minute

/**
 * Custom error class for rate limit exceeded errors
 */
export class RateLimitError extends Error {
  retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Wrapper function to add rate limiting to async functions
 * @param fn - The async function to rate limit
 * @param limiter - The rate limiter instance to use
 * @param endpoint - The endpoint identifier
 * @returns Rate-limited version of the function
 */
export const withRateLimit = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  limiter: RateLimiter,
  endpoint: string
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    const { allowed, retryAfter } = limiter.checkLimit(endpoint);

    if (!allowed && retryAfter !== null) {
      throw new RateLimitError(retryAfter);
    }

    return fn(...args);
  };
};

export default RateLimiter;
