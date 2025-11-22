import { test, expect } from '@playwright/test';

test.describe('Intrinsic Momentum Mindset - Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3001');

    await expect(page).toHaveTitle(/Intrinsic/i);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('can navigate to services page', async ({ page }) => {
    await page.goto('http://localhost:3001');

    await page.getByRole('link', { name: /services/i }).first().click();

    await expect(page).toHaveURL(/\/services/);
  });

  test('can navigate to about page', async ({ page }) => {
    await page.goto('http://localhost:3001');

    await page.getByRole('link', { name: /about/i }).first().click();

    await expect(page).toHaveURL(/\/about/);
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('http://localhost:3001');

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

  test('contact form is accessible', async ({ page }) => {
    await page.goto('http://localhost:3001/contact');

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });
});
