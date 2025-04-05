
import { useState, useEffect } from "react";
import { useIsMobile } from "./use-mobile";

// This is the minimum width at which we'll always show desktop view
const LAPTOP_THRESHOLD = 1024;

export function useViewportOverride() {
  const isMobileSized = useIsMobile();
  const [isLaptopOverride, setIsLaptopOverride] = useState(false);
  
  // On mount and window resize, check if we should override
  useEffect(() => {
    const checkViewportOverride = () => {
      const width = window.innerWidth;
      setIsLaptopOverride(width >= LAPTOP_THRESHOLD);
    };
    
    // Initial check
    checkViewportOverride();
    
    // Listen for window resize
    window.addEventListener('resize', checkViewportOverride);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkViewportOverride);
  }, []);

  // If screen is laptop size or larger, override the mobile detection
  const shouldOverrideToDesktop = isLaptopOverride;
  
  // This is what components should use to determine if mobile view should be shown
  const effectiveIsMobile = shouldOverrideToDesktop ? false : isMobileSized;
  
  return {
    effectiveIsMobile,
    isMobileSized,
    isLaptopOverride
  };
}
