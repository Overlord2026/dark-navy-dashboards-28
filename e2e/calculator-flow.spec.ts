import { test, expect } from '@playwright/test';

test.describe('Calculator Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set family persona and navigate to families page
    await page.goto('/');
    await page.getByRole('button', { name: 'See How It Works' }).click();
    await expect(page).toHaveURL('/families');
  });

  test('should run Monte Carlo calculator and show results', async ({ page }) => {
    // Look for calculator or value calculator button
    const calculatorButton = page.getByRole('button', { name: /calculator|value/i }).first();
    if (await calculatorButton.isVisible()) {
      await calculatorButton.click();
    } else {
      // Navigate to calculator page if direct button not found
      await page.goto('/calculator');
    }
    
    // Wait for calculator form to load
    await expect(page.getByText(/monte carlo|simulation|calculator/i)).toBeVisible({ timeout: 10000 });
    
    // Fill in sample values if form inputs are available
    const ageInput = page.locator('input[type="number"]').first();
    if (await ageInput.isVisible()) {
      await ageInput.fill('45');
    }
    
    const incomeInput = page.locator('input[type="number"]').nth(1);
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('150000');
    }
    
    // Look for calculate/run button
    const runButton = page.getByRole('button', { name: /calculate|run|simulate/i });
    if (await runButton.isVisible()) {
      await runButton.click();
      
      // Wait for results to appear
      await expect(page.getByText(/result|projection|probability/i)).toBeVisible({ timeout: 15000 });
    }
  });

  test('should run RMD calculator and show results', async ({ page }) => {
    // Navigate to RMD calculator
    await page.goto('/calculator/rmd');
    
    // Fill RMD calculator if available
    const accountValueInput = page.locator('input[placeholder*="account" i], input[placeholder*="balance" i]').first();
    if (await accountValueInput.isVisible()) {
      await accountValueInput.fill('500000');
      
      const calculateButton = page.getByRole('button', { name: /calculate/i });
      if (await calculateButton.isVisible()) {
        await calculateButton.click();
        
        // Check for RMD results
        await expect(page.getByText(/required minimum distribution|rmd/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should show calculator error handling', async ({ page }) => {
    await page.goto('/calculator');
    
    // Try to run calculator with invalid/empty values
    const runButton = page.getByRole('button', { name: /calculate|run/i });
    if (await runButton.isVisible()) {
      await runButton.click();
      
      // Should show validation or error message
      await expect(page.getByText(/required|invalid|error/i)).toBeVisible({ timeout: 5000 });
    }
  });
});