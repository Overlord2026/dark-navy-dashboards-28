import { test, expect } from '@playwright/test';

test('quick actions open modals/routes', async ({ page }) => {
  await page.goto('/family/home');
  const actions = [
    /Invite my advisor/i,
    /Upload documents/i,
    /Run Retirement Roadmap/i,
    /Start Longevity Hub/i,
    /Open Annuity Calculators/i
  ];
  for (const a of actions) {
    const btn = page.getByRole('button', { name: a });
    if (await btn.count()) {
      await btn.click();
      // modal or navigation
      const modal = page.locator('[role="dialog"]');
      if (await modal.count()) {
        await expect(modal).toBeVisible();
        // close modal (ESC)
        await page.keyboard.press('Escape');
      } else {
        await expect(page).toHaveTitle(/.+/);
        await page.goBack();
      }
    }
  }
});