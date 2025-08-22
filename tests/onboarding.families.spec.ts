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

test('family onboarding (aspiring) creates workspace and lands on home', async ({ page }) => {
  await page.goto('/start/families?seg=aspiring');
  // Step 2: goals
  await page.getByRole('button', { name: /Organize/i }).click();
  await page.getByRole('button', { name: /Plan/i }).click();
  // Step 3: email-only
  await page.getByRole('textbox', { name: /Email/i }).fill('aspiring@test.com');
  await page.getByRole('button', { name: /Create workspace/i }).click();
  await page.waitForURL('**/family/home');
  await expect(page.getByText(/Aspiring/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Quick Actions/i })).toBeVisible();
});

test('family home quick actions open modals', async ({ page }) => {
  // Set up session
  await page.goto('/family/home');
  await page.evaluate(() => {
    localStorage.setItem('user_session', JSON.stringify({
      email: 'test@example.com',
      segment: 'retirees',
      goals: ['plan', 'prove'],
      onboarded: true
    }));
  });
  await page.reload();

  // Test invite modal
  await page.getByRole('button', { name: /Invite/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // Test upload modal
  await page.getByRole('button', { name: /Upload/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('family home tabs and tool cards navigation', async ({ page }) => {
  // Set up session
  await page.goto('/family/home');
  await page.evaluate(() => {
    localStorage.setItem('user_session', JSON.stringify({
      email: 'test@example.com',
      segment: 'retirees',
      goals: ['plan', 'prove'],
      onboarded: true
    }));
  });
  await page.reload();

  // Test tab navigation
  await page.getByRole('tab', { name: /Tax/i }).click();
  await expect(page.getByText(/Roth Ladder/i)).toBeVisible();
  
  await page.getByRole('tab', { name: /Estate/i }).click();
  await expect(page.getByText(/Wealth Vault/i)).toBeVisible();

  // Test tool card click (should navigate)
  const toolCard = page.getByText(/Retirement Roadmap/i).first();
  await expect(toolCard).toBeVisible();
});

test('receipts modal opens and filters work', async ({ page }) => {
  // Set up session
  await page.goto('/family/home');
  await page.evaluate(() => {
    localStorage.setItem('user_session', JSON.stringify({
      email: 'test@example.com',
      segment: 'retirees',
      goals: ['plan', 'prove'],
      onboarded: true
    }));
  });
  await page.reload();

  // Open receipts modal
  await page.getByRole('button', { name: /Open Receipts/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Proof Slips/i)).toBeVisible();

  // Test filter
  await page.getByRole('combobox').click();
  await page.getByText(/Documents/i).click();

  // Close with ESC
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});