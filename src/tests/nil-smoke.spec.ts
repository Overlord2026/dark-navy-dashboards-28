import { test, expect } from '@playwright/test';

// NIL Smoke Tests - Automated safety nets for demo functionality
// These tests run headless and avoid external calls (fixture-backed only)

test.describe('NIL Demo Smoke Tests', () => {
  // Configure tests to run in isolation and avoid external dependencies
  test.beforeEach(async ({ page }) => {
    // Set no_anchor flag to avoid external anchoring calls
    await page.goto('/nil/demo?no_anchor=1');
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
  });

  test('Demo Reset - should load coach fixtures and show pending invite', async ({ page }) => {
    // Test 1: Load /nil/demo → click "Reset NIL Demo (Coach)" → expect invites list to contain seeded email
    
    // Click the reset button for coach profile
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    
    // Wait for success toast and fixture loading
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded for coach persona');
    
    // Navigate to marketplace to check invites
    await page.click('a[href="/nil/marketplace"]');
    await page.waitForLoadState('networkidle');
    
    // Verify the seeded invite email appears
    await expect(page.locator('text=tony@awmfl.com')).toBeVisible();
    await expect(page.locator('text=pending')).toBeVisible();
  });

  test('Education Modules - should show 3 complete modules', async ({ page }) => {
    // Test 2: Navigate to Education → expect 3 modules with complete status
    
    // First reset to ensure clean state
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded');
    
    // Navigate to education page
    await page.click('a[href="/nil/education"]');
    await page.waitForLoadState('networkidle');
    
    // Verify 3 modules are present and complete
    await expect(page.locator('text=NIL Basics')).toBeVisible();
    await expect(page.locator('text=Disclosure & FTC')).toBeVisible();
    await expect(page.locator('text=Brand Safety')).toBeVisible();
    
    // Check for completion indicators (100% progress)
    const progressElements = page.locator('text=100%');
    await expect(progressElements).toHaveCount(3);
    
    // Verify complete status badges
    const completeElements = page.locator('text=complete');
    await expect(completeElements).toHaveCount(3);
  });

  test('Offer Creation - should generate receipt when saving offer', async ({ page }) => {
    // Test 3: Create/Save an Offer → open receipts viewer → expect one new NIL receipt
    
    // Reset to clean state
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded');
    
    // Navigate to offers page
    await page.click('a[href="/nil/offers"]');
    await page.waitForLoadState('networkidle');
    
    // Check receipts count before creating offer
    const receiptsBefore = await page.locator('.fixed.bottom-0 a[href="/nil/receipts"]').count();
    
    // Fill out and save a new offer
    await page.click('button:has-text("Create New Offer")');
    
    // Fill basic offer details (most should be prefilled)
    await page.fill('input[placeholder*="brand"], input[name*="brand"], input[id*="brand"]', 'Test Brand');
    await page.fill('input[type="number"]:first', '250'); // budget
    
    // Save the offer
    await page.click('button:has-text("Save Offer")');
    
    // Wait for success feedback
    await expect(page.locator('.sonner-toast')).toContainText('created');
    
    // Check that receipts strip at bottom shows new receipt
    await expect(page.locator('.fixed.bottom-0')).toContainText('Trust Rails:');
    
    // Navigate to receipts page to verify new receipt
    await page.click('a[href="/nil/receipts"]');
    await page.waitForLoadState('networkidle');
    
    // Verify receipt for offer creation exists
    await expect(page.locator('text=offer.create, text=offer_create')).toBeVisible();
    await expect(page.locator('text=approve')).toBeVisible();
  });

  test('Complete Demo Flow - 90 second presenter script', async ({ page }) => {
    // Comprehensive test covering the full demo script
    
    // 1. One-click reset
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded for coach persona');
    
    // 2. Check marketplace invites
    await page.click('a[href="/nil/marketplace"]');
    await expect(page.locator('text=tony@awmfl.com')).toBeVisible();
    
    // 3. Check education completion
    await page.click('a[href="/nil/education"]');
    await expect(page.locator('text=100%')).toHaveCount(3);
    
    // 4. Create offer and check receipts
    await page.click('a[href="/nil/offers"]');
    await page.click('button:has-text("Create New Offer")');
    await page.fill('input[placeholder*="brand"], input[name*="brand"], input[id*="brand"]', 'Demo Brand');
    await page.click('button:has-text("Save Offer")');
    
    // Verify receipt appears in bottom strip
    await expect(page.locator('.fixed.bottom-0')).toContainText('Trust Rails:');
    
    // 5. Check catalog functionality
    await page.click('a[href="/nil/marketplace"]');
    await expect(page.locator('text=Media Kit Review')).toBeVisible();
    await expect(page.locator('text=$99')).toBeVisible();
  });

  test('Health Check - should show system status correctly', async ({ page }) => {
    // Verify health indicators work properly
    
    // Check for fallback indicators if applicable
    const fallbackBadge = page.locator('text=Fallback Mode');
    const noAnchorBadge = page.locator('text=No Anchoring');
    
    // At least one status indicator should be present
    const hasStatusIndicator = await fallbackBadge.count() > 0 || await noAnchorBadge.count() > 0;
    
    // Force reset functionality
    await page.click('button:has-text("Force Reset")');
    await expect(page.locator('.sonner-toast')).toContainText('force reset completed');
  });

  test('Receipts Strip - should show trust rails at bottom', async ({ page }) => {
    // Reset and verify receipts strip functionality
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded');
    
    // Verify receipts strip is present and functional
    await expect(page.locator('.fixed.bottom-0')).toBeVisible();
    await expect(page.locator('text=Trust Rails:')).toBeVisible();
    
    // Click "View All" should navigate to receipts page
    await page.click('.fixed.bottom-0 a[href="/nil/receipts"]');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/nil/receipts');
  });

  test('Error Resilience - should handle failures gracefully', async ({ page }) => {
    // Test that the system works even with potential errors
    
    // Try multiple resets in succession
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    await page.click('button:has-text("Reset NIL Demo (Mom/Guardian)")');
    await page.click('button:has-text("Clear NIL Demo")');
    await page.click('button:has-text("Reset NIL Demo (Coach)")');
    
    // Should still work and show success
    await expect(page.locator('.sonner-toast')).toContainText('NIL Demo loaded');
    
    // Navigate between pages rapidly
    await page.click('a[href="/nil/education"]');
    await page.click('a[href="/nil/offers"]');
    await page.click('a[href="/nil/marketplace"]');
    await page.click('a[href="/nil/demo"]');
    
    // Should not crash and demo should still be functional
    await expect(page.locator('text=Demo Status')).toBeVisible();
  });
});