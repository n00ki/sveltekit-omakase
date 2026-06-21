import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('SvelteKit Omakase');
});

test('home page has authentication links', async ({ page }) => {
  await page.goto('/');

  const loginLink = page.getByRole('link', { name: 'Login' });
  await expect(loginLink).toBeVisible();
  await expect(loginLink).toHaveAttribute('href', '/login');

  const registerLink = page.getByRole('link', { name: 'Register' });
  await expect(registerLink).toBeVisible();
  await expect(registerLink).toHaveAttribute('href', '/register');
});
