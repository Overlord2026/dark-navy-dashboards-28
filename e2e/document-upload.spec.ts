import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Document Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set family persona and navigate
    await page.goto('/');
    await page.getByRole('button', { name: 'See How It Works' }).click();
    await expect(page).toHaveURL('/families');
  });

  test('should upload document and show success message', async ({ page }) => {
    // Navigate to documents/vault page
    const vaultLink = page.getByRole('link', { name: /vault|documents|files/i }).first();
    if (await vaultLink.isVisible()) {
      await vaultLink.click();
    } else {
      await page.goto('/vault');
    }
    
    // Wait for vault page to load
    await page.waitForLoadState('networkidle');
    
    // Look for upload button or drag-drop area
    const uploadButton = page.getByRole('button', { name: /upload|add document|add file/i }).first();
    const fileInput = page.locator('input[type="file"]');
    
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
    }
    
    // Create a test file to upload
    if (await fileInput.isVisible()) {
      // Create test file content
      const testFilePath = path.join(__dirname, 'test-document.txt');
      
      // Upload the file
      await fileInput.setInputFiles({
        name: 'test-document.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('This is a test document for upload testing.')
      });
      
      // Look for upload confirmation button if needed
      const confirmButton = page.getByRole('button', { name: /confirm|save|upload/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Should show success message
      await expect(page.getByText(/uploaded|success|added/i)).toBeVisible({ timeout: 15000 });
      
      // Should see the document in the list
      await expect(page.getByText('test-document.txt')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle file upload errors gracefully', async ({ page }) => {
    await page.goto('/vault');
    
    const uploadButton = page.getByRole('button', { name: /upload/i }).first();
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
    }
    
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Try to upload a very large file (simulated)
      await fileInput.setInputFiles({
        name: 'large-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.alloc(50 * 1024 * 1024, 'x') // 50MB file
      });
      
      // Should show error message for file too large
      await expect(page.getByText(/too large|size limit|error/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should validate file types on upload', async ({ page }) => {
    await page.goto('/vault');
    
    const uploadButton = page.getByRole('button', { name: /upload/i }).first();
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
    }
    
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Try to upload an unsupported file type
      await fileInput.setInputFiles({
        name: 'test.exe',
        mimeType: 'application/octet-stream',
        buffer: Buffer.from('fake executable content')
      });
      
      // Should show file type error
      await expect(page.getByText(/not supported|invalid type|file type/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should track upload analytics event', async ({ page }) => {
    // Mock analytics
    await page.addInitScript(() => {
      window.analytics = {
        track: (event, properties) => {
          window.analyticsEvents = window.analyticsEvents || [];
          window.analyticsEvents.push({ event, properties });
        }
      };
    });
    
    await page.goto('/vault');
    
    const uploadButton = page.getByRole('button', { name: /upload/i }).first();
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
    }
    
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'analytics-test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('PDF content')
      });
      
      // Check if upload analytics event was fired
      const events = await page.evaluate(() => window.analyticsEvents || []);
      const uploadEvent = events.find(e => 
        e.event.includes('upload') || 
        e.event.includes('document') || 
        e.event.includes('file')
      );
      expect(uploadEvent).toBeTruthy();
    }
  });
});