
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export function useViewportLogger() {
  const { isMobile, forceDesktop } = useIsMobile();
  
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLaptopWidth = width >= 1024;
      
      console.log('--- Viewport Information ---');
      console.log(`Viewport dimensions: ${width}px × ${height}px`);
      console.log(`Device classification: ${isLaptopWidth ? 'Laptop/Desktop' : 'Mobile/Tablet'}`);
      console.log(`isMobile state: ${isMobile}`);
      console.log(`forceDesktop enabled: ${forceDesktop}`);
      console.log(`Expected view: ${isMobile ? 'Mobile' : 'Desktop'}`);
      console.log(`Actual view: ${(forceDesktop && isLaptopWidth) || !isMobile ? 'Desktop' : 'Mobile'}`);
      
      if (isLaptopWidth && isMobile && !forceDesktop) {
        console.warn('DISCREPANCY: Device has laptop dimensions but mobile view is active. Consider enabling forceDesktop.');
      } else if (!isLaptopWidth && !isMobile && !forceDesktop) {
        console.warn('DISCREPANCY: Device has mobile dimensions but desktop view is active.');
      }
      
      console.log('------------------------');
    };
    
    // Log on mount and when viewport changes
    checkViewport();
    
    const handleResize = () => {
      checkViewport();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, forceDesktop]);
  
  return null;
}
