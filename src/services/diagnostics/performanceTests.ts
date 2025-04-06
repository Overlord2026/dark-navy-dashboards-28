
import { PerformanceTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export const runPerformanceTests = async (): Promise<PerformanceTestResult[]> => {
  // Simulate performance testing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock performance test results
  return [
    {
      id: uuidv4(),
      name: "Dashboard Page Load",
      status: "success",
      message: "Dashboard loads within acceptable time",
      responseTime: 320,
      threshold: 1000,
      cpuUsage: 12,
      memoryUsage: 54,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "Portfolio Page Load",
      status: "warning",
      message: "Portfolio page load time is close to threshold",
      responseTime: 950,
      threshold: 1000,
      cpuUsage: 25,
      memoryUsage: 78,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "Settings Page Load",
      status: "success",
      message: "Settings page loads quickly",
      responseTime: 210,
      threshold: 1000,
      cpuUsage: 8,
      memoryUsage: 42,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "Data Processing",
      status: "error",
      message: "Data processing exceeds threshold",
      responseTime: 3200,
      threshold: 1500,
      cpuUsage: 85,
      memoryUsage: 92,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "API Response Time",
      status: "success",
      message: "API responds within acceptable time",
      responseTime: 210,
      threshold: 500,
      cpuUsage: 15,
      memoryUsage: 35,
      timestamp: Date.now()
    }
  ];
};
