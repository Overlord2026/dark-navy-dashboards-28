
import { useState, useEffect } from 'react';

interface PagePerformanceMetrics {
  loadTime: number;
  isLoaded: boolean;
  interactionReady: boolean;
}

export function usePagePerformance(): PagePerformanceMetrics {
  const [metrics, setMetrics] = useState<PagePerformanceMetrics>({
    loadTime: 0,
    isLoaded: false,
    interactionReady: false
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Mark initial load
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setMetrics(prev => ({
          ...prev,
          isLoaded: true,
          loadTime: performance.now() - startTime
        }));
        
        // Mark when page is fully interactive (including data loading)
        setTimeout(() => {
          setMetrics(prev => ({
            ...prev,
            interactionReady: true
          }));
        }, 100);
      });
    });
    
    // Log performance metrics
    return () => {
      const totalLoadTime = performance.now() - startTime;
      console.log(`Page performance metrics - Total time: ${totalLoadTime.toFixed(2)}ms`);
    };
  }, []);

  return metrics;
}
