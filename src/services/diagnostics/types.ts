
import { DiagnosticTestStatus } from '@/types/diagnostics/common';

export interface ApiIntegrationTestResult {
  id: string;
  service: string;
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  message: string;
  url?: string;
  method?: string;
  errorMessage?: string;
  warningMessage?: string;
  expectedDataStructure?: string;
  authStatus?: string;
  details?: any;
  name?: string;
  canAutoFix?: boolean;
  fixMessage?: string;
}

export interface FormValidationTestResult {
  id: string;
  formId: string;
  formName: string;
  testName: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  details?: any;
}

export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  message: string;
  loadTime?: number;
  timestamp: string;
  details?: any;
}

export interface PerformanceTestResult {
  id: string;
  component: string;
  metric: string;
  value: number;
  threshold: number;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  details?: any;
}
