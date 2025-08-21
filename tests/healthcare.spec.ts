import { test, expect } from '@playwright/test';

test.describe('Healthcare E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('HSA plan to receipt flow', async ({ page }) => {
    test.setTimeout(60000);

    // Navigate to HSA page
    await page.click('[data-testid="health-navigation"]');
    await page.click('text="HSA & Healthcare"');
    
    // Wait for HSA page to load
    await expect(page.locator('h1')).toContainText('HSA');

    // Click on create HSA plan
    await page.click('[data-testid="create-hsa-plan"]');
    
    // Fill out HSA plan form
    await page.fill('[data-testid="contribution-amount"]', '3000');
    await page.selectOption('[data-testid="plan-type"]', 'individual');
    
    // Submit the plan
    await page.click('[data-testid="submit-hsa-plan"]');
    
    // Wait for success message and receipt
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="hsa-receipt"]')).toBeVisible();
    
    // Verify receipt contains required information
    const receipt = page.locator('[data-testid="hsa-receipt"]');
    await expect(receipt).toContainText('Health-RDS');
    await expect(receipt).toContainText('H-2025.08'); // Policy version
    await expect(receipt).toContainText('allow'); // Result
  });

  test('Screening gate to receipt flow', async ({ page }) => {
    test.setTimeout(60000);

    // Navigate to health screenings
    await page.click('[data-testid="health-navigation"]');
    await page.click('text="Health Screenings"');
    
    // Wait for screenings page
    await expect(page.locator('h1')).toContainText('Health Screenings');

    // Start a screening
    await page.click('[data-testid="start-screening"]');
    
    // Fill screening form
    await page.fill('[data-testid="age-input"]', '35');
    await page.fill('[data-testid="last-screening"]', '2023-01-01');
    
    // Submit screening request
    await page.click('[data-testid="submit-screening"]');
    
    // Verify screening gate allows access
    await expect(page.locator('[data-testid="screening-approved"]')).toBeVisible();
    
    // Check that receipt was generated
    await page.click('[data-testid="view-receipt"]');
    const receipt = page.locator('[data-testid="screening-receipt"]');
    await expect(receipt).toContainText('Health-RDS');
    await expect(receipt).toContainText('annual_screening');
    await expect(receipt).toContainText('ELIGIBLE_FOR_ANNUAL_SCREENING');
  });

  test('Export denied without consent flow', async ({ page }) => {
    test.setTimeout(60000);

    // Navigate to health records
    await page.click('[data-testid="health-navigation"]');
    await page.click('text="Health Records"');
    
    // Try to export without consent
    await page.click('[data-testid="export-records"]');
    
    // Should be blocked by consent requirement
    await expect(page.locator('[data-testid="consent-required"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-denied"]')).toBeVisible();
    
    // Verify denial receipt was created
    await page.click('[data-testid="view-denial-receipt"]');
    const receipt = page.locator('[data-testid="denial-receipt"]');
    await expect(receipt).toContainText('Consent-RDS');
    await expect(receipt).toContainText('deny');
    await expect(receipt).toContainText('CONSENT_REQUIRED');
    
    // Now provide consent
    await page.click('[data-testid="provide-consent"]');
    await page.check('[data-testid="consent-checkbox-health"]');
    await page.check('[data-testid="consent-checkbox-export"]');
    await page.fill('[data-testid="consent-purpose"]', 'medical records export');
    await page.click('[data-testid="submit-consent"]');
    
    // Verify consent receipt
    await expect(page.locator('[data-testid="consent-granted"]')).toBeVisible();
    
    // Try export again - should now succeed
    await page.click('[data-testid="export-records"]');
    await expect(page.locator('[data-testid="export-success"]')).toBeVisible();
    
    // Verify export receipt with disclosures
    await page.click('[data-testid="view-export-receipt"]');
    const exportReceipt = page.locator('[data-testid="export-receipt"]');
    await expect(exportReceipt).toContainText('Health-RDS');
    await expect(exportReceipt).toContainText('minimum-necessary');
    await expect(exportReceipt).toContainText('purpose:medical records export');
  });

  test('Accessibility keyboard navigation', async ({ page }) => {
    test.setTimeout(30000);

    // Navigate using keyboard only
    await page.keyboard.press('Tab'); // Skip to content link
    await page.keyboard.press('Tab'); // Main navigation
    
    // Use arrow keys for navigation
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter'); // Should open health section
    
    // Verify skip to content works
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Activate skip link
    
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('Screen reader compatibility', async ({ page }) => {
    test.setTimeout(30000);

    // Check for proper ARIA labels and landmarks
    await expect(page.locator('main[role="main"]')).toBeVisible();
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    
    // Check form labels
    const forms = page.locator('form');
    const count = await forms.count();
    
    for (let i = 0; i < count; i++) {
      const form = forms.nth(i);
      const inputs = form.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let j = 0; j < inputCount; j++) {
        const input = inputs.nth(j);
        const hasLabel = await input.evaluate((el) => {
          return !!el.getAttribute('aria-label') || 
                 !!el.getAttribute('aria-labelledby') ||
                 !!document.querySelector(`label[for="${el.id}"]`);
        });
        expect(hasLabel).toBeTruthy();
      }
    }
  });
});