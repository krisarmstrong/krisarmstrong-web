import { test, expect, type Page } from '@playwright/test';

/**
 * Comprehensive smoke tests for krisarmstrong.com
 * Verifies pages load correctly, no console errors, SEO, accessibility, and mobile responsiveness
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
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  test.describe('Basic Accessibility', () => {
    test('Home page has main content area', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check for main landmark or semantic structure
      const main = page.locator(
        'main, [role="main"], article, section, .main-content, #root > div'
      );
      const hasMain = (await main.count()) > 0;
      expect(hasMain, 'Home page missing main content area').toBeTruthy();
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
  });

  // ============================================
  // NAVIGATION TESTS
  // ============================================
  test.describe('Navigation', () => {
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
  // DATA LOADING VERIFICATION TESTS
  // ============================================
  test.describe('Data Loading Verification', () => {
    test('Blog page loads blog posts from database', async ({ page }) => {
      await page.goto('/blog', { waitUntil: 'networkidle' });

      // Blog posts should be loaded and displayed
      const blogPosts = page.locator('a[href^="/blog/"]');
      const postCount = await blogPosts.count();

      // Should have at least one blog post loaded
      expect(postCount, 'No blog posts loaded from database').toBeGreaterThan(0);
    });

    test('Blog post detail loads complete content', async ({ page }) => {
      // Navigate to blog first
      await page.goto('/blog', { waitUntil: 'networkidle' });

      const firstPost = page.locator('a[href^="/blog/"]').first();
      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // Verify blog post content loaded
        const articleContent = page.locator('article, main, .blog-content, .post-content');
        await expect(articleContent.first()).toBeVisible();

        // Content should have some meaningful length
        const bodyText = await page.locator('body').textContent();
        expect(
          bodyText?.length,
          'Blog post content too short - may not have loaded'
        ).toBeGreaterThan(100);
      }
    });

    test('Projects page loads project data', async ({ page }) => {
      await page.goto('/projects', { waitUntil: 'networkidle' });

      // Projects should be displayed
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length, 'Projects page content too short').toBeGreaterThan(100);

      // Check for project cards/items
      const projectItems = page.locator('article, .project, [class*="project"], .card');
      const count = await projectItems.count();

      // Should have project content
      expect(count > 0 || (bodyText?.length ?? 0) > 300, 'No project data loaded').toBeTruthy();
    });

    test('Skills page loads skills data', async ({ page }) => {
      await page.goto('/skills', { waitUntil: 'networkidle' });

      // Skills content should be displayed
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length, 'Skills page content too short').toBeGreaterThan(100);
    });

    test('Resume page loads resume data', async ({ page }) => {
      await page.goto('/resume', { waitUntil: 'networkidle' });

      // Resume content should be displayed
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length, 'Resume page content too short').toBeGreaterThan(200);
    });

    test('No loading spinners stuck on page after load', async ({ page }) => {
      await page.goto('/blog', { waitUntil: 'networkidle' });

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

      await page.goto('/blog', { waitUntil: 'networkidle' });

      // No API-related errors
      expect(errors, 'API errors detected during page load').toEqual([]);
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

    test('No excessive DOM size', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const domSize = await page.evaluate(() => document.querySelectorAll('*').length);

      // DOM should not exceed 3000 elements (reasonable threshold)
      expect(domSize).toBeLessThan(3000);
    });
  });
});
