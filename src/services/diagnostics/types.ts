
import { DiagnosticTestStatus } from '@/types/diagnostics/common';

// Use export type to fix the isolatedModules error
export type { DiagnosticTestStatus };

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
  // Add missing properties
  validationDetails?: {
    invalidFields?: string[];
    unexpectedErrors?: string[];
    missingErrors?: string[];
  };
  fields?: Array<{
    name: string;
    type: string;
    status?: DiagnosticTestStatus;
    errors?: string[];
    message?: string;
    validations?: string[];
  }>;
  success?: boolean;
  location?: string;
  name?: string;
}

export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  message: string;
  loadTime?: number;
  timestamp: string;
  details?: any;
  component?: string;
  errorType?: string;
  attemptCount?: number;
  relatedFiles?: string[];
  lastTested?: string;
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
