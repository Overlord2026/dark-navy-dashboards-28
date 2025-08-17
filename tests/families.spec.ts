import { test, expect } from '@playwright/test';

test('Families home renders hero', async ({ page }) => {
  await page.goto('/families');
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /get started|see how it works/i })).toBeVisible();
});

test('Nav shows Families & Professionals menus', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toContainText(/Families/i);
  await expect(page.getByRole('navigation')).toContainText(/Professionals/i);
});