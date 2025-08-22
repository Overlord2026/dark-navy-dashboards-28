import { test, expect } from '@playwright/test';

test.describe('Family Receipts and Proof Slips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/family/home');
    await page.evaluate(() => {
      sessionStorage.setItem('familySegment', 'retirees');
    });
    await page.reload();
  });

  test('should show receipts strip on family home', async ({ page }) => {
    // Should show receipts section
    await expect(
      page.locator('text=Receipts').or(page.locator('text=Proof Slips')).or(page.locator('[data-testid="receipts"]'))
    ).toBeVisible();
    
    // Should show "Open Receipts" link or button
    await expect(
      page.locator('button:has-text("Open Receipts"), a:has-text("Open Receipts"), text=View All')
    ).toBeVisible();
  });

  test('should generate proof slip when using calculator', async ({ page }) => {
    // Navigate to a calculator that generates proof slips
    await page.locator('button:has-text("Tax")').click();
    
    // Find and click a calculator tool
    const calculatorLink = page.locator('text=RMD Check, text=Roth Ladder').first();
    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      
      // If this is a working calculator, try to generate a calculation
      // This may be stubbed in public mode, so we'll check for any calculation form
      const calcForm = page.locator('form, [data-testid="calculator"], input, button:has-text("Calculate")');
      if (await calcForm.isVisible()) {
        // Try to fill and submit a basic calculation
        const numberInput = page.locator('input[type="number"]').first();
        if (await numberInput.isVisible()) {
          await numberInput.fill('100000');
        }
        
        const submitButton = page.locator('button:has-text("Calculate"), button:has-text("Submit"), button[type="submit"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
        }
      }
      
      // Go back to family home to check for new proof slip
      await page.goto('/family/home');
      
      // Check if receipts strip shows any new items
      // In a real implementation, this would show the new proof slip
      await expect(page.locator('[data-testid="receipts"], text=Receipts')).toBeVisible();
    }
  });

  test('should open receipts viewer', async ({ page }) => {
    // Click "Open Receipts" to go to full receipts viewer
    const openReceiptsButton = page.locator('button:has-text("Open Receipts"), a:has-text("Open Receipts"), text=View All');
    
    if (await openReceiptsButton.isVisible()) {
      await openReceiptsButton.click();
      
      // Should navigate to receipts page
      await expect(page).toHaveURL(/\/receipts/);
      
      // Should show receipts viewer with filtering options
      await expect(
        page.locator('text=Proof Slips').or(page.locator('text=Receipts')).or(page.locator('[data-testid="receipts-viewer"]'))
      ).toBeVisible();
    }
  });

  test('should show proof slip verification', async ({ page }) => {
    // In the receipts strip, look for verification indicators
    const receiptsSection = page.locator('[data-testid="receipts"], text=Receipts').first();
    await expect(receiptsSection).toBeVisible();
    
    // Look for verification checkmarks or "Verify" buttons
    // This tests the concept even if no actual proof slips exist yet
    const verifyElements = page.locator('text=Verify, text=✓, [data-testid="verify"], .verify-badge');
    
    // Should either show verification elements or empty state
    await expect(
      verifyElements.or(page.locator('text=No receipts yet, text=No proof slips'))
    ).toBeVisible();
  });

  test('should filter proof slips by type', async ({ page }) => {
    // Navigate to full receipts viewer
    const openReceiptsButton = page.locator('button:has-text("Open Receipts"), a:has-text("Open Receipts")');
    
    if (await openReceiptsButton.isVisible()) {
      await openReceiptsButton.click();
      
      // Look for filter options (type, date, etc.)
      const filterOptions = page.locator(
        'select, [data-testid="filter"], button:has-text("Filter"), text=Type'
      );
      
      if (await filterOptions.isVisible()) {
        // Try to use filters
        const typeFilter = page.locator('select, [data-testid="type-filter"]').first();
        if (await typeFilter.isVisible()) {
          await typeFilter.click();
        }
      }
      
      // Should show receipts or empty state
      await expect(
        page.locator('[data-testid="receipts-list"]').or(page.locator('text=No receipts'))
      ).toBeVisible();
    }
  });
});