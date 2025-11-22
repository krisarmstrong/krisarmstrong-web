import { describe, it, expect, beforeEach } from 'vitest';
import RateLimiter, { withRateLimit } from '../utils/rateLimit';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(3, 1000); // 3 requests per second for testing
  });

  describe('checkLimit', () => {
    it('should allow requests within the limit', () => {
      const result1 = limiter.checkLimit('test-endpoint');
      expect(result1.allowed).toBe(true);
      expect(result1.retryAfter).toBeNull();

      const result2 = limiter.checkLimit('test-endpoint');
      expect(result2.allowed).toBe(true);

      const result3 = limiter.checkLimit('test-endpoint');
      expect(result3.allowed).toBe(true);
    });

    it('should block requests exceeding the limit', () => {
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');

      const result = limiter.checkLimit('test-endpoint');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should track different endpoints separately', () => {
      limiter.checkLimit('endpoint-1');
      limiter.checkLimit('endpoint-1');
      limiter.checkLimit('endpoint-1');

      const result1 = limiter.checkLimit('endpoint-1');
      expect(result1.allowed).toBe(false);

      const result2 = limiter.checkLimit('endpoint-2');
      expect(result2.allowed).toBe(true);
    });

    it('should reset after time window passes', async () => {
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');

      const blocked = limiter.checkLimit('test-endpoint');
      expect(blocked.allowed).toBe(false);

      // Wait for time window to pass
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const allowed = limiter.checkLimit('test-endpoint');
      expect(allowed.allowed).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset rate limit for specific endpoint', () => {
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');

      const blocked = limiter.checkLimit('test-endpoint');
      expect(blocked.allowed).toBe(false);

      limiter.reset('test-endpoint');

      const allowed = limiter.checkLimit('test-endpoint');
      expect(allowed.allowed).toBe(true);
    });
  });

  describe('resetAll', () => {
    it('should reset all rate limits', () => {
      limiter.checkLimit('endpoint-1');
      limiter.checkLimit('endpoint-1');
      limiter.checkLimit('endpoint-1');
      limiter.checkLimit('endpoint-2');
      limiter.checkLimit('endpoint-2');
      limiter.checkLimit('endpoint-2');

      limiter.resetAll();

      expect(limiter.checkLimit('endpoint-1').allowed).toBe(true);
      expect(limiter.checkLimit('endpoint-2').allowed).toBe(true);
    });
  });

  describe('getUsage', () => {
    it('should return correct usage statistics', () => {
      limiter.checkLimit('test-endpoint');
      limiter.checkLimit('test-endpoint');

      const usage = limiter.getUsage('test-endpoint');
      expect(usage.used).toBe(2);
      expect(usage.remaining).toBe(1);
      expect(usage.total).toBe(3);
    });

    it('should return zero usage for unused endpoints', () => {
      const usage = limiter.getUsage('unused-endpoint');
      expect(usage.used).toBe(0);
      expect(usage.remaining).toBe(3);
      expect(usage.total).toBe(3);
    });
  });
});

describe('withRateLimit', () => {
  it('should allow function execution within rate limit', async () => {
    const limiter = new RateLimiter(5, 1000);
    const mockFn = async (value: number): Promise<number> => value * 2;
    const rateLimitedFn = withRateLimit(mockFn, limiter, 'test');

    const result = await rateLimitedFn(5);
    expect(result).toBe(10);
  });

  it('should throw error when rate limit exceeded', async () => {
    const limiter = new RateLimiter(2, 1000);
    const mockFn = async (): Promise<string> => 'success';
    const rateLimitedFn = withRateLimit(mockFn, limiter, 'test');

    await rateLimitedFn();
    await rateLimitedFn();

    await expect(rateLimitedFn()).rejects.toThrow('Rate limit exceeded');
  });

  it('should include retryAfter in error', async () => {
    const limiter = new RateLimiter(1, 1000);
    const mockFn = async (): Promise<string> => 'success';
    const rateLimitedFn = withRateLimit(mockFn, limiter, 'test');

    await rateLimitedFn();

    try {
      await rateLimitedFn();
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect((error as Error & { name: string }).name).toBe('RateLimitError');
      expect((error as Error & { retryAfter: number }).retryAfter).toBeGreaterThan(0);
    }
  });
});
