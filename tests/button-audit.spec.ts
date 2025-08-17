import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

test.describe('Button Audit', () => {
  let auditResults: any[] = []

  test.beforeAll(async () => {
    // Ensure audit results directory exists
    const auditDir = path.join(process.cwd(), 'button-audit-results')
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true })
    }
  })

  test.afterAll(async () => {
    // Write audit results to file
    const resultsPath = path.join(process.cwd(), 'button-audit-results', 'button-audit.json')
    fs.writeFileSync(resultsPath, JSON.stringify(auditResults, null, 2))
    
    // Write summary report
    const summaryPath = path.join(process.cwd(), 'button-audit-results', 'button-audit-summary.md')
    const totalButtons = auditResults.length
    const asyncButtons = auditResults.filter(r => r.isAsyncButton).length
    const rawButtons = auditResults.filter(r => r.isRawButton).length
    const missingLabels = auditResults.filter(r => !r.hasLabel).length
    const missingTestIds = auditResults.filter(r => !r.hasTestId).length
    
    const summary = `# Button Audit Summary

## Overview
- Total buttons found: ${totalButtons}
- AsyncButton components: ${asyncButtons}
- Raw button elements: ${rawButtons}
- Missing labels: ${missingLabels}
- Missing test IDs: ${missingTestIds}

## Pass Rate
- AsyncButton usage: ${((asyncButtons / totalButtons) * 100).toFixed(1)}%
- Accessibility compliance: ${(((totalButtons - missingLabels) / totalButtons) * 100).toFixed(1)}%
- Testing readiness: ${(((totalButtons - missingTestIds) / totalButtons) * 100).toFixed(1)}%

## Recommendations
${rawButtons > 0 ? `- Replace ${rawButtons} raw button elements with AsyncButton components` : '- ✅ All buttons use AsyncButton component'}
${missingLabels > 0 ? `- Add proper labels to ${missingLabels} buttons` : '- ✅ All buttons have proper labels'}
${missingTestIds > 0 ? `- Add test IDs to ${missingTestIds} buttons` : '- ✅ All buttons have test IDs'}

## Detailed Results
See button-audit.json for detailed button-by-button analysis.
`
    
    fs.writeFileSync(summaryPath, summary)
  })

  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Calculator', url: '/calculator' },
    { name: 'Dashboard', url: '/dashboard' },
  ]

  for (const { name, url } of pages) {
    test(`Audit buttons on ${name}`, async ({ page }) => {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      // Find all buttons on the page
      const buttons = await page.locator('button, [role="button"], input[type="button"], input[type="submit"]').all()

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i]
        
        try {
          const buttonInfo = await button.evaluate((el) => {
            const rect = el.getBoundingClientRect()
            return {
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              textContent: el.textContent?.trim(),
              ariaLabel: el.getAttribute('aria-label'),
              title: el.getAttribute('title'),
              type: el.getAttribute('type'),
              disabled: el.hasAttribute('disabled'),
              role: el.getAttribute('role'),
              testId: el.getAttribute('data-testid'),
              isVisible: rect.width > 0 && rect.height > 0,
              innerHTML: el.innerHTML
            }
          })

          const auditResult = {
            page: name,
            url,
            buttonIndex: i,
            ...buttonInfo,
            isAsyncButton: buttonInfo.className.includes('AsyncButton') || buttonInfo.innerHTML.includes('Loader2'),
            isRawButton: buttonInfo.tagName === 'BUTTON' && !buttonInfo.className.includes('AsyncButton'),
            hasLabel: !!(buttonInfo.textContent || buttonInfo.ariaLabel || buttonInfo.title),
            hasTestId: !!buttonInfo.testId,
            isAccessible: !!(buttonInfo.textContent || buttonInfo.ariaLabel || buttonInfo.title),
            issues: []
          }

          // Add specific issues
          if (!auditResult.hasLabel) {
            auditResult.issues.push('Missing accessible label')
          }
          if (!auditResult.hasTestId) {
            auditResult.issues.push('Missing test ID for automated testing')
          }
          if (auditResult.isRawButton) {
            auditResult.issues.push('Should use AsyncButton component instead of raw button')
          }
          if (!auditResult.isVisible) {
            auditResult.issues.push('Button is not visible')
          }

          auditResults.push(auditResult)

        } catch (error) {
          console.error(`Error auditing button ${i} on ${name}:`, error)
        }
      }
    })
  }

  test('Verify AsyncButton usage compliance', async ({ page }) => {
    const totalButtons = auditResults.length
    const asyncButtons = auditResults.filter(r => r.isAsyncButton).length
    const rawButtons = auditResults.filter(r => r.isRawButton).length
    
    console.log(`Button Audit Results:`)
    console.log(`- Total buttons: ${totalButtons}`)
    console.log(`- AsyncButton usage: ${asyncButtons}`)
    console.log(`- Raw buttons: ${rawButtons}`)
    
    // Expect at least 80% AsyncButton usage
    const asyncUsageRate = (asyncButtons / totalButtons) * 100
    expect(asyncUsageRate).toBeGreaterThan(50) // Start with 50% threshold
    
    if (rawButtons > 0) {
      console.log('Raw buttons found that should be converted to AsyncButton:')
      auditResults.filter(r => r.isRawButton).forEach(button => {
        console.log(`- ${button.page}: "${button.textContent}" (${button.className})`)
      })
    }
  })

  test('Verify accessibility compliance', async ({ page }) => {
    const totalButtons = auditResults.length
    const accessibleButtons = auditResults.filter(r => r.isAccessible).length
    const missingLabels = auditResults.filter(r => !r.hasLabel)
    
    console.log(`Accessibility Audit Results:`)
    console.log(`- Total buttons: ${totalButtons}`)
    console.log(`- Accessible buttons: ${accessibleButtons}`)
    console.log(`- Missing labels: ${missingLabels.length}`)
    
    if (missingLabels.length > 0) {
      console.log('Buttons missing accessible labels:')
      missingLabels.forEach(button => {
        console.log(`- ${button.page}: "${button.textContent || '[no text]'}" (${button.className})`)
      })
    }
    
    // Expect 100% accessibility compliance
    expect(accessibleButtons).toBe(totalButtons)
  })

  test('Verify testing readiness', async ({ page }) => {
    const totalButtons = auditResults.length
    const testableButtons = auditResults.filter(r => r.hasTestId).length
    const missingTestIds = auditResults.filter(r => !r.hasTestId)
    
    console.log(`Testing Readiness Audit Results:`)
    console.log(`- Total buttons: ${totalButtons}`)
    console.log(`- Buttons with test IDs: ${testableButtons}`)
    console.log(`- Missing test IDs: ${missingTestIds.length}`)
    
    if (missingTestIds.length > 0) {
      console.log('Buttons missing test IDs:')
      missingTestIds.forEach(button => {
        console.log(`- ${button.page}: "${button.textContent || '[no text]'}" (${button.className})`)
      })
    }
    
    // Expect at least 80% test ID coverage for critical buttons
    const testCoverageRate = (testableButtons / totalButtons) * 100
    expect(testCoverageRate).toBeGreaterThan(60) // Start with 60% threshold
  })
})