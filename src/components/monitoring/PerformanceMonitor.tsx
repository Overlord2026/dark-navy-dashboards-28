import { useEffect } from 'react';
import { logger } from '@/services/logging/loggingService';

interface PerformanceMetrics {
  [key: string]: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            logger.info('LCP Measurement', {
              metric: 'lcp',
              value: lastEntry.startTime,
              threshold: lastEntry.startTime > 2500 ? 'poor' : lastEntry.startTime > 1200 ? 'needs-improvement' : 'good'
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID) and Cumulative Layout Shift (CLS)
          const performanceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === 'first-input') {
                const fid = entry.processingStart - entry.startTime;
                logger.info('FID Measurement', {
                  metric: 'fid',
                  value: fid,
                  threshold: fid > 300 ? 'poor' : fid > 100 ? 'needs-improvement' : 'good'
                });
              }
              
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                logger.info('CLS Measurement', {
                  metric: 'cls',
                  value: (entry as any).value,
                  threshold: (entry as any).value > 0.25 ? 'poor' : (entry as any).value > 0.1 ? 'needs-improvement' : 'good'
                });
              }
            });
          });
          
          performanceObserver.observe({ 
            entryTypes: ['first-input', 'layout-shift'] 
          });

          // Long Task Observer
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              logger.warning('Long Task Detected', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              });
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });

        } catch (error) {
          logger.error('Performance Observer Setup Failed', { error });
        }
      }
    };

    // Monitor Memory Usage (if available)
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        logger.info('Memory Usage', {
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
          memoryPressure: memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.8 ? 'high' : 'normal'
        });
      }
    };

    // Monitor Network Information
    const monitorNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        logger.info('Network Information', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    };

    // Run monitoring
    observeWebVitals();
    monitorMemory();
    monitorNetwork();

    // Monitor every 30 seconds
    const interval = setInterval(() => {
      monitorMemory();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null; // This is a monitoring component, no UI
}

// Performance utility functions
export const measurePageLoad = (pageName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    logger.info('Page Load Performance', {
      page: pageName,
      loadTime,
      threshold: loadTime > 3000 ? 'slow' : loadTime > 1000 ? 'moderate' : 'fast'
    });
    
    return loadTime;
  };
};

export const measureAsyncOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    
    logger.info('Async Operation Performance', {
      operation: operationName,
      duration: endTime - startTime,
      status: 'success'
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    
    logger.error('Async Operation Failed', {
      operation: operationName,
      duration: endTime - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw error;
  }
};