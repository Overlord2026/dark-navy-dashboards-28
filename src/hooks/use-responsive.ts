import { useState, useEffect } from 'react';

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallScreen: boolean;
  screenWidth: number;
}

export function useResponsive(): ResponsiveBreakpoints {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: screenWidth < 640,
    isTablet: screenWidth >= 640 && screenWidth < 1024,
    isDesktop: screenWidth >= 1024,
    isSmallScreen: screenWidth < 1024,
    screenWidth
  };
}