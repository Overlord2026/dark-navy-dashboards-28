import { test, expect } from '@playwright/test';

// Sample test data
const sampleZocksJson = {
  meetingId: "e2e-zocks-test",
  startedAt: "2024-01-15T10:00:00Z",
  participants: [
    { name: "E2E Test Advisor", role: "advisor" },
    { name: "E2E Test Client", role: "client" }
  ],
  transcript: [
    { ts: 1642248000, speaker: "E2E Test Advisor", text: "Welcome to our financial planning meeting for end-to-end testing." },
    { ts: 1642248030, speaker: "E2E Test Client", text: "Thank you. I'm interested in discussing my retirement planning and risk management strategies." },
    { ts: 1642248060, speaker: "E2E Test Advisor", text: "Let's review your current portfolio and identify action items for optimization." },
    { ts: 1642248090, speaker: "E2E Test Client", text: "I need to follow up on the insurance policy recommendations we discussed." },
    { ts: 1642248120, speaker: "E2E Test Advisor", text: "There's a potential risk with market volatility that we should address immediately." }
  ],
  meta: { platform: "zocks", version: "1.2", test: true }
};

const sampleJumpJson = {
  callId: "e2e-jump-test",
  startedAt: "2024-01-15T14:30:00Z",
  speakers: ["E2E Test Advisor", "E2E Test Client", "E2E Test Observer"],
  summary: "End-to-end test meeting covering comprehensive financial planning strategies, risk assessment protocols, and actionable next steps for portfolio management.",
  bullets: [
    "Reviewed current market conditions and their impact on the test portfolio",
    "Analyzed risk tolerance levels and investment objectives for testing",
    "Discussed diversification strategies for the upcoming test period",
    "Evaluated insurance coverage gaps and protection needs"
  ],
  nextSteps: [
    "Schedule follow-up meeting with tax advisor for testing",
    "Review and update beneficiary information in test environment",
    "Research ESG investment options for test portfolio"
  ],
  risks: [
    "Market volatility concerns in current test scenario",
    "Potential tax implications of test portfolio rebalancing",
    "Insurance coverage gap identified during testing"
  ],
  meta: { platform: "jump", version: "2.1", test: true }
};

