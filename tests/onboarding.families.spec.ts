import { test, expect } from '@playwright/test';

test('family onboarding (retirees) creates workspace and lands on home', async ({ page }) => {
  await page.goto('/start/families?seg=retirees');
  // Step 2: goals
  await page.getByRole('button', { name: /Plan/i }).click();
  await page.getByRole('button', { name: /Prove/i }).click();
  // Step 3: email-only
  await page.getByRole('textbox', { name: /Email/i }).fill('retiree@test.com');
  await page.getByRole('button', { name: /Create workspace/i }).click();
  await page.waitForURL('**/family/home');
  await expect(page.getByText(/Retirees/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Quick Actions/i })).toBeVisible();
});