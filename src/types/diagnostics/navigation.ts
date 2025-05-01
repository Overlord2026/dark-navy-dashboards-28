
import { DiagnosticTestStatus } from './common';

export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus | "pass" | "fail" | "warn";
  name?: string;
  message: string;
  timestamp: string | number;
  responseTime?: number;
  loadTime?: number;
  details?: any;
  component?: string;
  errorType?: string;
  attemptCount?: number;
  relatedFiles?: string[];
  lastTested?: string;
}
