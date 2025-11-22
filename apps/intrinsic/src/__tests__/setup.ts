import '@testing-library/jest-dom/vitest';
import {
  createLocalStorageMock,
  setupBrowserMocks,
  setupTestCleanup,
  mockEnvVars,
} from '@krisarmstrong/web-foundation/src/test-utils';

// Setup browser API mocks (matchMedia, IntersectionObserver, scrollTo, etc.)
setupBrowserMocks();

// Setup localStorage mock
globalThis.localStorage = createLocalStorageMock();

// Setup automatic cleanup after each test
setupTestCleanup();

// Mock environment variables
mockEnvVars({
  VITE_APP_ENV: 'test',
  VITE_FORM_ENDPOINT: 'https://formspree.io/f/test',
  VITE_PAYPAL_INTRINSIC_FOUNDATIONS: 'https://paypal.com/test1',
  VITE_PAYPAL_INTRINSIC_MOMENTUM: 'https://paypal.com/test2',
  VITE_PAYPAL_MINDSET_IMMERSION: 'https://paypal.com/test3',
});
