import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Smoke Test Configuration
 * Tests all 3 apps in the monorepo across multiple browsers
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
    // Chrome tests for all apps
    {
      name: 'krisarmstrong-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3002',
      },
      testMatch: '**/krisarmstrong.smoke.spec.ts',
    },
    {
      name: 'intrinsic-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
      testMatch: '**/intrinsic.smoke.spec.ts',
    },
    {
      name: 'wifivigilante-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
      testMatch: '**/wifivigilante.smoke.spec.ts',
    },
    // Firefox tests for all apps
    {
      name: 'krisarmstrong-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3002',
      },
      testMatch: '**/krisarmstrong.smoke.spec.ts',
    },
    {
      name: 'intrinsic-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3001',
      },
      testMatch: '**/intrinsic.smoke.spec.ts',
    },
    {
      name: 'wifivigilante-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3000',
      },
      testMatch: '**/wifivigilante.smoke.spec.ts',
    },
    // Safari (WebKit) tests for all apps
    {
      name: 'krisarmstrong-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3002',
      },
      testMatch: '**/krisarmstrong.smoke.spec.ts',
    },
    {
      name: 'intrinsic-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3001',
      },
      testMatch: '**/intrinsic.smoke.spec.ts',
    },
    {
      name: 'wifivigilante-webkit',
      use: {
        ...devices['Desktop Safari'],
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
