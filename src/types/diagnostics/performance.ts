
import { DiagnosticTestStatus } from './common';

export interface PerformanceTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  responseTime: number;
  threshold: number;
  concurrentUsers?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  timestamp: number;
  details?: any;
}
