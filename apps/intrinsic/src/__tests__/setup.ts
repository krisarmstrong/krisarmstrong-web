import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(() => undefined),
  removeItem: vi.fn(() => undefined),
  clear: vi.fn(() => undefined),
  key: vi.fn(() => null),
  length: 0,
};
global.localStorage = localStorageMock as Storage;

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
vi.stubEnv('VITE_APP_ENV', 'test');
vi.stubEnv('VITE_FORM_ENDPOINT', 'https://formspree.io/f/test');
vi.stubEnv('VITE_PAYPAL_INTRINSIC_FOUNDATIONS', 'https://paypal.com/test1');
vi.stubEnv('VITE_PAYPAL_INTRINSIC_MOMENTUM', 'https://paypal.com/test2');
vi.stubEnv('VITE_PAYPAL_MINDSET_IMMERSION', 'https://paypal.com/test3');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock scrollTo
window.scrollTo = vi.fn();
