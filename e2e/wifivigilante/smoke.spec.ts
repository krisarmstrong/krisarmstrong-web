import { test, expect } from '@playwright/test';

test.describe('WiFi Vigilante - Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Check page title
    await expect(page).toHaveTitle(/Wi-Fi Vigilante/i);

    // Check main heading
    await expect(page.locator('h1').first()).toBeVisible();

    // Check navbar
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('can navigate to cases page', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Click cases link
    await page.getByRole('link', { name: /cases/i }).first().click();

    // Verify we're on cases page
    await expect(page).toHaveURL(/\/cases/);
    await expect(page.locator('h1')).toContainText(/case/i);
  });

  test('can navigate to about page', async ({ page }) => {
    await page.goto('http://localhost:3003');

    await page.getByRole('link', { name: /about/i }).first().click();

    await expect(page).toHaveURL(/\/about/);
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i }).or(
      page.getByRole('button').filter({ has: page.locator('svg') }).first()
    );

    // Get initial theme
    const htmlElement = page.locator('html');
    const initialClass = await htmlElement.getAttribute('class');

    // Toggle theme
    await themeToggle.click();

    // Wait for theme change
    await page.waitForTimeout(100);

    // Verify theme changed
    const newClass = await htmlElement.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('case detail page loads', async ({ page }) => {
    await page.goto('http://localhost:3003/cases');

    // Click first case if available
    const firstCase = page.locator('a[href*="/cases/"]').first();
    if (await firstCase.isVisible()) {
      await firstCase.click();
      await expect(page).toHaveURL(/\/cases\//);
    }
  });

  test('contact form is accessible', async ({ page }) => {
    await page.goto('http://localhost:3003/contact');

    // Check form elements
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });
});
