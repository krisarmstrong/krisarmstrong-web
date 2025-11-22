import { defineConfig, UserConfig } from 'vitest/config';
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
}

/**
 * Creates a standardized Vitest configuration for apps in the monorepo
 * @param testConfig - Test-specific configuration options
 * @returns Vitest configuration object
 */
export function createVitestConfig(testConfig: TestConfig = {}): UserConfig {
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
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), testConfig.aliasPath || './src'),
      },
    },
  });
}
