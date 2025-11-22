import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Configuration options for creating a Vitest config
 */
export interface TestConfig {
  /** Path to test setup file(s) (relative to app root) */
  setupFiles?: string | string[];
  /** Additional coverage exclude patterns */
  coverageExclude?: string[];
  /** Alias for @ import (defaults to ./src) */
  aliasPath?: string;
  /** Coverage thresholds (defaults to 80% for all metrics) */
  coverageThresholds?: {
    lines?: number;
    functions?: number;
    branches?: number;
    statements?: number;
  };
}

/**
 * Creates a standardized Vitest configuration for apps in the monorepo
 * @param testConfig - Test-specific configuration options
 * @returns Vitest configuration object
 */
export function createVitestConfig(testConfig: TestConfig = {}) {
  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: testConfig.setupFiles || [],
      css: true,
      pool: 'threads',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/**',
          'dist/**',
          'scripts/**',
          '**/*.config.{js,ts}',
          '**/*.d.ts',
          '**/tests/**',
          '**/__tests__/**',
          '**/vitest.setup.ts',
          ...(testConfig.coverageExclude || []),
        ],
        thresholds: testConfig.coverageThresholds || {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), testConfig.aliasPath || './src'),
      },
    },
  });
}
