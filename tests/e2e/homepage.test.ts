import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('SvelteKit Omakase');
});

test('home page has navigation links', async ({ page }) => {
  await page.goto('/');

  // Check for Login button
  const loginButton = page.locator('a[href="/login"]');
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toHaveText('Login');

  // Check for Register button
  const registerButton = page.locator('a[href="/register"]');
  await expect(registerButton).toBeVisible();
  await expect(registerButton).toHaveText('Register');
});
