import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    // eslint-disable-next-line security/detect-object-injection
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      // eslint-disable-next-line security/detect-object-injection
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      // eslint-disable-next-line security/detect-object-injection
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorageMock.clear();
});

// Mock Supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signUp: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithPassword: vi.fn(() =>
        Promise.resolve({ data: { user: null, session: null }, error: null })
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      resetPasswordForEmail: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      updateUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  },
}));
