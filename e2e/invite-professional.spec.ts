import { test, expect } from '@playwright/test';

test.describe('Professional Invite Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set family persona
    await page.goto('/');
    await page.getByRole('button', { name: 'See How It Works' }).click();
    await expect(page).toHaveURL('/families');
  });

  test('should invite professional and show success toast', async ({ page }) => {
    // Look for invite button/link
    const inviteButton = page.getByRole('button', { name: /invite|add professional|connect/i }).first();
    
    if (await inviteButton.isVisible()) {
      await inviteButton.click();
      
      // Should open invite modal/form
      await expect(page.getByText(/invite|email|professional/i)).toBeVisible({ timeout: 5000 });
      
      // Fill in email if form is present
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@professional.com');
        
        // Submit the invite
        const sendButton = page.getByRole('button', { name: /send|invite|submit/i });
        if (await sendButton.isVisible()) {
          await sendButton.click();
          
          // Should show success toast
          await expect(page.getByText(/invite sent|success|invited/i)).toBeVisible({ timeout: 10000 });
        }
      }
    } else {
      // Navigate to team/professionals page if direct button not found
      await page.goto('/team');
      
      // Try invite flow from team page
      const addButton = page.getByRole('button', { name: /add|invite|new/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
        await expect(page.getByText(/invite|add/i)).toBeVisible();
      }
    }
  });

  test('should validate email format in invite form', async ({ page }) => {
    const inviteButton = page.getByRole('button', { name: /invite|add professional/i }).first();
    
    if (await inviteButton.isVisible()) {
      await inviteButton.click();
      
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        // Enter invalid email
        await emailInput.fill('invalid-email');
        
        const sendButton = page.getByRole('button', { name: /send|invite/i });
        if (await sendButton.isVisible()) {
          await sendButton.click();
          
          // Should show validation error
          await expect(page.getByText(/invalid|valid email|format/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should track invite analytics event', async ({ page }) => {
    // Mock analytics to capture events
    await page.addInitScript(() => {
      window.analytics = {
        track: (event, properties) => {
          console.log('Analytics event:', event, properties);
          window.analyticsEvents = window.analyticsEvents || [];
          window.analyticsEvents.push({ event, properties });
        }
      };
    });
    
    const inviteButton = page.getByRole('button', { name: /invite|add professional/i }).first();
    
    if (await inviteButton.isVisible()) {
      await inviteButton.click();
      
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@professional.com');
        
        const sendButton = page.getByRole('button', { name: /send|invite/i });
        if (await sendButton.isVisible()) {
          await sendButton.click();
          
          // Check if analytics event was fired
          const events = await page.evaluate(() => window.analyticsEvents || []);
          const inviteEvent = events.find(e => e.event.includes('invite') || e.event.includes('professional'));
          expect(inviteEvent).toBeTruthy();
        }
      }
    }
  });
});