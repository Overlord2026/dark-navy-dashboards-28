
/**
 * Service for measuring and monitoring application performance
 */

// Performance thresholds for different metrics
export const PERFORMANCE_THRESHOLDS = {
  route: {
    acceptable: 300, // ms
    warning: 600,    // ms
    critical: 1000   // ms
  },
  component: {
    acceptable: 50,  // ms
    warning: 100,    // ms
    critical: 200    // ms
  }
};

// Key routes to monitor
export const KEY_ROUTES = [
  '/',
  '/dashboard',
  '/accounts',
  '/all-assets',
  '/education',
  '/financial-plans',
  '/properties',
  '/investments',
  '/sharing'
];

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

// Alias for backward compatibility
export const measureRouteLoad = measureRoutePerformance;

// Add type definition for performance.memory
interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo;
}

// Get memory usage information
export const getMemoryUsage = () => {
  // Cast performance to our extended interface
  const perf = window.performance as PerformanceWithMemory;
  
  if (perf && perf.memory) {
    // Memory API is available
    return {
      jsHeapSizeLimit: Math.round(perf.memory.jsHeapSizeLimit / 1048576),
      totalJSHeapSize: Math.round(perf.memory.totalJSHeapSize / 1048576),
      usedJSHeapSize: Math.round(perf.memory.usedJSHeapSize / 1048576),
      usagePercentage: Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100)
    };
  }
  
  // Return default values if memory stats aren't available
  return {
    usagePercentage: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0
  };
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

// Log navigation timing
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

// Create log performance report function
export const logPerformanceReport = async () => {
  const metrics = {
    navigationTiming: logNavigationTiming(),
    memory: getMemoryUsage(),
    timestamp: new Date().toISOString()
  };
  
  console.info('Performance report generated:', metrics);
  return metrics;
};
