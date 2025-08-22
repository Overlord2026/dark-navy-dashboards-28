import { test, expect } from '@playwright/test';

test('Admin Env shows build and flags safely', async ({ page }) => {
  // TODO: admin login helper
  await page.goto('/admin/env');
  await expect(page.getByRole('heading', { name: /build/i })).toBeVisible();
  await expect(page.getByText(/PUBLIC_DISCOVER_ENABLED/i)).toBeVisible();
  // VITE_ keys table present (values masked if suspicious)
  await expect(page.getByRole('button', { name: /export json/i })).toBeVisible();
});