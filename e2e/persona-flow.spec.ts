import { test, expect } from '@playwright/test'

test.describe('Persona Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
  })

  test('Complete persona flow: hero → calculator → invite professional → upload document', async ({ page }) => {
    // Step 1: Navigate from hero to calculator
    await test.step('Navigate to calculator from hero', async () => {
      // Look for calculator CTA on hero section
      const calculatorButton = page.getByRole('button', { name: /calculate|calculator|financial/i }).first()
      await expect(calculatorButton).toBeVisible()
      await calculatorButton.click()
      
      // Verify we're on calculator page or modal opened
      await expect(page.locator('[data-testid="calculator"]').or(page.getByText(/calculator/i))).toBeVisible()
    })

    // Step 2: Run calculator
    await test.step('Complete calculator flow', async () => {
      // Fill out calculator form
      const incomeInput = page.getByLabel(/income|annual income|salary/i).first()
      if (await incomeInput.isVisible()) {
        await incomeInput.fill('100000')
      }
      
      const ageInput = page.getByLabel(/age|current age/i).first()
      if (await ageInput.isVisible()) {
        await ageInput.fill('45')
      }
      
      // Click calculate button
      const calculateButton = page.getByRole('button', { name: /calculate|run calculation|compute/i }).first()
      await calculateButton.click()
      
      // Wait for results
      await expect(page.getByText(/result|recommendation|projection/i)).toBeVisible({ timeout: 10000 })
    })

    // Step 3: Invite professional
    await test.step('Invite professional', async () => {
      // Look for invite professional button
      const inviteButton = page.getByRole('button', { name: /invite|connect|professional|advisor/i }).first()
      await expect(inviteButton).toBeVisible()
      await inviteButton.click()
      
      // Fill out invitation form
      const emailInput = page.getByLabel(/email|professional email/i).first()
      await emailInput.fill('professional@example.com')
      
      const nameInput = page.getByLabel(/name|professional name/i).first()
      if (await nameInput.isVisible()) {
        await nameInput.fill('John Professional')
      }
      
      // Send invitation
      const sendButton = page.getByRole('button', { name: /send|invite|submit/i }).first()
      await sendButton.click()
      
      // Verify success message
      await expect(page.getByText(/invitation sent|invited successfully|email sent/i)).toBeVisible({ timeout: 10000 })
    })

    // Step 4: Upload document
    await test.step('Upload document', async () => {
      // Navigate to document upload area
      const uploadButton = page.getByRole('button', { name: /upload|document|file/i }).first()
      if (await uploadButton.isVisible()) {
        await uploadButton.click()
      }
      
      // Create a test file
      const fileContent = 'Test document content for E2E testing'
      const fileName = 'test-document.txt'
      
      // Upload file
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles({
        name: fileName,
        mimeType: 'text/plain',
        buffer: Buffer.from(fileContent),
      })
      
      // Confirm upload if needed
      const confirmButton = page.getByRole('button', { name: /upload|confirm|save/i }).first()
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }
      
      // Verify upload success
      await expect(page.getByText(/uploaded successfully|file uploaded|document saved/i).or(
        page.getByText(fileName)
      )).toBeVisible({ timeout: 15000 })
    })
  })

  test('Accessibility check on persona flow', async ({ page }) => {
    // Install axe-core
    await page.addInitScript({
      path: require.resolve('axe-core/axe.min.js')
    })

    await test.step('Check homepage accessibility', async () => {
      const results = await page.evaluate(() => {
        return (window as any).axe.run()
      })
      
      expect(results.violations).toHaveLength(0)
    })

    // Navigate through key pages and check accessibility
    const keyPages = ['/calculator', '/dashboard']
    
    for (const pagePath of keyPages) {
      await test.step(`Check accessibility for ${pagePath}`, async () => {
        await page.goto(pagePath, { waitUntil: 'networkidle' })
        
        const results = await page.evaluate(() => {
          return (window as any).axe.run()
        })
        
        expect(results.violations).toHaveLength(0)
      })
    }
  })

  test('Performance check on key pages', async ({ page }) => {
    const pages = ['/', '/calculator', '/dashboard']
    
    for (const pagePath of pages) {
      await test.step(`Performance check for ${pagePath}`, async () => {
        const startTime = Date.now()
        await page.goto(pagePath, { waitUntil: 'networkidle' })
        const loadTime = Date.now() - startTime
        
        // Check load time is under 5 seconds
        expect(loadTime).toBeLessThan(5000)
        
        // Check for layout shifts
        const cls = await page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              let clsValue = 0
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value
                }
              }
              resolve(clsValue)
            }).observe({ type: 'layout-shift', buffered: true })
            
            // Resolve after 3 seconds if no layout shifts
            setTimeout(() => resolve(0), 3000)
          })
        })
        
        // CLS should be less than 0.1
        expect(cls).toBeLessThan(0.1)
      })
    }
  })
})