test.describe('Meeting Import E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to advisors meetings page
    await page.goto('/advisors/meetings');
    await page.waitForLoadState('networkidle');
  });

  test('should import Zocks JSON file successfully', async ({ page }) => {
    // Click Import Meeting button
    await page.click('[data-testid="import-meeting-button"]');
    
    // Wait for modal to open
    await expect(page.locator('[data-testid="import-meeting-modal"]')).toBeVisible();
    
    // Select Zocks source
    await page.click('[data-testid="source-zocks"]');
    
    // Switch to Upload File tab
    await page.click('[data-testid="tab-upload-file"]');
    
    // Create a file and upload it
    const fileContent = JSON.stringify(sampleZocksJson);
    await page.setInputFiles('[data-testid="file-upload"]', {
      name: 'test-zocks-meeting.json',
      mimeType: 'application/json',
      buffer: Buffer.from(fileContent)
    });
    
    // Click Parse button
    await page.click('[data-testid="parse-button"]');
    
    // Wait for preview to appear
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible();
    
    // Verify preview content
    await expect(page.locator('[data-testid="preview-summary"]')).toContainText('financial planning');
    await expect(page.locator('[data-testid="preview-bullets"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-actions"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-risks"]')).toBeVisible();
    
    // Confirm import
    await page.click('[data-testid="confirm-import-button"]');
    
    // Wait for success toast
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
    
    // Verify we're redirected to meetings page
    await expect(page).toHaveURL('/advisors/meetings');
    
    // Verify the imported meeting appears in the list
    await expect(page.locator('[data-testid="meeting-row"]').first()).toBeVisible();
  });

  test('should import Jump JSON via paste successfully', async ({ page }) => {
    // Click Import Meeting button
    await page.click('[data-testid="import-meeting-button"]');
    
    // Select Jump source
    await page.click('[data-testid="source-jump"]');
    
    // Switch to Paste JSON tab
    await page.click('[data-testid="tab-paste-json"]');
    
    // Paste JSON content
    await page.fill('[data-testid="json-textarea"]', JSON.stringify(sampleJumpJson, null, 2));
    
    // Click Parse button
    await page.click('[data-testid="parse-button"]');
    
    // Wait for preview
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible();
    
    // Verify preview shows Jump-specific content
    await expect(page.locator('[data-testid="preview-summary"]')).toContainText('End-to-end test meeting');
    await expect(page.locator('[data-testid="preview-speakers"]')).toContainText('E2E Test Advisor');
    
    // Check bullets count
    const bullets = await page.locator('[data-testid="preview-bullets"] li').count();
    expect(bullets).toBeGreaterThan(2);
    
    // Confirm import
    await page.click('[data-testid="confirm-import-button"]');
    
    // Wait for success
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
  });

  test('should import plain text successfully', async ({ page }) => {
    const plainText = `Meeting Summary: Financial Planning Review

Discussion Points:
• Reviewed investment portfolio performance
• Discussed retirement planning strategies  
• Analyzed risk management options

Action Items:
- Schedule quarterly portfolio review
- Update estate planning documents
- Research tax optimization strategies

Risks Identified:
⚠ Market volatility concerns
⚠ Inflation impact on fixed income

Participants: Test Advisor, Test Client`;

    // Click Import Meeting button
    await page.click('[data-testid="import-meeting-button"]');
    
    // Select Plain source
    await page.click('[data-testid="source-plain"]');
    
    // Use Paste Text tab (should be default for plain)
    await page.fill('[data-testid="text-textarea"]', plainText);
    
    // Click Parse button
    await page.click('[data-testid="parse-button"]');
    
    // Wait for preview
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible();
    
    // Verify plain text processing
    await expect(page.locator('[data-testid="preview-summary"]')).toContainText('Financial Planning');
    
    // Confirm import
    await page.click('[data-testid="confirm-import-button"]');
    
    // Wait for success
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
  });

  test('should show proof chip with anchor when ANCHOR_ON_IMPORT enabled', async ({ page }) => {
    // Enable ANCHOR_ON_IMPORT flag (assuming there's a way to toggle it in UI or via localStorage)
    await page.evaluate(() => {
      localStorage.setItem('feature_flags', JSON.stringify({ ANCHOR_ON_IMPORT: true }));
    });
    
    // Refresh to apply flag
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Import a meeting (using paste JSON for speed)
    await page.click('[data-testid="import-meeting-button"]');
    await page.click('[data-testid="source-zocks"]');
    await page.click('[data-testid="tab-paste-json"]');
    await page.fill('[data-testid="json-textarea"]', JSON.stringify(sampleZocksJson));
    await page.click('[data-testid="parse-button"]');
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible();
    await page.click('[data-testid="confirm-import-button"]');
    
    // Wait for import to complete
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
    
    // Check for proof chip with "Included ✓"
    await expect(page.locator('[data-testid="proof-chip"]').first()).toContainText('Included ✓');
  });

  test('should validate no PII in network requests', async ({ page }) => {
    const networkRequests: any[] = [];
    
    // Monitor network requests
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('supabase')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
      }
    });
    
    // Import a meeting
    await page.click('[data-testid="import-meeting-button"]');
    await page.click('[data-testid="source-zocks"]');
    await page.click('[data-testid="tab-paste-json"]');
    await page.fill('[data-testid="json-textarea"]', JSON.stringify(sampleZocksJson));
    await page.click('[data-testid="parse-button"]');
    await page.click('[data-testid="confirm-import-button"]');
    
    // Wait for completion
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
    
    // Verify no raw transcript in any network request
    for (const request of networkRequests) {
      if (request.postData) {
        // Check that transcript text doesn't appear in any request
        expect(request.postData).not.toContain('Welcome to our financial planning meeting');
        expect(request.postData).not.toContain('E2E Test Advisor');
        
        // Verify only hashes and vault references are sent
        if (request.postData.includes('receipt') || request.postData.includes('vault')) {
          expect(request.postData).toMatch(/sha256:/);
        }
      }
    }
  });

  test('should navigate to admin audits and show pass status', async ({ page }) => {
    // First import a meeting to have data
    await page.click('[data-testid="import-meeting-button"]');
    await page.click('[data-testid="source-jump"]');
    await page.click('[data-testid="tab-paste-json"]');
    await page.fill('[data-testid="json-textarea"]', JSON.stringify(sampleJumpJson));
    await page.click('[data-testid="parse-button"]');
    await page.click('[data-testid="confirm-import-button"]');
    await expect(page.locator('.sonner-toast')).toContainText('Imported and proofed');
    
    // Navigate to admin audits
    await page.goto('/admin/audits');
    await page.waitForLoadState('networkidle');
    
    // Check for audit results
    await expect(page.locator('[data-testid="audit-results"]')).toBeVisible();
    
    // Look for pass indicators in shape checks
    const auditRows = page.locator('[data-testid="audit-row"]');
    const count = await auditRows.count();
    
    if (count > 0) {
      // Check that at least some audits show "pass" status
      const passCount = await page.locator('[data-testid="audit-status"]:has-text("pass")').count();
      expect(passCount).toBeGreaterThan(0);
    }
  });

  test('should handle file upload errors gracefully', async ({ page }) => {
    // Click Import Meeting button
    await page.click('[data-testid="import-meeting-button"]');
    
    // Select Zocks source and upload file tab
    await page.click('[data-testid="source-zocks"]');
    await page.click('[data-testid="tab-upload-file"]');
    
    // Upload an invalid file
    await page.setInputFiles('[data-testid="file-upload"]', {
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not valid JSON content {}}}')
    });
    
    // Click Parse button
    await page.click('[data-testid="parse-button"]');
    
    // Should still show preview (fallback to plain text parsing)
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible();
    
    // Should not throw error but handle gracefully
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('should toggle between different source types', async ({ page }) => {
    // Click Import Meeting button
    await page.click('[data-testid="import-meeting-button"]');
    
    // Test source switching
    await page.click('[data-testid="source-zocks"]');
    await expect(page.locator('[data-testid="source-zocks"]')).toBeChecked();
    
    await page.click('[data-testid="source-jump"]');
    await expect(page.locator('[data-testid="source-jump"]')).toBeChecked();
    
    await page.click('[data-testid="source-plain"]');
    await expect(page.locator('[data-testid="source-plain"]')).toBeChecked();
    
    // Test tab switching
    await page.click('[data-testid="tab-paste-text"]');
    await expect(page.locator('[data-testid="text-textarea"]')).toBeVisible();
    
    await page.click('[data-testid="tab-upload-file"]');
    await expect(page.locator('[data-testid="file-upload"]')).toBeVisible();
    
    await page.click('[data-testid="tab-paste-json"]');
    await expect(page.locator('[data-testid="json-textarea"]')).toBeVisible();
  });
});