// Skip to content link component for accessibility
import React, { useEffect } from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:no-underline"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
};

// Keyboard navigation helper
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Tab trap for modals
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
          closeButton?.click();
        }
      }

      // Arrow key navigation for lists
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const currentElement = document.activeElement;
        if (currentElement?.getAttribute('role') === 'option' || 
            currentElement?.closest('[role="listbox"]')) {
          event.preventDefault();
          const listbox = currentElement.closest('[role="listbox"]');
          const options = listbox?.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;
          
          if (options && options.length > 0) {
            const currentIndex = Array.from(options).indexOf(currentElement as HTMLElement);
            let nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
            
            if (nextIndex >= options.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = options.length - 1;
            
            options[nextIndex].focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);
};

// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
};

// ARIA live region for dynamic updates
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}> = ({ children, politeness = 'polite', atomic = true }) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};