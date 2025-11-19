import { describe, it, expect } from 'vitest';
import { isDevelopmentEnvironment, getSentry } from './env';

describe('env utilities', () => {
  describe('isDevelopmentEnvironment', () => {
    it('should be a boolean', () => {
      expect(typeof isDevelopmentEnvironment).toBe('boolean');
    });
  });

  describe('getSentry', () => {
    it('should return null when Sentry is not available', () => {
      const result = getSentry();
      expect(result).toBeNull();
    });

    it('should be a function', () => {
      expect(typeof getSentry).toBe('function');
    });
  });
});
