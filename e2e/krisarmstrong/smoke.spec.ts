import { test, expect } from '@playwright/test';

test.describe('Kris Armstrong - Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page).toHaveTitle(/Kris Armstrong/i);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('can navigate to blog', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByRole('link', { name: /blog/i }).first().click();

    await expect(page).toHaveURL(/\/blog/);
  });

  test('can navigate to projects', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByRole('link', { name: /projects/i }).first().click();

    await expect(page).toHaveURL(/\/projects/);
  });

  test('can navigate to resume', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByRole('link', { name: /resume/i }).first().click();

    await expect(page).toHaveURL(/\/resume/);
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const themeToggle = page.getByRole('button', { name: /theme/i }).or(
      page.getByRole('button').filter({ has: page.locator('svg') }).first()
    );

    const htmlElement = page.locator('html');
    const initialClass = await htmlElement.getAttribute('class');

    await themeToggle.click();
    await page.waitForTimeout(100);

    const newClass = await htmlElement.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('blog post loads', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');

    const firstPost = page.locator('a[href*="/blog/"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await expect(page).toHaveURL(/\/blog\//);
      await expect(page.locator('article')).toBeVisible();
    }
  });

  test('contact form is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });
});
