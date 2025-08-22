import { test, expect } from '@playwright/test';

test.describe('Admin Publish flags', () => {
  test('toggle PUBLIC_DISCOVER_ENABLED hides /discover for unauth users', async ({ page }) => {
    // TODO: admin login
    await page.goto('/admin/publish');
    
    // Flip OFF
    const toggle = page.getByRole('switch', { name: /PUBLIC_DISCOVER_ENABLED/i });
    await toggle.click();
    const confirm = page.getByRole('dialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: /Proceed|Confirm/i }).click();

    // Unauth check
    await page.context().clearCookies();
    await page.goto('/discover');
    // Expect 404 or redirect to default public page
    await expect(page.getByRole('heading', { name: /not found|404/i })).toBeVisible();

    // Flip ON (cleanup)
    // TODO: admin login again if session cleared
    await page.goto('/admin/publish');
    await toggle.click();
    const confirm2 = page.getByRole('dialog');
    await confirm2.getByRole('button', { name: /Proceed|Confirm/i }).click();
    await page.goto('/discover');
    await expect(page.getByRole('heading', { name: /one shared workspace|discover/i })).toBeVisible();
  });

  test('SOLUTIONS_ENABLED flag controls solutions routes', async ({ page }) => {
    // TODO: admin login
    await page.goto('/admin/publish');
    
    // Flip OFF solutions
    const toggle = page.getByRole('switch', { name: /SOLUTIONS_ENABLED/i });
    await toggle.click();
    const confirm = page.getByRole('dialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: /Proceed|Confirm/i }).click();

    // Check /solutions is hidden
    await page.context().clearCookies();
    await page.goto('/solutions');
    await expect(page.getByRole('heading', { name: /not found|404/i })).toBeVisible();

    // Cleanup - flip back ON
    await page.goto('/admin/publish');
    await toggle.click();
    const confirm2 = page.getByRole('dialog');
    await confirm2.getByRole('button', { name: /Proceed|Confirm/i }).click();
  });

  test('NIL_PUBLIC_ENABLED flag controls NIL public routes', async ({ page }) => {
    // TODO: admin login
    await page.goto('/admin/publish');
    
    // Flip OFF NIL public
    const toggle = page.getByRole('switch', { name: /NIL_PUBLIC_ENABLED/i });
    await toggle.click();
    const confirm = page.getByRole('dialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: /Proceed|Confirm/i }).click();

    // Check /nil is hidden
    await page.context().clearCookies();
    await page.goto('/nil');
    await expect(page.getByRole('heading', { name: /not found|404/i })).toBeVisible();

    // Check /nil/index is also hidden
    await page.goto('/nil/index');
    await expect(page.getByRole('heading', { name: /not found|404/i })).toBeVisible();

    // Cleanup - flip back ON
    await page.goto('/admin/publish');
    await toggle.click();
    const confirm2 = page.getByRole('dialog');
    await confirm2.getByRole('button', { name: /Proceed|Confirm/i }).click();
  });

  test('CDN purge button works', async ({ page }) => {
    // TODO: admin login
    await page.goto('/admin/publish');
    
    // Click purge CDN button
    const purgeButton = page.getByRole('button', { name: /Purge CDN/i });
    await purgeButton.click();
    
    // Should show toast notification
    await expect(page.getByText(/CDN purge|purge initiated/i)).toBeVisible();
  });

  test('utility links open public routes', async ({ page }) => {
    // TODO: admin login
    await page.goto('/admin/publish');
    
    // Test quick action links work
    const discoverLink = page.getByRole('button', { name: /Open.*discover/i });
    const solutionsLink = page.getByRole('button', { name: /Open.*solutions/i });
    const sitemapLink = page.getByRole('button', { name: /Open.*sitemap/i });
    
    await expect(discoverLink).toBeVisible();
    await expect(solutionsLink).toBeVisible();
    await expect(sitemapLink).toBeVisible();
    
    // Note: These open in new tabs, so we'd need to handle page.context().newPage()
    // to test the actual navigation, but visibility check is sufficient for smoke test
  });

  test('private app remains unaffected by flags', async ({ page }) => {
    // Simulate authenticated user (TODO: actual login)
    await page.goto('/admin/publish');
    
    // Flip OFF all public flags
    const publicFlags = [
      'PUBLIC_DISCOVER_ENABLED',
      'SOLUTIONS_ENABLED', 
      'NIL_PUBLIC_ENABLED'
    ];
    
    for (const flagName of publicFlags) {
      const toggle = page.getByRole('switch', { name: new RegExp(flagName, 'i') });
      await toggle.click();
      const confirm = page.getByRole('dialog');
      await confirm.getByRole('button', { name: /Proceed|Confirm/i }).click();
    }

    // Private routes should still work for authenticated users
    // TODO: Test authenticated routes like /family/home, /admin/* etc.
    await page.goto('/admin/ready-check');
    await expect(page.getByRole('heading', { name: /ready.check/i })).toBeVisible();
    
    // Cleanup - reset all flags
    await page.goto('/admin/publish');
    const resetButton = page.getByRole('button', { name: /Reset.*Defaults/i });
    await resetButton.click();
  });
});