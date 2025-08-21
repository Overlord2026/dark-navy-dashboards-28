import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  highContrast: boolean;
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(reducedMotionQuery.matches);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(highContrastQuery.matches);
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Apply accessibility styles
    if (reducedMotionQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
    
    if (highContrastQuery.matches) {
      document.documentElement.classList.add('high-contrast');
    }

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        prefersReducedMotion, 
        highContrast, 
        announceMessage 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}