import { useEffect, useRef } from 'react'
import { announceToScreenReader, trapFocus } from '@/utils/accessibility'

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const cleanup = trapFocus(containerRef.current)
    return cleanup
  }, [isActive])

  return containerRef
}

/**
 * Hook for announcing messages to screen readers
 */
export function useScreenReader() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }

  return { announce }
}

/**
 * Hook for managing page titles for screen readers
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    
    // Announce page change to screen readers
    announceToScreenReader(`Page changed to ${title}`)
    
    return () => {
      document.title = previousTitle
    }
  }, [title])
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  useEffect(() => {
    const handleSkipLink = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement?.getAttribute('href') === '#main-content') {
        e.preventDefault()
        const mainContent = document.querySelector('main, [role="main"], #main-content')
        if (mainContent instanceof HTMLElement) {
          mainContent.focus()
          mainContent.scrollIntoView()
        }
      }
    }

    document.addEventListener('keydown', handleSkipLink)
    return () => document.removeEventListener('keydown', handleSkipLink)
  }, [])
}

/**
 * Hook for managing reduced motion preferences
 */
export function useReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
    }
  }, [prefersReducedMotion])
  
  return prefersReducedMotion
}

/**
 * Hook for managing high contrast mode
 */
export function useHighContrast() {
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
  
  useEffect(() => {
    if (prefersHighContrast) {
      document.documentElement.classList.add('high-contrast')
    }
  }, [prefersHighContrast])
  
  return prefersHighContrast
}