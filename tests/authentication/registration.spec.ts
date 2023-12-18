import db from '../../src/lib/server/database';
import { users } from '../../src/lib/db/models/auth';
import { expect, test } from '@playwright/test';
import { eq } from 'drizzle-orm';

test('should create a new user', async ({ page }) => {
  await page.goto('/register');
  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'test1234');
  await page.fill('input[name="passwordConfirmation"]', 'test1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  const user = await db.select().from(users).where(eq(users.email, 'test@test.com'));
  expect(user).toHaveLength(1);
  expect(user[0].email).toBe('test@test.com');
});
