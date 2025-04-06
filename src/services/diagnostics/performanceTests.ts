
import { logger } from "../logging/loggingService";
import { PerformanceTestResult, DiagnosticTestStatus } from "./types";

export async function runPerformanceTests(): Promise<PerformanceTestResult[]> {
  logger.info("Running performance tests...", undefined, "PerformanceTests");
  
  // Simulate performance tests
  const performanceResults: PerformanceTestResult[] = [];
  
  // Test 1: API response time
  performanceResults.push({
    id: "perf-001",
    name: "API Response Time",
    status: "success",
    message: "API average response time within acceptable limits",
    responseTime: 120,
    memoryUsage: 42.5,
    cpuUsage: 15,
    concurrentUsers: 100,
    endpoint: "/api/data"
  });
  
  // Test 2: Dashboard loading performance
  performanceResults.push({
    id: "perf-002",
    name: "Dashboard Loading Time",
    status: "success",
    message: "Dashboard loads within acceptable time frame",
    responseTime: 350,
    memoryUsage: 68.2,
    cpuUsage: 22,
    concurrentUsers: 50,
    endpoint: "/dashboard"
  });
  
  // Test 3: Profile page performance
  performanceResults.push({
    id: "perf-003",
    name: "Profile Page Performance",
    status: "warning",
    message: "Profile page loading time slightly above threshold",
    responseTime: 780,
    memoryUsage: 72.1,
    cpuUsage: 35,
    concurrentUsers: 25,
    endpoint: "/profile"
  });
  
  // Test 4: Search functionality
  performanceResults.push({
    id: "perf-004",
    name: "Search Performance",
    status: "error",
    message: "Search response time exceeds acceptable threshold",
    responseTime: 2200,
    memoryUsage: 128.5,
    cpuUsage: 65,
    concurrentUsers: 10,
    endpoint: "/api/search"
  });
  
  // Test 5: Document upload
  performanceResults.push({
    id: "perf-005",
    name: "Document Upload",
    status: "success",
    message: "Document upload processing within acceptable time",
    responseTime: 450,
    memoryUsage: 90.3,
    cpuUsage: 40,
    concurrentUsers: 5,
    endpoint: "/api/documents/upload"
  });
  
  // Simulate an async operation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  logger.info("Performance tests completed", {
    testCount: performanceResults.length,
    averageResponseTime: performanceResults.reduce((acc, curr) => acc + curr.responseTime, 0) / performanceResults.length
  }, "PerformanceTests");
  
  return performanceResults;
}

export function getPerformanceRating(responseTime: number, endpoint: string): DiagnosticTestStatus {
  // Different thresholds based on endpoint type
  if (endpoint.includes('/api/')) {
    if (responseTime < 200) return "success";
    if (responseTime < 500) return "success";
    if (responseTime < 1000) return "warning";
    return "error";
  } else {
    // Frontend routes
    if (responseTime < 500) return "success";
    if (responseTime < 1000) return "success";
    if (responseTime < 2000) return "warning";
    return "error";
  }
}
