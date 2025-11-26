import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke tests for wifi-vigilante.com
 * Verifies all pages load without console errors
 */

// Routes to test
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/cases', name: 'Cases' },
  { path: '/case-of-the-day', name: 'Case of the Day' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/terms-of-service', name: 'Terms of Service' },
];

// Helper to collect console errors
async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign errors
      if (
        !text.includes('Failed to load resource') &&
        !text.includes('favicon') &&
        !text.includes('ResizeObserver') &&
        !text.includes('Sentry') &&
        !text.includes('VITE_SENTRY')
      ) {
        errors.push(text);
      }
    }
  });
  return errors;
}

test.describe('wifi-vigilante.com Smoke Tests', () => {
  for (const route of routes) {
    test(`${route.name} page (${route.path}) loads without errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);

      // Navigate to the page
      const response = await page.goto(route.path, { waitUntil: 'networkidle' });

      // Verify response status
      expect(response?.status()).toBeLessThan(400);

      // Verify page content loaded
      await expect(page.locator('body')).toBeVisible();

      // Verify no JavaScript errors
      expect(errors).toEqual([]);
    });
  }

  test('Case detail page loads (from cases list)', async ({ page }) => {
    const errors = await collectConsoleErrors(page);

    // Navigate to cases list
    await page.goto('/cases', { waitUntil: 'networkidle' });

    // Click first case if available
    const firstCase = page.locator('a[href^="/cases/"]').first();
    if (await firstCase.isVisible()) {
      await firstCase.click();
      await page.waitForLoadState('networkidle');

      // Verify we navigated to a case detail
      expect(page.url()).toMatch(/\/cases\/.+/);

      // Verify no errors
      expect(errors).toEqual([]);
    }
  });

  test('Case of the Day displays content', async ({ page }) => {
    await page.goto('/case-of-the-day', { waitUntil: 'networkidle' });

    // Verify case content is visible (either a case or loading state)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for main content area
    const mainContent = page.locator('main, [role="main"], .case-content, article').first();
    await expect(mainContent).toBeVisible();
  });

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find and click Cases link
    const casesLink = page.getByRole('link', { name: /cases/i }).first();
    if (await casesLink.isVisible()) {
      await casesLink.click();
      await page.waitForURL('**/cases');
      expect(page.url()).toContain('/cases');
    }
  });

  test('Contact form renders', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    // Verify form elements exist
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"], input[type="text"]').first()).toBeVisible();
  });
});
