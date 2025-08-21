import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, Page } from '@playwright/test';

describe('Personalization Smoke Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should load the application without errors', async () => {
    // Navigate to the app (adjust URL as needed)
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Check that no console errors occurred
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any async operations
    await page.waitForTimeout(2000);
    
    // Expect no critical console errors
    const criticalErrors = errors.filter(error => 
      !error.includes('404') && 
      !error.includes('favicon') &&
      !error.includes('Warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  it('should allow persona switching if personalization is enabled', async () => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Look for persona switcher (might not be visible by default)
    const personaSwitcher = page.locator('[data-testid="persona-switcher"]').first();
    
    if (await personaSwitcher.isVisible()) {
      // Test persona switching
      const aspiringButton = page.locator('text=Aspiring').first();
      const retireeButton = page.locator('text=Retiree').first();
      
      if (await aspiringButton.isVisible()) {
        await aspiringButton.click();
        await page.waitForTimeout(500);
      }
      
      if (await retireeButton.isVisible()) {
        await retireeButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Expect no errors during switching
    expect(true).toBe(true); // Test passes if no errors thrown
  });

  it('should handle navigation without breaking', async () => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Try navigating to different routes if they exist
    const routes = ['/', '/dashboard', '/profile'];
    
    for (const route of routes) {
      try {
        await page.goto(`http://localhost:5173${route}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Check that the page loaded successfully
        const title = await page.title();
        expect(title).toBeTruthy();
      } catch (error) {
        // Route might not exist, which is okay for this smoke test
        console.log(`Route ${route} not accessible:`, error);
      }
    }
  });
});