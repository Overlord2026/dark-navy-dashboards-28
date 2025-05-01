
import { DiagnosticTestStatus } from './common';

export interface ApiEndpointDiagnosticResult {
  id: string;
  endpoint: string;
  method: string;
  status: DiagnosticTestStatus;
  responseTime: number;
  timestamp: string;
  message: string;
  details?: any;
}

export interface AccessibilityAuditResult {
  id: string;
  component: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  violations: number;
  details?: any;
}
