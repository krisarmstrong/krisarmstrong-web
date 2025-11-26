import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke tests for krisarmstrong.com
 * Verifies all pages load without console errors
 */

// Routes to test
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/resume', name: 'Resume' },
  { path: '/skills', name: 'Skills' },
  { path: '/projects', name: 'Projects' },
  { path: '/blog', name: 'Blog' },
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
        !text.includes('VITE_SENTRY') &&
        !text.includes('ErrorResponseImpl') // React Router dev-mode error
      ) {
        errors.push(text);
      }
    }
  });
  return errors;
}

test.describe('krisarmstrong.com Smoke Tests', () => {
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

  test('Blog post page loads (sample)', async ({ page }) => {
    const errors = await collectConsoleErrors(page);

    // Navigate to blog first
    await page.goto('/blog', { waitUntil: 'networkidle' });

    // Click first blog post if available
    const firstPost = page.locator('a[href^="/blog/"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // Verify we navigated to a blog post
      expect(page.url()).toMatch(/\/blog\/.+/);

      // Verify no errors
      expect(errors).toEqual([]);
    }
  });

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find and click About link
    const aboutLink = page.getByRole('link', { name: /about/i }).first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL('**/about');
      expect(page.url()).toContain('/about');
    }
  });

  test('Contact form renders', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    // Verify form elements exist
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"], input[type="text"]').first()).toBeVisible();
  });
});
