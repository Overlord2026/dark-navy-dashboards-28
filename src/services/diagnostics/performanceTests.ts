
import { PerformanceTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testPerformance = async (): Promise<PerformanceTestResult[]> => {
  // In a real implementation, this would run actual performance tests
  // For this demo, we'll return mock results
  
  return [
    {
      id: uuidv4(),
      name: "Dashboard Loading Performance",
      status: "success",
      responseTime: 238,
      cpuUsage: 2.1,
      memoryUsage: 24.5,
      message: "Dashboard loads within acceptable time frame",
      details: {
        timeToFirstByte: 78,
        timeToInteractive: 238,
        domContentLoaded: 150
      },
      concurrentUsers: 1
    },
    {
      id: uuidv4(),
      name: "Investment Charts Rendering",
      status: "warning",
      responseTime: 1240,
      cpuUsage: 15.6,
      memoryUsage: 65.2,
      message: "Charts rendering is slower than expected",
      details: {
        renderTime: 890,
        dataProcessingTime: 350
      },
      concurrentUsers: 1
    },
    {
      id: uuidv4(),
      name: "Account List Loading",
      status: "success",
      responseTime: 350,
      cpuUsage: 3.8,
      memoryUsage: 28.9,
      message: "Account list loads efficiently",
      details: {
        dbQueryTime: 120,
        renderingTime: 230
      },
      concurrentUsers: 5
    },
    {
      id: uuidv4(),
      name: "Portfolio Analysis Calculation",
      status: "error",
      responseTime: 5600,
      cpuUsage: 89.5,
      memoryUsage: 92.3,
      message: "Portfolio analysis calculations taking too long",
      details: {
        calculationTime: 5100,
        renderingTime: 500,
        memoryLeakDetected: true
      },
      concurrentUsers: 3
    },
    {
      id: uuidv4(),
      name: "Search Functionality",
      status: "success",
      responseTime: 290,
      cpuUsage: 5.2,
      memoryUsage: 32.1,
      message: "Search operates within performance thresholds",
      details: {
        indexingTime: 20,
        queryTime: 150,
        renderTime: 120
      },
      concurrentUsers: 10
    }
  ];
};
