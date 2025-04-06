
import { PerformanceTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testPerformance = (): PerformanceTestResult[] => {
  // Sample performance tests
  return [
    {
      id: uuidv4(),
      name: "Homepage Load",
      status: "success",
      responseTime: 245,
      cpuUsage: 12,
      memoryUsage: 45.2,
      message: "Homepage loads within acceptable time",
      concurrentUsers: 10 // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Dashboard Load",
      status: "warning",
      responseTime: 890,
      cpuUsage: 45,
      memoryUsage: 120.5,
      message: "Dashboard load time approaching threshold",
      concurrentUsers: 25 // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Account Details API",
      status: "error",
      responseTime: 2450,
      cpuUsage: 78,
      memoryUsage: 210.8,
      message: "Account details API response time exceeds threshold",
      concurrentUsers: 50 // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "PDF Generation",
      status: "success",
      responseTime: 1200,
      cpuUsage: 65,
      memoryUsage: 180.3,
      message: "PDF generation performance within acceptable limits",
      concurrentUsers: 5 // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Search Operation",
      status: "warning",
      responseTime: 750,
      cpuUsage: 35,
      memoryUsage: 90.4,
      message: "Search performance degrades with large result sets",
      concurrentUsers: 30 // Added for backward compatibility
    }
  ];
};
