import { test, expect } from '@playwright/test';

test.describe('Persona Selection Flow', () => {
  test('should select family persona and render family hero', async ({ page }) => {
    // Navigate to the split hero landing page
    await page.goto('/');
    
    // Should see the split hero with both options
    await expect(page.getByRole('heading', { name: 'Choose Your Path' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'For Families' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'For Service Pros' })).toBeVisible();
    
    // Click on "See How It Works" for families
    await page.getByRole('button', { name: 'See How It Works' }).click();
    
    // Should redirect to families page
    await expect(page).toHaveURL('/families');
    
    // Should see family-specific content
    await expect(page.getByText('Your Private Family Office')).toBeVisible();
    
    // Verify persona was set in localStorage
    const personaGroup = await page.evaluate(() => localStorage.getItem('persona_group'));
    expect(personaGroup).toBe('family');
  });

  test('should select professional persona and render pros page', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Explore Tools" for professionals
    await page.getByRole('button', { name: 'Explore Tools' }).click();
    
    // Should redirect to pros page
    await expect(page).toHaveURL('/pros');
    
    // Verify persona was set
    const personaGroup = await page.evaluate(() => localStorage.getItem('persona_group'));
    expect(personaGroup).toBe('pro');
  });

  test('should persist persona selection across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Select family persona
    await page.getByRole('button', { name: 'See How It Works' }).click();
    await expect(page).toHaveURL('/families');
    
    // Reload the page
    await page.reload();
    
    // Should still be on families page
    await expect(page).toHaveURL('/families');
    
    // Navigate to root - should redirect back to families
    await page.goto('/');
    await expect(page).toHaveURL('/families');
  });
});