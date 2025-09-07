// Accessibility utilities for better user experience

/**
 * Announces a message to screen readers
 */
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Traps focus within a container (for modals/dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const closeButton = container.querySelector('[aria-label*="close" i], [data-close]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  container.addEventListener('keydown', handleEscapeKey);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
    container.removeEventListener('keydown', handleEscapeKey);
  };
}

/**
 * Ensures minimum touch target size (44px x 44px)
 */
export function ensureAccessibleTouchTargets() {
  const interactiveElements = document.querySelectorAll(
    'button, a, input[type="button"], input[type="submit"], [role="button"]'
  );
  
  interactiveElements.forEach((element) => {
    const el = element as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    if (rect.width < 44 || rect.height < 44) {
      el.style.minWidth = '44px';
      el.style.minHeight = '44px';
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
    }
  });
}

/**
 * Validates and improves alt text for images
 */
export function validateImageAltText() {
  const images = document.querySelectorAll('img');
  
  images.forEach((img) => {
    if (!img.alt || img.alt.trim() === '') {
      if (import.meta.env.DEV) {
        console.warn('Image missing alt text:', img.src);
      }
      // Add generic alt text for decorative images
      if (img.closest('[role="presentation"]') || img.className.includes('decorative')) {
        img.alt = '';
        img.setAttribute('role', 'presentation');
      } else {
        img.alt = 'Image'; // Minimal fallback
      }
    }
  });
}

/**
 * Checks color contrast ratios
 */
export function checkColorContrast() {
  // This would typically integrate with a contrast checking library
  // For now, we'll add a data attribute to flag elements for manual review
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button, a');
  
  textElements.forEach((element) => {
    const el = element as HTMLElement;
    const styles = window.getComputedStyle(el);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Flag elements that might have contrast issues
    if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      el.setAttribute('data-contrast-check', 'true');
    }
  });
}

/**
 * Initialize all accessibility checks
 */
export function initializeAccessibility() {
  // Run checks after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureAccessibleTouchTargets();
      validateImageAltText();
      checkColorContrast();
    });
  } else {
    ensureAccessibleTouchTargets();
    validateImageAltText();
    checkColorContrast();
  }
  
  // Re-run checks when content changes
  const observer = new MutationObserver(() => {
    ensureAccessibleTouchTargets();
    validateImageAltText();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}