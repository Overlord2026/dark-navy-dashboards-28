import { test, expect } from '@playwright/test';

test.describe('Family Onboarding Flow', () => {
  test('should complete retirees onboarding and land on family home', async ({ page }) => {
    // Visit onboarding with retirees segment pre-selected
    await page.goto('/start/families?seg=retirees');
    
    // Should show segment selector (even if pre-selected) or skip to goals
    await expect(page.locator('text=Retirees').or(page.locator('text=Goals'))).toBeVisible();
    
    // If segment selection is shown, click Retirees
    const retireeButton = page.locator('button:has-text("Retirees")');
    if (await retireeButton.isVisible()) {
      await retireeButton.click();
    }
    
    // Select some goals (should be chips like Organize, Plan, etc.)
    await page.locator('button:has-text("Plan")').click();
    await page.locator('button:has-text("Comply")').click();
    
    // Fill email form
    await page.fill('input[type="email"]', 'test-retiree@example.com');
    
    // Submit onboarding
    await page.locator('button:has-text("Get Started")').click();
    
    // Should redirect to family home
    await expect(page).toHaveURL('/family/home');
    
    // Should show Retirees badge
    await expect(page.locator('text=Retirees')).toBeVisible();
    
    // Should show welcome message or toast
    await expect(page.locator('text=Welcome').or(page.locator('.toast'))).toBeVisible();
  });

  test('should complete aspiring onboarding', async ({ page }) => {
    await page.goto('/start/families?seg=aspiring');
    
    // Should show aspiring flow
    await expect(page.locator('text=Aspiring').or(page.locator('text=Goals'))).toBeVisible();
    
    // If segment selection is shown, click Aspiring
    const aspiringButton = page.locator('button:has-text("Aspiring")');
    if (await aspiringButton.isVisible()) {
      await aspiringButton.click();
    }
    
    // Select goals
    await page.locator('button:has-text("Organize")').click();
    await page.locator('button:has-text("Plan")').click();
    
    // Fill email
    await page.fill('input[type="email"]', 'test-aspiring@example.com');
    
    // Submit
    await page.locator('button:has-text("Get Started")').click();
    
    // Should land on family home with Aspiring badge
    await expect(page).toHaveURL('/family/home');
    await expect(page.locator('text=Aspiring')).toBeVisible();
  });
});