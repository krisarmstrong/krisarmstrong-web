import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Smoke Test Configuration
 * Tests all 3 apps in the monorepo
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30000,

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'krisarmstrong',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3002',
      },
      testMatch: '**/krisarmstrong.smoke.spec.ts',
    },
    {
      name: 'intrinsic',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
      testMatch: '**/intrinsic.smoke.spec.ts',
    },
    {
      name: 'wifivigilante',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
      testMatch: '**/wifivigilante.smoke.spec.ts',
    },
  ],

  webServer: [
    {
      command: 'npm run dev --workspace=krisarmstrong-org',
      url: 'http://localhost:3002',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'npm run dev --workspace=intrinsicmomentummindset-com',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'npm run dev --workspace=wifivigilante-com',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
