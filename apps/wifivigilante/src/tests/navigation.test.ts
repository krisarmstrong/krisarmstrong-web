import { describe, it, expect } from 'vitest';
import { PRIMARY_NAV } from '../config/navigation';

describe('PRIMARY_NAV', () => {
  it('contains the expected routes in order', () => {
    expect(PRIMARY_NAV.map((item) => item.path)).toEqual([
      '/',
      '/about',
      '/cases',
      '/case-of-the-day',
      '/contact',
    ]);
  });

  it('provides labels and icons for every entry', () => {
    PRIMARY_NAV.forEach((item) => {
      expect(item.label).toBeTypeOf('string');
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon).toBeTruthy();
    });
  });
});
