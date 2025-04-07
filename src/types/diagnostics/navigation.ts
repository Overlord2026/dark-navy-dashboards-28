
import { DiagnosticTestStatus, DiagnosticResult, Recommendation } from './common';

export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  message?: string; 
  timestamp: number;
  recommendations?: (string | Recommendation)[];
  details?: any;
}

export type NavigationDiagnosticResult = NavigationTestResult;
