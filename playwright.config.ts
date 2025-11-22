import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * Tests all 3 apps in the monorepo
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      name: 'wifivigilante',
      command: 'npm run dev --workspace=wifivigilante-com',
      url: 'http://localhost:3003',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      name: 'intrinsic',
      command: 'npm run dev --workspace=intrinsicmomentummindset-com',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      name: 'krisarmstrong',
      command: 'npm run dev --workspace=krisarmstrong-org',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
