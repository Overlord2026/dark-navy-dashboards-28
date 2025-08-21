import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableTabTrapping?: boolean;
  enableEscapeKey?: boolean;
  onEscape?: () => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = true,
    enableTabTrapping = false,
    enableEscapeKey = true,
    onEscape,
    containerRef
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const container = containerRef?.current || document;
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    
    const focusableArray = Array.from(focusableElements) as HTMLElement[];
    const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement);

    // Handle escape key
    if (enableEscapeKey && event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }

    // Handle arrow key navigation
    if (enableArrowKeys && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      
      if (focusableArray.length === 0) return;
      
      let nextIndex;
      if (event.key === 'ArrowDown') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= focusableArray.length) nextIndex = 0;
      } else {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = focusableArray.length - 1;
      }
      
      focusableArray[nextIndex]?.focus();
    }

    // Handle tab trapping
    if (enableTabTrapping && event.key === 'Tab') {
      if (focusableArray.length === 0) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey) {
        if (currentIndex <= 0) {
          event.preventDefault();
          focusableArray[focusableArray.length - 1]?.focus();
        }
      } else {
        if (currentIndex >= focusableArray.length - 1) {
          event.preventDefault();
          focusableArray[0]?.focus();
        }
      }
    }
  }, [enableArrowKeys, enableTabTrapping, enableEscapeKey, onEscape, containerRef]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const focusFirst = useCallback(() => {
    const container = containerRef?.current || document;
    const firstFocusable = container.querySelector(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    ) as HTMLElement;
    firstFocusable?.focus();
  }, [containerRef]);

  const focusLast = useCallback(() => {
    const container = containerRef?.current || document;
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    lastFocusable?.focus();
  }, [containerRef]);

  return {
    focusFirst,
    focusLast
  };
}