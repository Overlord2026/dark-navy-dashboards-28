
/**
 * Performance Monitoring Service
 * Measures and logs performance metrics of key routes and components
 */
import { logger } from "../logging/loggingService";
import { recordPerformanceMetric, evaluatePerformance } from "@/utils/performance";

// Define key routes for performance monitoring
export const KEY_ROUTES = [
  '/dashboard',
  '/accounts',
  '/investments',
  '/documents',
  '/financial-plans',
  '/estate-planning',
  '/tax-planning'
];

// Performance thresholds in milliseconds
export const PERFORMANCE_THRESHOLDS = {
  route: {
    acceptable: 800,   // ms
    warning: 1500,     // ms
    critical: 3000     // ms
  },
  api: {
    acceptable: 300,   // ms
    warning: 800,      // ms
    critical: 2000     // ms
  },
  component: {
    acceptable: 200,   // ms
    warning: 400,      // ms
    critical: 800      // ms
  }
};

// Track ongoing measurements
let activeMeasurements: Record<string, number> = {};

/**
 * Start measuring load time for a specific page or component
 * @param type Type of measurement ('route', 'api', 'component')
 * @param name Identifier for what's being measured
 * @returns Stop function to call when measurement should end
 */
export const startMeasurement = (type: 'route' | 'api' | 'component', name: string): () => number => {
  const key = `${type}:${name}`;
  activeMeasurements[key] = performance.now();
  
  // Return a function to stop the measurement
  return () => {
    if (activeMeasurements[key]) {
      const duration = performance.now() - activeMeasurements[key];
      recordPerformanceMetric(type, name, duration);
      
      // Log performance issues
      const performanceRating = evaluatePerformance(type, name, duration);
      if (performanceRating !== 'success') {
        logger.warning(
          `Performance issue detected for ${type}: ${name}`,
          {
            duration,
            performanceRating,
            timestamp: new Date().toISOString(),
            memoryUsage: getMemoryUsage()
          },
          'PerformanceMonitor'
        );
      }
      
      // Clean up
      delete activeMeasurements[key];
      return duration;
    }
    return 0;
  };
};

/**
 * Measure a route's load time
 * @param route Route path
 * @returns Cleanup function to call when component unmounts
 */
export const measureRoutePerformance = (route: string): (() => number) => {
  return startMeasurement('route', route);
};

/**
 * Measure a component's render time
 * @param componentName Name of the component
 * @returns Cleanup function to call when component unmounts
 */
export const measureComponentPerformance = (componentName: string): (() => number) => {
  return startMeasurement('component', componentName);
};

/**
 * Measure an API call's response time
 * @param endpoint API endpoint
 * @returns Function to call when API response is received
 */
export const measureApiPerformance = (endpoint: string): (() => number) => {
  startMeasurement('api', endpoint);
  return () => {
    const duration = performance.now() - (activeMeasurements[`api:${endpoint}`] || 0);
    recordPerformanceMetric('api', endpoint, duration);
    delete activeMeasurements[`api:${endpoint}`];
    return duration;
  };
};

/**
 * Get current memory usage information
 * @returns Object with memory usage data
 */
export const getMemoryUsage = (): { jsHeapSizeLimit?: number; totalJSHeapSize?: number; usedJSHeapSize?: number; usagePercentage?: number } => {
  if ('performance' in window && 'memory' in (performance as any)) {
    const memory = (performance as any).memory;
    return {
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  return {};
};

/**
 * Logs a performance report for the current session
 */
export const logPerformanceReport = async (): Promise<void> => {
  // Get memory usage
  const memoryUsage = getMemoryUsage();
  
  // This would be replaced by actual metrics from your monitoring system
  // For now we'll simulate it with some calculated values
  const metrics = {
    routes: KEY_ROUTES.map(route => ({
      route,
      loadTime: Math.random() * 2000 + 500, // Simulate load times between 500-2500ms
      resourceUtilization: Math.random() * 80 + 20 // 20-100%
    })),
    memory: memoryUsage
  };
  
  // Log the report
  logger.info('Performance report generated', { metrics }, 'PerformanceReport');
  
  return;
};
