import { test, expect } from '@playwright/test';

test('family home tabs and cards navigate', async ({ page }) => {
  await page.goto('/family/home'); // assume authed in CI or stub auth
  const tabs = ['Income','Tax','Estate','Invest','Annuities','Health & Longevity','Solutions'];
  for (const t of tabs) {
    const tab = page.getByRole('tab', { name: new RegExp(t, 'i') });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    // Click first two cards (if present)
    const cards = page.locator('[data-tool-card]').first();
    if (await cards.count()) {
      await cards.nth(0).click();
      await expect(page).toHaveTitle(/.+/);
      await page.goBack();
    }
  }
});