
import { useEffect } from 'react';
import { measureRoutePerformance, getMemoryUsage } from '@/services/performance/performanceMonitorService';

/**
 * Hook to measure page performance and resource utilization
 * 
 * @param route The route path being measured
 * @param options Additional measurement options
 * @returns void
 * 
 * @example
 * // In a page component:
 * usePagePerformance('/dashboard');
 */
export function usePagePerformance(route: string, options: { 
  logMemory?: boolean;
  logToConsole?: boolean;
} = {}) {
  const { logMemory = true, logToConsole = false } = options;
  
  useEffect(() => {
    // Start measuring when the component mounts
    const stopMeasuring = measureRoutePerformance(route);
    
    // Log initial memory usage if requested
    if (logMemory) {
      const initialMemory = getMemoryUsage();
      if (logToConsole) {
        console.info(`Initial memory for ${route}:`, initialMemory);
      }
    }
    
    // Return cleanup function
    return () => {
      // Stop measuring when component unmounts
      const loadTime = stopMeasuring();
      
      if (logToConsole) {
        console.info(`Page ${route} load time:`, loadTime.toFixed(2), 'ms');
        
        if (logMemory) {
          const finalMemory = getMemoryUsage();
          console.info(`Final memory for ${route}:`, finalMemory);
        }
      }
    };
  }, [route, logMemory, logToConsole]);
}
