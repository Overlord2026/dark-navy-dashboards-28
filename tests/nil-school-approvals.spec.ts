import { test, expect } from '@playwright/test';

test.describe('NIL school approvals', () => {
  test('policy manager + approvals + export', async ({ page }) => {
    // TODO: login helper (school admin)
    await page.goto('/nil/school/home');
    await expect(page.getByRole('heading', { name: /policy manager/i })).toBeVisible();

    const approveBtn = page.getByRole('button', { name: /approve/i }).first();
    if (await approveBtn.count()) {
      await approveBtn.click();
      await expect(page.getByText(/approved/i)).toBeVisible();
    }

    const exportBtn = page.getByRole('button', { name: /export audit pack/i });
    if (await exportBtn.count()) {
      await exportBtn.click();
      // You can assert a download event in CI if configured
    }
  });
});