/**
 * Accessibility utilities for improved user experience
 */

/**
 * Announces content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export function focusElement(selector: string | HTMLElement) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (element && element instanceof HTMLElement) {
    element.focus()
    return true
  }
  return false
}

/**
 * Skip to main content functionality
 */
export function skipToMainContent() {
  const mainContent = document.querySelector('main, [role="main"], #main-content')
  if (mainContent instanceof HTMLElement) {
    mainContent.focus()
    mainContent.scrollIntoView()
    announceToScreenReader('Skipped to main content')
  }
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ]
  
  return focusableSelectors.some(selector => element.matches(selector))
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')
  
  return Array.from(container.querySelectorAll(focusableSelectors))
}

/**
 * Trap focus within a container (useful for modals)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }
  
  container.addEventListener('keydown', handleTabKey)
  
  // Focus first element
  firstElement?.focus()
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Check color contrast ratio (simplified version)
 */
export function hasGoodContrast(foreground: string, background: string): boolean {
  // This is a simplified check - in production, use a proper color contrast library
  // For now, we'll just check if colors are different enough
  return foreground !== background
}

/**
 * Generate unique ID for form fields
 */
export function generateUniqueId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = []
  
  // Check for aria-label on buttons without text
  if (element.tagName === 'BUTTON' && !element.textContent?.trim() && !element.getAttribute('aria-label')) {
    issues.push('Button missing accessible name')
  }
  
  // Check for aria-describedby pointing to existing elements
  const describedBy = element.getAttribute('aria-describedby')
  if (describedBy) {
    const ids = describedBy.split(' ')
    ids.forEach(id => {
      if (!document.getElementById(id)) {
        issues.push(`aria-describedby references non-existent element: ${id}`)
      }
    })
  }
  
  return issues
}

/**
 * Check if page has proper heading structure
 */
export function validateHeadingStructure(): string[] {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const issues: string[] = []
  
  // Check for h1
  const h1Count = headings.filter(h => h.tagName === 'H1').length
  if (h1Count === 0) {
    issues.push('Page missing h1 heading')
  } else if (h1Count > 1) {
    issues.push('Page has multiple h1 headings')
  }
  
  // Check heading hierarchy
  let previousLevel = 0
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1))
    if (level > previousLevel + 1) {
      issues.push(`Heading hierarchy skip detected: ${heading.tagName} after h${previousLevel}`)
    }
    previousLevel = level
  })
  
  return issues
}