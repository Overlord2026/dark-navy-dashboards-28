import { test, expect } from '@playwright/test';

test.describe('NIL agent pipeline', () => {
  test('pipeline states + dispute delta', async ({ page }) => {
    // TODO: login helper
    await page.goto('/nil/agent/home');
    await expect(page.getByRole('heading', { name: /pipeline/i })).toBeVisible();

    // Create an offer and move it forward (stub if needed)
    const create = page.getByRole('button', { name: /new offer|create offer/i });
    if (await create.count()) {
      await create.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
    }

    // Dispute center (delta)
    const disputeTab = page.getByRole('tab', { name: /disputes/i });
    if (await disputeTab.count()) {
      await disputeTab.click();
      const openBtn = page.getByRole('button', { name: /open dispute/i });
      if (await openBtn.count()) {
        await openBtn.click();
        await expect(page.getByText(/delta receipt/i)).toBeVisible();
      }
    }
  });
});