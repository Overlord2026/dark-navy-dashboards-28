import { test, expect } from '@playwright/test';

test.describe('NIL Platform E2E Tests', () => {
  
  test('NIL Hub - Demo and Share Flow', async ({ page }) => {
    await page.goto('/nil');
    
    // Verify NIL hub loads
    await expect(page.getByText('Athlete as Hero')).toBeVisible();
    
    // Test demo launch
    const demoButton = page.getByText('See 60-sec demo').first();
    await expect(demoButton).toBeVisible();
    await demoButton.click();
    
    // Verify demo opened (assuming it navigates or opens modal)
    await page.waitForTimeout(1000);
    
    // Test share functionality
    const shareButton = page.getByRole('button', { name: /share/i }).first();
    if (await shareButton.isVisible()) {
      await shareButton.click();
    }
  });

  test('NIL Index - Filters and Profile Navigation', async ({ page }) => {
    await page.goto('/nil/index');
    
    // Verify index page loads
    await expect(page.getByText('Athlete Discovery')).toBeVisible();
    
    // Test filters
    const sportFilter = page.getByLabel('Sport');
    if (await sportFilter.isVisible()) {
      await sportFilter.click();
      await page.getByText('Basketball').click();
    }
    
    // Test athlete profile link
    const profileLink = page.getByText('View Profile').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      // Should navigate to athlete profile
    }
  });

  test('Athlete Dashboard - Quick Actions with ESC', async ({ page }) => {
    await page.goto('/nil/athlete/home');
    
    // Verify athlete dashboard loads
    await expect(page.getByText('Athlete Dashboard')).toBeVisible();
    
    // Test Training quick action
    const trainingCard = page.getByText('NIL Training').first();
    await expect(trainingCard).toBeVisible();
    await trainingCard.click();
    
    // Verify modal opened
    await expect(page.getByText('Training module completed')).toBeVisible();
    
    // Test ESC key to close modal
    await page.keyboard.press('Escape');
    await expect(page.getByText('Training module completed')).not.toBeVisible();
    
    // Test Disclosure action
    const disclosureCard = page.getByText('Disclosure Manager').first();
    await disclosureCard.click();
    await expect(page.getByText('Disclosure approved')).toBeVisible();
    await page.keyboard.press('Escape');
    
    // Test OfferLock action
    const offerLockCard = page.getByText('OfferLock™').first();
    await offerLockCard.click();
    await expect(page.getByText('Offer locked successfully')).toBeVisible();
    await page.keyboard.press('Escape');
    
    // Test Merch action (should be locked)
    const merchCard = page.getByText('Merch & Fan Offers').first();
    await merchCard.click();
    // Should not open modal due to locked status
  });

  test('Agent Dashboard - Pipeline State Changes and Disputes', async ({ page }) => {
    await page.goto('/nil/agent/home');
    
    // Verify agent dashboard loads
    await expect(page.getByText('Agent Dashboard')).toBeVisible();
    
    // Test pipeline stage advancement
    const advanceButton = page.getByText('Advance').first();
    if (await advanceButton.isVisible()) {
      await advanceButton.click();
    }
    
    // Test disputes section
    const disputesButton = page.getByText('Show Disputes');
    await disputesButton.click();
    
    // Verify disputes section shows
    await expect(page.getByText('Active Disputes & Delta Tracking')).toBeVisible();
    
    // Test dispute resolution
    const resolveButton = page.getByText('Resolve').first();
    if (await resolveButton.isVisible()) {
      await resolveButton.click();
    }
  });

  test('School Dashboard - Offer Approval and Audit Export', async ({ page }) => {
    await page.goto('/nil/school/home');
    
    // Verify school dashboard loads
    await expect(page.getByText('School NIL Dashboard')).toBeVisible();
    
    // Navigate to approvals tab
    await page.getByText('Pending Approvals').click();
    
    // Test offer approval
    const approveButton = page.getByText('Approve').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
    }
    
    // Test audit export
    const exportButton = page.getByText('Export Audit Pack');
    await expect(exportButton).toBeVisible();
    await exportButton.click();
  });

  test('Admin Anchors - Verification and Receipt Filtering', async ({ page }) => {
    await page.goto('/admin/nil/anchors');
    
    // Verify admin page loads
    await expect(page.getByText('NIL Admin: Anchors & Audits')).toBeVisible();
    
    // Test verification
    const verifyButton = page.getByText('Verify All');
    await verifyButton.click();
    await expect(page.getByText('Verifying...')).toBeVisible();
    
    // Wait for verification to complete
    await page.waitForTimeout(2000);
    
    // Navigate to proof slips tab
    await page.getByText('Proof Slips').click();
    
    // Test search/filter functionality
    const searchInput = page.getByPlaceholder('Search proof slips...');
    await searchInput.fill('training');
    
    // Verify search results update
    await page.waitForTimeout(500);
  });

  test('Accessibility - Focus Management and Keyboard Navigation', async ({ page }) => {
    await page.goto('/nil');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test focus rings are visible
    const focusedElement = page.locator(':focus');
    const boxShadow = await focusedElement.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    );
    expect(boxShadow).not.toBe('none');
    
    // Test minimum button sizes (44px touch targets)
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Performance - Page Load Times', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    await page.goto('/nil');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Test lazy loading behavior
    await page.goto('/nil/index');
    
    // Scroll to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(1000);
  });

  test('Analytics Events - Track User Actions', async ({ page }) => {
    // Listen for analytics events
    const analyticsEvents: any[] = [];
    
    page.on('console', msg => {
      if (msg.text().includes('NIL Analytics:')) {
        try {
          const eventData = JSON.parse(msg.text().replace('NIL Analytics: ', ''));
          analyticsEvents.push(eventData);
        } catch (e) {
          // Ignore parse errors
        }
      }
    });
    
    await page.goto('/nil/index');
    
    // Trigger index view event
    await page.waitForTimeout(1000);
    
    // Click invite button to trigger invite event
    const inviteButton = page.getByText('Invite').first();
    if (await inviteButton.isVisible()) {
      await inviteButton.click();
    }
    
    // Verify events were tracked
    await page.waitForTimeout(500);
    expect(analyticsEvents.length).toBeGreaterThan(0);
  });

  test('Mobile Responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/nil');
    
    // Verify responsive design
    await expect(page.getByText('Athlete as Hero')).toBeVisible();
    
    // Test mobile navigation
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.getByText('Athlete as Hero')).toBeVisible();
  });

  test('Error Handling and Fallbacks', async ({ page }) => {
    // Test 404 handling
    await page.goto('/nil/nonexistent-page');
    // Should show appropriate error or redirect
    
    // Test with network offline
    await page.context().setOffline(true);
    await page.goto('/nil');
    
    // Should handle offline gracefully
    await page.context().setOffline(false);
  });

});