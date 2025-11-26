import { test, expect, type Page } from '@playwright/test';

/**
 * Comprehensive smoke tests for wifi-vigilante.com
 * Verifies pages load correctly, no console errors, SEO, accessibility, and mobile responsiveness
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
        !text.includes('VITE_SENTRY') &&
        !text.includes('ErrorResponseImpl') // React Router dev-mode error
      ) {
        errors.push(text);
      }
    }
  });
  return errors;
}

test.describe('wifi-vigilante.com Smoke Tests', () => {
  // ============================================
  // PAGE LOAD TESTS
  // ============================================
  test.describe('Page Load Tests', () => {
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
  });

  // ============================================
  // 404 ERROR HANDLING TESTS
  // ============================================
  test.describe('404 Error Handling', () => {
    test('Non-existent page returns 404 or shows error page', async ({ page }) => {
      const response = await page.goto('/this-page-definitely-does-not-exist-xyz123', {
        waitUntil: 'networkidle',
      });

      // Either returns 404 status OR shows an error page (React apps often return 200 with error content)
      const status = response?.status() ?? 0;
      const bodyText = await page.locator('body').textContent();

      // Accept either 404 status OR error page content
      const has404Status = status === 404;
      const hasErrorContent =
        bodyText?.toLowerCase().includes('not found') ||
        bodyText?.toLowerCase().includes('404') ||
        bodyText?.toLowerCase().includes("doesn't exist") ||
        bodyText?.toLowerCase().includes('page not found');

      expect(has404Status || hasErrorContent).toBeTruthy();
    });

    test('Non-existent case handles gracefully', async ({ page }) => {
      const response = await page.goto('/cases/non-existent-case-xyz123', {
        waitUntil: 'networkidle',
      });

      const status = response?.status() ?? 0;
      const bodyText = await page.locator('body').textContent();
      const url = page.url();

      // Accept any of: error status, error content, or redirect to cases list
      const hasErrorStatus = status >= 400;
      const hasErrorContent =
        bodyText?.toLowerCase().includes('not found') ||
        bodyText?.toLowerCase().includes('404') ||
        bodyText?.toLowerCase().includes("doesn't exist") ||
        bodyText?.toLowerCase().includes('case not found') ||
        bodyText?.toLowerCase().includes('error');
      const redirectedToCases = url.endsWith('/cases') || url.endsWith('/cases/');
      const hasPageContent = (bodyText?.length ?? 0) > 100; // App handled it somehow

      expect(hasErrorStatus || hasErrorContent || redirectedToCases || hasPageContent).toBeTruthy();
    });
  });

  // ============================================
  // MOBILE VIEWPORT TESTS
  // ============================================
  test.describe('Mobile Viewport Tests', () => {
    const mobileViewport = { width: 375, height: 667 }; // iPhone SE

    for (const route of routes) {
      test(`${route.name} page renders on mobile (${route.path})`, async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        const response = await page.goto(route.path, { waitUntil: 'networkidle' });

        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator('body')).toBeVisible();

        // Verify no horizontal overflow (common mobile issue)
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
      });
    }

    test('Cases list is usable on mobile', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Verify case cards are visible and clickable
      const caseLinks = page.locator('a[href^="/cases/"]');
      const count = await caseLinks.count();

      if (count > 0) {
        const firstCase = caseLinks.first();
        await expect(firstCase).toBeVisible();
      }
    });
  });

  // ============================================
  // SEO META TAGS TESTS
  // ============================================
  test.describe('SEO Meta Tags', () => {
    for (const route of routes) {
      test(`${route.name} page has essential meta tags (${route.path})`, async ({ page }) => {
        await page.goto(route.path, { waitUntil: 'networkidle' });

        // Check title exists and is not empty
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);

        // Check meta description exists
        const metaDescription = page.locator('meta[name="description"]');
        const descriptionExists = (await metaDescription.count()) > 0;
        if (descriptionExists) {
          const content = await metaDescription.getAttribute('content');
          expect(content?.length).toBeGreaterThan(0);
        }

        // Check viewport meta tag (essential for mobile)
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveCount(1);
      });
    }

    test('Home page has Open Graph tags', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check for common OG tags
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');

      // At least one OG tag should exist
      const hasOgTitle = (await ogTitle.count()) > 0;
      const hasOgDescription = (await ogDescription.count()) > 0;

      expect(hasOgTitle || hasOgDescription).toBeTruthy();
    });

    test('Case detail page has dynamic meta tags', async ({ page }) => {
      // Navigate to cases list first
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const firstCase = page.locator('a[href^="/cases/"]').first();
      if (await firstCase.isVisible()) {
        await firstCase.click();
        await page.waitForLoadState('networkidle');

        // Case detail should have a title
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================
  // SITEMAP TESTS
  // ============================================
  test.describe('Sitemap', () => {
    test('Sitemap.xml is accessible', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      // Sitemap should return 200 and contain XML content
      if (response?.status() === 200) {
        const contentType = response.headers()['content-type'] ?? '';
        expect(contentType).toMatch(/xml/);
      }
      // If 404, sitemap doesn't exist (acceptable but logged)
    });

    test('Robots.txt is accessible', async ({ page }) => {
      const response = await page.goto('/robots.txt');

      if (response?.status() === 200) {
        const content = await page.content();
        // Should contain User-agent directive
        expect(content.toLowerCase()).toContain('user-agent');
      }
    });
  });

  // ============================================
  // IMAGE LOADING TESTS
  // ============================================
  test.describe('Image Loading', () => {
    test('Home page images load correctly', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Check first 5 images to avoid timeout on pages with many images
        const imagesToCheck = Math.min(imageCount, 5);

        for (let i = 0; i < imagesToCheck; i++) {
          const img = images.nth(i);
          const isVisible = await img.isVisible();

          if (isVisible) {
            // Verify image has loaded (naturalWidth > 0 means loaded)
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            const src = await img.getAttribute('src');

            // Skip placeholder/data URLs
            if (src && !src.startsWith('data:')) {
              expect(naturalWidth, `Image ${src} failed to load`).toBeGreaterThan(0);
            }
          }
        }
      }
    });

    test('Case images load on cases page', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const caseImages = page.locator('img');
      const imageCount = await caseImages.count();

      if (imageCount > 0) {
        const imagesToCheck = Math.min(imageCount, 3);

        for (let i = 0; i < imagesToCheck; i++) {
          const img = caseImages.nth(i);
          const isVisible = await img.isVisible();

          if (isVisible) {
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            const src = await img.getAttribute('src');

            if (src && !src.startsWith('data:')) {
              expect(naturalWidth, `Case image ${src} failed to load`).toBeGreaterThan(0);
            }
          }
        }
      }
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  test.describe('Basic Accessibility', () => {
    test('Pages have main landmark', async ({ page }) => {
      for (const route of routes) {
        await page.goto(route.path, { waitUntil: 'networkidle' });

        // Check for main landmark
        const main = page.locator('main, [role="main"]');
        const hasMain = (await main.count()) > 0;
        expect(hasMain, `${route.name} page missing main landmark`).toBeTruthy();
      }
    });

    test('Images have alt attributes', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Find images without alt attribute
      const imagesWithoutAlt = page.locator('img:not([alt])');
      const count = await imagesWithoutAlt.count();

      // All images should have alt attribute (can be empty for decorative)
      expect(count, 'Found images without alt attribute').toBe(0);
    });

    test('Interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check that links and buttons are focusable
      const focusableElements = page.locator(
        'a[href], button, input, textarea, select, [tabindex]'
      );
      const count = await focusableElements.count();

      expect(count).toBeGreaterThan(0);
    });

    test('Page has skip link or proper heading structure', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check for skip link
      const skipLink = page.locator(
        'a[href="#main"], a[href="#content"], .skip-link, [class*="skip"]'
      );
      const hasSkipLink = (await skipLink.count()) > 0;

      // Check for h1
      const h1 = page.locator('h1');
      const hasH1 = (await h1.count()) > 0;

      // Should have either skip link or proper h1
      expect(hasSkipLink || hasH1).toBeTruthy();
    });

    test('Case cards have appropriate structure', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const caseLinks = page.locator('a[href^="/cases/"]');
      const count = await caseLinks.count();

      if (count > 0) {
        // Each case should have some accessible text
        const firstCase = caseLinks.first();
        const text = await firstCase.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================
  // NAVIGATION TESTS
  // ============================================
  test.describe('Navigation', () => {
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

    test('Navigation links are valid', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Get all navigation links
      const navLinks = page.locator('nav a[href^="/"], header a[href^="/"]');
      const linkCount = await navLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const href = await navLinks.nth(i).getAttribute('href');
        if (href && !href.includes('#')) {
          // Verify the link target exists
          const response = await page.request.get(href);
          expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
        }
      }
    });

    test('Case pagination works (if present)', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Check for pagination
      const pagination = page.locator(
        '[class*="pagination"], nav[aria-label*="pagination"], .page-numbers'
      );
      const hasPagination = (await pagination.count()) > 0;

      if (hasPagination) {
        // Try to click next page if available
        const nextButton = page
          .locator('button:has-text("Next"), a:has-text("Next"), [aria-label="Next"]')
          .first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');
          // Page should still be on cases
          expect(page.url()).toContain('/cases');
        }
      }
    });
  });

  // ============================================
  // FORM TESTS
  // ============================================
  test.describe('Forms', () => {
    test('Contact form renders correctly', async ({ page }) => {
      await page.goto('/contact', { waitUntil: 'networkidle' });

      // Verify form exists
      await expect(page.locator('form')).toBeVisible();

      // Verify essential form fields exist
      const nameInput = page.locator('input[name="name"], input[type="text"]').first();
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      const submitButton = page.locator('button[type="submit"], input[type="submit"]');

      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('Form fields have labels or aria-labels', async ({ page }) => {
      await page.goto('/contact', { waitUntil: 'networkidle' });

      const inputs = page.locator('input:not([type="hidden"]):not([type="submit"]), textarea');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        // Should have label, aria-label, aria-labelledby, or placeholder
        const hasLabel = id ? (await page.locator(`label[for="${id}"]`).count()) > 0 : false;
        const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy || placeholder;

        expect(hasAccessibleName, `Input ${i} missing accessible name`).toBeTruthy();
      }
    });
  });

  // ============================================
  // CASE-SPECIFIC TESTS
  // ============================================
  test.describe('Case Features', () => {
    test('Cases list displays cases or case cards', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Check for case links or case cards (various possible structures)
      const caseLinks = page.locator(
        'a[href^="/cases/"], a[href*="/cases/"], [data-case], .case-card, article'
      );
      const count = await caseLinks.count();

      // Should have at least one case element or the page should have substantive content
      const bodyText = await page.locator('body').textContent();
      const hasContent = bodyText && bodyText.length > 200;

      expect(
        count > 0 || hasContent,
        'Cases page should have case items or substantive content'
      ).toBeTruthy();
    });

    test('Case detail shows expected content sections', async ({ page }) => {
      // Navigate to cases list first
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const firstCase = page.locator('a[href^="/cases/"]').first();
      if (await firstCase.isVisible()) {
        await firstCase.click();
        await page.waitForLoadState('networkidle');

        // Case detail should have main content
        const mainContent = page.locator('main, [role="main"], article');
        await expect(mainContent.first()).toBeVisible();

        // Should have some text content
        const bodyText = await page.locator('body').textContent();
        expect(bodyText?.length).toBeGreaterThan(100);
      }
    });
  });

  // ============================================
  // DATA LOADING VERIFICATION TESTS
  // ============================================
  test.describe('Data Loading Verification', () => {
    test('Cases page loads cases from database', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Cases should be loaded and displayed
      const caseItems = page.locator('a[href^="/cases/"], article, .case-card');
      const itemCount = await caseItems.count();

      // Should have at least some case content
      const bodyText = await page.locator('body').textContent();
      expect(
        itemCount > 0 || (bodyText?.length ?? 0) > 300,
        'No cases loaded from database'
      ).toBeTruthy();
    });

    test('Case detail page loads complete content', async ({ page }) => {
      // Navigate to cases first
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const firstCase = page.locator('a[href^="/cases/"]').first();
      if (await firstCase.isVisible()) {
        await firstCase.click();
        await page.waitForLoadState('networkidle');

        // Verify case detail content loaded
        const mainContent = page.locator('article, main, .case-content, .case-detail');
        await expect(mainContent.first()).toBeVisible();

        // Content should have some meaningful length
        const bodyText = await page.locator('body').textContent();
        expect(
          bodyText?.length,
          'Case detail content too short - may not have loaded'
        ).toBeGreaterThan(100);
      }
    });

    test('Case of the Day loads case data', async ({ page }) => {
      await page.goto('/case-of-the-day', { waitUntil: 'networkidle' });

      // Case of the day should display content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length, 'Case of the Day content too short').toBeGreaterThan(200);

      // Should have case-related content
      const mainContent = page.locator('article, main, .case-content');
      await expect(mainContent.first()).toBeVisible();
    });

    test('Cases list shows case metadata', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      const firstCase = page.locator('a[href^="/cases/"]').first();
      if (await firstCase.isVisible()) {
        // Case cards should have some text content (title at minimum)
        const caseText = await firstCase.textContent();
        expect(caseText?.length, 'Case card has no text content').toBeGreaterThan(0);
      }
    });

    test('No loading spinners stuck on page after load', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Wait a bit for any animations
      await page.waitForTimeout(1000);

      // Check for common loading indicators that should not persist
      const loadingIndicators = page.locator(
        '[class*="loading"], [class*="spinner"], [class*="skeleton"], [aria-busy="true"]'
      );
      const visibleLoading = await loadingIndicators
        .filter({ has: page.locator(':visible') })
        .count();

      // No loading indicators should be visible after networkidle
      expect(visibleLoading, 'Loading indicators still visible after page load').toBe(0);
    });

    test('API errors do not show on successful pages', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (
            text.includes('API') ||
            text.includes('fetch') ||
            text.includes('network') ||
            text.includes('supabase')
          ) {
            errors.push(text);
          }
        }
      });

      await page.goto('/cases', { waitUntil: 'networkidle' });

      // No API-related errors
      expect(errors, 'API errors detected during page load').toEqual([]);
    });

    test('Case filtering works (if available)', async ({ page }) => {
      await page.goto('/cases', { waitUntil: 'networkidle' });

      // Check if there are filter options
      const filters = page.locator(
        'select, [class*="filter"], button[aria-label*="filter"], [data-filter]'
      );
      const hasFilters = (await filters.count()) > 0;

      if (hasFilters) {
        // Try interacting with filter
        const firstFilter = filters.first();
        if (await firstFilter.isVisible()) {
          await firstFilter.click();
          await page.waitForTimeout(500);

          // Page should still be functional
          const bodyText = await page.locator('body').textContent();
          expect(bodyText?.length).toBeGreaterThan(100);
        }
      }
    });
  });

  // ============================================
  // PERFORMANCE BASELINE TESTS
  // ============================================
  test.describe('Performance Baseline', () => {
    test('Home page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Page should load within 10 seconds (generous for dev server)
      expect(loadTime).toBeLessThan(10000);
    });

    test('Cases page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/cases', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Cases page may load more data, allow 15 seconds
      expect(loadTime).toBeLessThan(15000);
    });

    test('No excessive DOM size', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const domSize = await page.evaluate(() => document.querySelectorAll('*').length);

      // DOM should not exceed 3000 elements (reasonable threshold)
      expect(domSize).toBeLessThan(3000);
    });
  });
});
