
import { DiagnosticTestResult, PerformanceTestResult } from './types';
import { logger } from '../logging/loggingService';

/**
 * Simulates performance testing with concurrent user load
 */
export const runPerformanceTests = async (): Promise<PerformanceTestResult[]> => {
  logger.info("Running performance tests", undefined, "PerformanceTests");
  
  // In a real implementation, this would use actual performance metrics,
  // potentially from browser performance API or backend monitoring
  
  const startTime = performance.now();
  
  // Simulate testing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const endTime = performance.now();
  const actualResponseTime = endTime - startTime;
  
  const tests: PerformanceTestResult[] = [
    {
      name: "Dashboard loading",
      status: actualResponseTime < 500 ? "success" : actualResponseTime < 1000 ? "warning" : "error",
      message: `Response time: ${actualResponseTime.toFixed(2)}ms`,
      responseTime: actualResponseTime,
      memoryUsage: 24.5,
      cpuUsage: 15,
      concurrentUsers: 50,
      endpoint: "/dashboard",
    },
    {
      name: "Financial plan calculation",
      status: "warning",
      message: "Higher than expected CPU usage during financial projections",
      responseTime: 850,
      memoryUsage: 42.8,
      cpuUsage: 65,
      concurrentUsers: 25,
      endpoint: "/financial-plans",
    },
    {
      name: "Document upload",
      status: "success",
      message: "File upload handling is efficient",
      responseTime: 450,
      memoryUsage: 18.2,
      cpuUsage: 12,
      concurrentUsers: 10,
      endpoint: "/documents",
    },
    {
      name: "Investment listings",
      status: "error",
      message: "Possible memory leak detected when loading large investment catalogs",
      responseTime: 1800,
      memoryUsage: 128.4,
      cpuUsage: 72,
      concurrentUsers: 30,
      endpoint: "/investments",
    },
    {
      name: "API data fetching",
      status: "warning",
      message: "Network latency increases with concurrent requests",
      responseTime: 720,
      memoryUsage: 32.1,
      cpuUsage: 28,
      concurrentUsers: 40,
      endpoint: "/api/data",
    },
    {
      name: "Authentication flow",
      status: "success",
      message: "Login/logout operations perform well under load",
      responseTime: 320,
      memoryUsage: 15.6,
      cpuUsage: 8,
      concurrentUsers: 100,
      endpoint: "/auth",
    },
  ];
  
  // Log any performance issues found
  const issues = tests.filter(test => test.status !== "success");
  if (issues.length > 0) {
    logger.warning(
      `Found ${issues.length} performance issues`,
      { 
        issues: issues.map(i => ({ 
          name: i.name, 
          status: i.status, 
          responseTime: i.responseTime,
          cpuUsage: i.cpuUsage
        }))
      },
      "PerformanceTests"
    );
  }
  
  return tests;
};
