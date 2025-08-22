import { test, expect } from '@playwright/test';

test.describe('Family Home Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up session as retiree family
    await page.goto('/family/home');
    await page.evaluate(() => {
      sessionStorage.setItem('familySegment', 'retirees');
    });
    await page.reload();
  });

  test('should show all tabs and navigate between them', async ({ page }) => {
    // Should show retiree tabs: Income, Tax, Estate, Invest, Annuities, Health
    await expect(page.locator('text=Income')).toBeVisible();
    await expect(page.locator('text=Tax')).toBeVisible();
    await expect(page.locator('text=Estate')).toBeVisible();
    await expect(page.locator('text=Invest')).toBeVisible();
    await expect(page.locator('text=Annuities')).toBeVisible();
    await expect(page.locator('text=Health')).toBeVisible();

    // Click each tab and verify content
    const tabs = ['Income', 'Tax', 'Estate', 'Invest', 'Annuities', 'Health'];
    
    for (const tab of tabs) {
      await page.locator(`button:has-text("${tab}")`).click();
      
      // Should show tab content with tool cards
      await expect(page.locator('.tool-card').or(page.locator('[data-testid="tool-card"]'))).toBeVisible();
    }
  });

  test('should show tool cards with correct links', async ({ page }) => {
    // Click Income tab
    await page.locator('button:has-text("Income")').click();
    
    // Should show income tools like Retirement Roadmap, RMD Check, SS Optimizer
    const incomeTools = ['Retirement Roadmap', 'RMD Check', 'Social Security'];
    
    for (const tool of incomeTools) {
      const toolCard = page.locator(`text=${tool}`).first();
      await expect(toolCard).toBeVisible();
      
      // Tool card should have a link
      const link = toolCard.locator('xpath=ancestor::a').or(toolCard.locator('xpath=ancestor::button'));
      await expect(link).toBeVisible();
    }
  });

  test('should navigate to tool pages from cards', async ({ page }) => {
    // Click Tax tab
    await page.locator('button:has-text("Tax")').click();
    
    // Click first two tool cards
    const toolCards = page.locator('.tool-card, [data-testid="tool-card"]').first();
    await toolCards.click();
    
    // Should navigate to tool page (check for page title or URL change)
    await expect(page.locator('h1').or(page.locator('[data-testid="page-title"]'))).toBeVisible();
    
    // Navigate back to family home
    await page.goBack();
    await expect(page).toHaveURL('/family/home');
  });

  test('should work for aspiring families', async ({ page }) => {
    // Switch to aspiring segment
    await page.evaluate(() => {
      sessionStorage.setItem('familySegment', 'aspiring');
    });
    await page.reload();

    // Should show aspiring tabs: Money, Tax, Estate, Health, Solutions
    await expect(page.locator('text=Money')).toBeVisible();
    await expect(page.locator('text=Tax')).toBeVisible();
    await expect(page.locator('text=Estate')).toBeVisible();
    await expect(page.locator('text=Health')).toBeVisible();
    await expect(page.locator('text=Solutions')).toBeVisible();
  });
});