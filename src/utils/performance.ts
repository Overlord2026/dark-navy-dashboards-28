/**
 * Performance utility functions to measure and track performance metrics
 */

// Store benchmarks for comparison
const performanceBenchmarks: Record<string, number> = {
  // Route load times in milliseconds
  'route:/dashboard': 500,
  'route:/clients': 450,
  'route:/financial-plans': 600,
  'route:/system-diagnostics': 700,
  
  // API endpoints in milliseconds
  'api:/financial-plans': 200,
  'api:/user/profile': 150,
  'api:/clients': 250,
  
  // Component render times in milliseconds
  'component:Dashboard': 100,
  'component:ClientList': 120,
  'component:FinancialPlanChart': 80
};

// Default thresholds for different categories
const defaultThresholds = {
  route: {
    warning: 1000, // ms
    error: 2000 // ms
  },
  api: {
    warning: 500, // ms
    error: 1000 // ms
  },
  component: {
    warning: 150, // ms
    error: 300 // ms
  }
};

/**
 * Measures the execution time of a function
 * @param fn Function to measure
 * @returns [result, executionTime]
 */
export const measureExecutionTime = async <T>(fn: () => Promise<T> | T): Promise<[T, number]> => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return [result, executionTime];
};

/**
 * Evaluates performance based on time and benchmark
 * @param category Category of the operation ('route', 'api', 'component')
 * @param name Name of the specific item being measured
 * @returns Performance rating: 'success', 'warning', or 'error'
 */
export const evaluatePerformance = (
  category: 'route' | 'api' | 'component',
  name: string,
  time: number
): 'success' | 'warning' | 'error' => {
  const benchmarkKey = `${category}:${name}`;
  const benchmark = performanceBenchmarks[benchmarkKey];
  const thresholds = defaultThresholds[category];
  
  // If we have a specific benchmark, compare against it
  if (benchmark) {
    if (time > benchmark * 2) {
      return 'error';
    } else if (time > benchmark * 1.5) {
      return 'warning';
    }
    return 'success';
  }
  
  // Otherwise use default thresholds
  if (time > thresholds.error) {
    return 'error';
  } else if (time > thresholds.warning) {
    return 'warning';
  }
  return 'success';
};

/**
 * Record performance metric with automatic logging
 * @param category Category of the operation
 * @param name Name of the item
 * @param time Time in milliseconds
 */
export const recordPerformanceMetric = (
  category: 'route' | 'api' | 'component',
  name: string,
  time: number
): void => {
  const performance = evaluatePerformance(category, name, time);
  const benchmarkKey = `${category}:${name}`;
  const benchmark = performanceBenchmarks[benchmarkKey];
  
  console.info(
    `Performance [${category}:${name}]: ${time.toFixed(2)}ms`,
    benchmark ? `(Benchmark: ${benchmark}ms)` : '',
    `[${performance.toUpperCase()}]`
  );
  
  // In a real implementation, this would send telemetry to a backend service
};

/**
 * Hook to measure component render time
 * Usage in component:
 * 
 * useEffect(() => {
 *   const stopTimer = measureComponentRender('MyComponent');
 *   return () => stopTimer();
 * }, []);
 */
export const measureComponentRender = (componentName: string): (() => void) => {
  const startTime = performance.now();
  
  return () => {
    const renderTime = performance.now() - startTime;
    recordPerformanceMetric('component', componentName, renderTime);
  };
};

/**
 * Helper to measure page/route load time
 * Usage:
 * 
 * useEffect(() => {
 *   const cleanup = measureRouteLoad('/dashboard');
 *   return cleanup;
 * }, []);
 */
export const measureRouteLoad = (route: string): (() => void) => {
  const startTime = performance.now();
  console.info(`Route loading: ${route}`);
  
  return () => {
    const loadTime = performance.now() - startTime;
    recordPerformanceMetric('route', route, loadTime);
  };
};
