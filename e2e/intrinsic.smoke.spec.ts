import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke tests for intrinsicmomentummindset.com
 * Verifies all pages load without console errors
 */

// Routes to test
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
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

test.describe('intrinsicmomentummindset.com Smoke Tests', () => {
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

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find and click Services link
    const servicesLink = page.getByRole('link', { name: /services/i }).first();
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await page.waitForURL('**/services');
      expect(page.url()).toContain('/services');
    }
  });

  test('Contact form renders', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    // Verify form elements exist
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"], input[type="text"]').first()).toBeVisible();
  });

  test('Services page has content', async ({ page }) => {
    await page.goto('/services', { waitUntil: 'networkidle' });

    // Verify services content is visible
    const mainContent = page.locator('main, [role="main"], .services, article').first();
    await expect(mainContent).toBeVisible();
  });

  test('About page has content', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' });

    // Verify about content is visible
    const mainContent = page.locator('main, [role="main"], .about, article').first();
    await expect(mainContent).toBeVisible();
  });
});
