
import { DiagnosticTestStatus, DiagnosticResult, Recommendation } from './common';

export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  name?: string;
  message?: string; 
  timestamp: number;
  responseTime?: number;
  recommendations?: (string | Recommendation)[];
  details?: any;
}

export type NavigationDiagnosticResult = NavigationTestResult;
