
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
  name?: string;
  url?: string;
  errorMessage?: string;
  warningMessage?: string;
  expectedDataStructure?: string;
  responseStatus?: number;
  schemaValidation?: {
    valid: boolean;
    errors?: string[];
    expected?: any;
    actual?: any;
  };
  service?: string;
  authStatus?: string;
}

export interface AccessibilityAuditResult {
  id: string;
  component: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  violations: number;
  details?: any;
  // Add missing properties
  impact?: 'critical' | 'serious' | 'moderate' | 'minor';
  rule?: string;
  elements?: string[];
  element?: string;
  recommendation?: string;
  helpUrl?: string;
}
