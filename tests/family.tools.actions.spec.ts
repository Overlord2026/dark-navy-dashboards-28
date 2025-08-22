import { test, expect } from '@playwright/test';

test.describe('Family Tools Quick Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Set up session as retiree family
    await page.goto('/family/home');
    await page.evaluate(() => {
      sessionStorage.setItem('familySegment', 'retirees');
    });
    await page.reload();
  });

  test('should show and execute retiree quick actions', async ({ page }) => {
    // Should show retiree quick actions
    const retireeActions = [
      'Optimize Social Security',
      'Check my RMD', 
      'Review Annuity Proposal',
      'Explore Private Markets',
      'Update Will/Trust'
    ];

    for (const action of retireeActions) {
      const actionButton = page.locator(`button:has-text("${action}"), a:has-text("${action}")`);
      await expect(actionButton).toBeVisible();
    }
  });

  test('should navigate to correct routes for actions', async ({ page }) => {
    // Test "Optimize Social Security" action
    await page.locator('button:has-text("Optimize Social Security"), a:has-text("Optimize Social Security")').click();
    
    // Should navigate to Social Security tool or show modal
    await expect(
      page.locator('text=Social Security').or(page.locator('.modal')).or(page.locator('[data-testid="modal"]'))
    ).toBeVisible();
    
    // Go back to test next action
    await page.goBack();
    
    // Test "Check my RMD" action
    await page.locator('button:has-text("Check my RMD"), a:has-text("Check my RMD")').click();
    
    // Should show RMD tool or relevant content
    await expect(
      page.locator('text=RMD').or(page.locator('text=Required Minimum Distribution'))
    ).toBeVisible();
  });

  test('should work for aspiring families', async ({ page }) => {
    // Switch to aspiring segment
    await page.evaluate(() => {
      sessionStorage.setItem('familySegment', 'aspiring');
    });
    await page.reload();

    // Should show aspiring quick actions
    const aspiringActions = [
      'Invite my advisor',
      'Upload documents to Vault',
      'Run Retirement Roadmap',
      'Start Longevity Hub',
      'Open Annuity Calculators'
    ];

    for (const action of aspiringActions) {
      const actionButton = page.locator(`button:has-text("${action}"), a:has-text("${action}")`);
      await expect(actionButton).toBeVisible();
    }
  });

  test('should handle modals and overlays', async ({ page }) => {
    // Click an action that might open a modal
    await page.locator('button:has-text("Upload documents"), a:has-text("Upload documents")').click();
    
    // Check if modal opened or page navigated
    const modalOrPage = page.locator('.modal, [data-testid="modal"], h1, [data-testid="page-title"]');
    await expect(modalOrPage).toBeVisible();
    
    // If modal, try to close it
    const closeButton = page.locator('button:has-text("×"), button:has-text("Close"), [aria-label="Close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  });
});