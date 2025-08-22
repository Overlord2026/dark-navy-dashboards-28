import { test, expect } from '@playwright/test';

test('receipts strip shows latest proof slip', async ({ page }) => {
  await page.goto('/family/home');
  const strip = page.getByTestId('receipts-strip');
  await expect(strip).toBeVisible();
  const open = strip.getByRole('link', { name: /Open Receipts/i });
  await open.click();
  await expect(page).toHaveURL(/\/receipts/);
  await expect(page.getByRole('heading', { name: /Receipts/i })).toBeVisible();
});