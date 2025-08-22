import { test, expect } from '@playwright/test';

test.describe('NIL public experience', () => {
  test('NIL hub + Index + athlete profile open', async ({ page }) => {
    await page.goto('/nil');
    await expect(page.getByRole('heading', { name: /athlete as hero/i })).toBeVisible();

    // Open 60-sec demo and close
    const demoBtn = page.getByRole('button', { name: /see 60-second demo/i }).first();
    await demoBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Index
    await page.goto('/nil/index');
    await expect(page.getByRole('heading', { name: /nil index/i })).toBeVisible();
    await page.getByPlaceholder(/search/i).fill('smith');
    await page.keyboard.press('Enter');
    // Open first profile (if present)
    const firstProfile = page.getByRole('link', { name: /profile/i }).first();
    if (await firstProfile.count()) {
      await firstProfile.click();
      await expect(page).toHaveURL(/\/a\//);
      await expect(page.getByRole('heading', { name: /portfolio|bio|stats/i })).toBeVisible();
    }
  });
});