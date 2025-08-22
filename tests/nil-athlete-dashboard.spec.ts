import { test, expect } from '@playwright/test';

test.describe('NIL athlete dashboard', () => {
  test('tabs render + quick actions open', async ({ page }) => {
    // TODO: add login helper or run in authed context
    await page.goto('/nil/athlete/home');
    await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible();

    const tabs = ['Portfolio','Discovery','Offers','Training','Contracts','Payments','Fans','Receipts'];
    for (const t of tabs) {
      const tab = page.getByRole('tab', { name: new RegExp(t, 'i') });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }

    // Quick actions
    const actions = [
      /Complete training/i,
      /Pick disclosure pack/i,
      /Create offer/i,
      /Open Merch/i,
      /Invite (agent|parent|school)/i
    ];
    for (const a of actions) {
      const btn = page.getByRole('button', { name: a });
      if (await btn.count()) {
        await btn.click();
        const modal = page.getByRole('dialog');
        if (await modal.count()) {
          await expect(modal).toBeVisible();
          await page.keyboard.press('Escape');
        } else {
          await expect(page).toHaveTitle(/.+/);
          await page.goBack();
        }
      }
    }

    // Receipts strip
    const strip = page.getByTestId('receipts-strip');
    await expect(strip).toBeVisible();
    await strip.getByRole('link', { name: /Open Receipts/i }).click();
    await expect(page).toHaveURL(/\/receipts/);
  });
});