import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Install axe-core
    await page.addInitScript({
      path: require.resolve('axe-core/axe.min.js')
    })
  })

  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Calculator', url: '/calculator' },
    { name: 'Dashboard', url: '/dashboard' },
  ]

  for (const { name, url } of pages) {
    test(`${name} should pass accessibility tests`, async ({ page }) => {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      const results = await page.evaluate(() => {
        return (window as any).axe.run({
          rules: {
            'color-contrast': { enabled: true },
            'image-alt': { enabled: true },
            'label': { enabled: true },
            'link-name': { enabled: true },
            'button-name': { enabled: true },
            'document-title': { enabled: true },
            'html-has-lang': { enabled: true },
            'html-lang-valid': { enabled: true },
            'landmark-one-main': { enabled: true },
            'region': { enabled: true },
            'skip-link': { enabled: true },
            'focus-order-semantics': { enabled: true },
          }
        })
      })

      // Log violations for debugging
      if (results.violations.length > 0) {
        console.log(`Accessibility violations found on ${name}:`)
        results.violations.forEach((violation: any) => {
          console.log(`- ${violation.id}: ${violation.description}`)
          violation.nodes.forEach((node: any) => {
            console.log(`  Element: ${node.target}`)
            console.log(`  Impact: ${node.impact}`)
          })
        })
      }

      expect(results.violations).toHaveLength(0)
    })
  }

  test('Keyboard navigation should work on all interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Test tab navigation
    let tabCount = 0
    const maxTabs = 20 // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement
        return el ? {
          tagName: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          text: el.textContent?.slice(0, 50)
        } : null
      })

      if (focusedElement) {
        // Verify focused element is visible and interactive
        const element = page.locator(':focus')
        await expect(element).toBeVisible()
        
        // Check if it's a button or link
        if (focusedElement.tagName === 'BUTTON' || focusedElement.tagName === 'A') {
          // Test Enter key activation
          const elementText = await element.textContent()
          if (elementText && !elementText.includes('Skip to content')) {
            // Only test activation on safe elements
            if (elementText.includes('Learn More') || elementText.includes('View')) {
              await page.keyboard.press('Enter')
              await page.waitForTimeout(1000) // Wait for any navigation
              break // Exit after first activation to prevent navigation issues
            }
          }
        }
      }
    }
  })

  test('Screen reader landmarks and headings should be properly structured', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName)
        const text = await heading.textContent()
        return { level: parseInt(tagName.charAt(1)), text: text?.slice(0, 50) }
      })
    )

    // Should have at least one h1
    const h1Count = headingLevels.filter(h => h.level === 1).length
    expect(h1Count).toBeGreaterThanOrEqual(1)
    expect(h1Count).toBeLessThanOrEqual(1) // Should have exactly one h1

    // Check for proper landmark roles
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').all()
    expect(landmarks.length).toBeGreaterThan(0)

    // Verify main content area exists
    const mainContent = page.locator('main, [role="main"]')
    await expect(mainContent).toBeVisible()
  })

  test('Form validation and error messages should be accessible', async ({ page }) => {
    await page.goto('/calculator')
    await page.waitForLoadState('networkidle')

    // Try to submit form without filling required fields
    const submitButton = page.getByRole('button', { name: /calculate|submit/i }).first()
    if (await submitButton.isVisible()) {
      await submitButton.click()

      // Check for accessible error messages
      const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]')
      const errorCount = await errorMessages.count()
      
      if (errorCount > 0) {
        // Verify error messages are properly associated with form fields
        for (let i = 0; i < errorCount; i++) {
          const error = errorMessages.nth(i)
          await expect(error).toBeVisible()
          
          // Check if error has proper ARIA attributes
          const ariaLive = await error.getAttribute('aria-live')
          const role = await error.getAttribute('role')
          
          expect(ariaLive || role).toBeTruthy()
        }
      }
    }
  })

  test('Color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const contrastResults = await page.evaluate(() => {
      return (window as any).axe.run({
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })

    if (contrastResults.violations.length > 0) {
      console.log('Color contrast violations:')
      contrastResults.violations.forEach((violation: any) => {
        console.log(`- ${violation.description}`)
        violation.nodes.forEach((node: any) => {
          console.log(`  Element: ${node.target}`)
          console.log(`  Expected: ${node.any[0]?.data?.expectedContrastRatio}`)
          console.log(`  Actual: ${node.any[0]?.data?.contrastRatio}`)
        })
      })
    }

    expect(contrastResults.violations).toHaveLength(0)
  })
})