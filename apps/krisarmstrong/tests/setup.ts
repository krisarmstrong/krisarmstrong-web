import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../src/lib/supabase', () => ({
  getAllBlogPosts: vi.fn().mockResolvedValue([]),
  getFeaturedBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(null),
  getAllTags: vi.fn().mockResolvedValue([]),
  incrementViewCount: vi.fn().mockResolvedValue(undefined),
}));

// Mock localStorage
const localStorageMock = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
  clear: () => {},
  length: 0,
  key: (_index: number) => null,
};

global.localStorage = localStorageMock as Storage;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
