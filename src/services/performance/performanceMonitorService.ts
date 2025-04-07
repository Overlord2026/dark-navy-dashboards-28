
/**
 * Service for measuring and monitoring application performance
 */

// Measure route loading performance
export const measureRoutePerformance = (routePath: string) => {
  const startTime = performance.now();
  
  // Return function to stop measuring
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // In a real app, this would send telemetry to a service
    console.info(`Route performance for ${routePath}: ${loadTime.toFixed(2)}ms`);
    
    return loadTime;
  };
};

// Get memory usage information
export const getMemoryUsage = () => {
  if (window.performance && window.performance.memory) {
    // @ts-ignore - memory is a non-standard property not in TypeScript definitions
    const memory = window.performance.memory;
    return {
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576),
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576)
    };
  }
  
  // Return null if memory stats aren't available
  return null;
};

// Track component render time
export const trackComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const renderTime = performance.now() - startTime;
    console.debug(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    return renderTime;
  };
};

// Log navigation performance
export const logNavigationTiming = () => {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const navigationStart = timing.navigationStart;
    
    // Calculate timing metrics
    const metrics = {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnection: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseStart - timing.requestStart,
      domLoad: timing.domComplete - timing.domLoading,
      resourceLoad: timing.loadEventEnd - timing.responseEnd,
      total: timing.loadEventEnd - navigationStart
    };
    
    console.info('Navigation timing metrics:', metrics);
    return metrics;
  }
  
  return null;
};
