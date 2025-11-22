/**
 * @fileoverview Shared test utilities for all workspaces
 * Provides common mocks, helpers, and setup functions for testing
 */

import { cleanup, render, RenderOptions } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type { ReactElement } from 'react';

/**
 * Creates a localStorage mock with optional initial state
 * @param initialState - Initial key-value pairs for localStorage
 * @returns Mock localStorage implementation
 */
export function createLocalStorageMock(initialState: Record<string, string> = {}) {
  let store: Record<string, string> = { ...initialState };

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  } as Storage;
}

/**
 * Sets up window.matchMedia mock for media query testing
 */
export function setupMatchMediaMock() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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
}

/**
 * Sets up IntersectionObserver mock for intersection testing
 */
export function setupIntersectionObserverMock() {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
}

/**
 * Sets up common window mocks (scrollTo, scrollBy, etc.)
 */
export function setupWindowMocks() {
  window.scrollTo = vi.fn();
  window.scrollBy = vi.fn();
  window.scroll = vi.fn();
}

/**
 * Sets up all common browser API mocks
 * Includes: matchMedia, IntersectionObserver, window scroll methods
 */
export function setupBrowserMocks() {
  setupMatchMediaMock();
  setupIntersectionObserverMock();
  setupWindowMocks();
}

/**
 * Default cleanup that runs after each test
 * Clears all mocks and cleans up React components
 */
export function setupTestCleanup() {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
}

/**
 * Custom render function that includes common providers
 * Extend this in your app-specific test-utils if you need app-specific providers
 */
export function renderWithDefaults(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

/**
 * Helper to create a mock environment variable setter
 */
export function mockEnv(key: string, value: string) {
  vi.stubEnv(key, value);
}

/**
 * Helper to create multiple mock environment variables
 */
export function mockEnvVars(vars: Record<string, string>) {
  Object.entries(vars).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
}

// Re-export commonly used testing-library utilities
export { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
export type { RenderOptions, RenderResult } from '@testing-library/react';
