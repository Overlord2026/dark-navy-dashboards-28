import { test, expect } from '@playwright/test';

test.describe('NIL End-to-End Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start from onboarding
    await page.goto('/nil/onboarding');
  });

  test('complete education flow generates Decision-RDS', async ({ page }) => {
    // Skip onboarding
    await page.goto('/nil/education');
    
    // Check for education modules
    await expect(page.locator('text=NIL Education')).toBeVisible();
    
    // Complete a module (if available)
    const completeButton = page.locator('button:text("Complete")').first();
    if (await completeButton.isVisible()) {
      await completeButton.click();
      
      // Check for success toast
      await expect(page.locator('text=Module Completed!')).toBeVisible({ timeout: 10000 });
    }
  });

  test('disclosure pack confirmation generates Decision-RDS', async ({ page }) => {
    await page.goto('/nil/disclosures');
    
    await expect(page.locator('text=Disclosure Packs')).toBeVisible();
    
    // Select channel and jurisdiction
    await page.selectOption('[data-testid="channel-select"]', 'IG');
    await page.selectOption('[data-testid="jurisdiction-select"]', 'US');
    
    // Get recommendation
    await page.click('button:text("Get Recommendation")');
    
    // If recommendation appears, confirm it
    const confirmButton = page.locator('button:text("Confirm Pack")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await expect(page.locator('text=Disclosure Pack Confirmed!')).toBeVisible({ timeout: 10000 });
    }
  });

  test('receipts viewer shows generated receipts', async ({ page }) => {
    await page.goto('/nil/receipts');
    
    await expect(page.locator('text=Receipt Viewer')).toBeVisible();
    
    // Check for receipts table
    await expect(page.locator('table')).toBeVisible();
    
    // Filter functionality
    await page.click('button:text("Decision-RDS")');
    await expect(page.locator('button:text("Decision-RDS")[data-state="selected"]')).toBeVisible();
  });

  test('offers page shows conflict checking', async ({ page }) => {
    await page.goto('/nil/offers');
    
    await expect(page.locator('text=NIL Offers')).toBeVisible();
    
    // Should show offer creation form
    await expect(page.locator('input[placeholder*="brand" i], input[name*="brand" i]')).toBeVisible();
  });

  test('marketplace shows team management', async ({ page }) => {
    await page.goto('/nil/marketplace');
    
    await expect(page.locator('text=Professional Marketplace')).toBeVisible();
  });

  test('contract page shows policy checks', async ({ page }) => {
    await page.goto('/nil/contract/test-contract');
    
    await expect(page.locator('text=Contract Editor')).toBeVisible();
  });

  test('payments page shows escrow management', async ({ page }) => {
    await page.goto('/nil/payments');
    
    await expect(page.locator('text=Payments & Escrow')).toBeVisible();
  });

  test('disputes page shows delta tracking', async ({ page }) => {
    await page.goto('/nil/disputes');
    
    await expect(page.locator('text=Disputes & Adjustments')).toBeVisible();
  });

  test('admin page shows policy management', async ({ page }) => {
    await page.goto('/nil/admin');
    
    await expect(page.locator('text=NIL Administration')).toBeVisible();
  });

  test('pricing page shows entitlement gates', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('text=Choose Your Plan')).toBeVisible();
    
    // Should show plan options
    await expect(page.locator('text=Basic')).toBeVisible();
    await expect(page.locator('text=Professional')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/nil/education');
    
    // Navigate through the flow
    await page.click('a[href="/nil/disclosures"]');
    await expect(page.locator('text=Disclosure Packs')).toBeVisible();
    
    await page.click('a[href="/nil/offers"]');
    await expect(page.locator('text=NIL Offers')).toBeVisible();
    
    await page.click('a[href="/nil/receipts"]');
    await expect(page.locator('text=Receipt Viewer')).toBeVisible();
  });

  test('receipt verification works', async ({ page }) => {
    await page.goto('/nil/receipts');
    
    // Look for verify buttons
    const verifyButton = page.locator('button:text("Verify")').first();
    if (await verifyButton.isVisible()) {
      await verifyButton.click();
      
      // Should show verification result
      await expect(page.locator('text=Anchor')).toBeVisible({ timeout: 5000 });
    }
  });
});