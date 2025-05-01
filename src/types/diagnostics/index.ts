
// Export all diagnostic types from this index file
export * from './common';
export * from './navigation';
export * from './recommendations';

// Add additional types needed by the diagnostics system

export interface IconTestResult {
  id: string;
  iconName: string;
  status: "pass" | "fail" | "warn";
  message: string;
  details?: Record<string, any>;
}

export interface AccessibilityAuditResult {
  id: string;
  component: string;
  status: "error" | "warning" | "success";
  message: string;
  timestamp: string;
  violations: number;
  impact: "critical" | "serious" | "moderate" | "minor";
  elements: string[];
  helpUrl: string;
  rule: string;
}

export interface ApiEndpointDiagnosticResult {
  id: string;
  name: string;
  url: string;
  status: "error" | "warning" | "success";
  message: string;
  responseTime?: number;
  method?: string;
  responseStatus?: number;
  timestamp: string;
  schemaValidation?: {
    valid: boolean;
    errors?: any[];
    expected?: string;
    actual?: string;
  };
}

export interface FormField {
  name: string;
  type: string;
  required?: boolean;
  validations?: string[];
}

export interface FormValidationTestResult {
  id: string;
  formId: string;
  formName: string;
  testName: string;
  status: "pass" | "fail" | "warn" | "error" | "warning" | "success";
  message: string;
  timestamp: string;
  validationDetails?: {
    invalidFields?: string[];
    unexpectedErrors?: string[];
    missingErrors?: string[];
  };
  fields?: Array<{
    name: string;
    type: string;
    status?: "pass" | "fail" | "warn" | "error" | "warning" | "success";
    errors?: string[];
    validations?: string[];
  }>;
  success?: boolean;
  location?: string;
  name?: string;
}

export interface PerformanceTestResult {
  id: string;
  component: string;
  metric: string;
  value: number;
  threshold: number;
  status: "pass" | "fail" | "warn" | "error" | "warning" | "success";
  message: string;
  timestamp: string;
  details?: any;
}

export interface DiagnosticResultSummary {
  overall?: string;
  timestamp: string;
  securityTests?: Array<{ id: string; status: string; message: string; timestamp: string; }>;
  apiIntegrationTests?: Array<{ id: string; status: string; message: string; timestamp: string; details?: any; }>;
  performanceTests?: Array<{ id: string; status: string; message: string; timestamp: string; }>;
  navigationTests?: Array<{ id: string; status: string; message: string; timestamp: string; }>;
  formValidationTests?: Array<{ id: string; status: string; message: string; timestamp: string; }>;
  iconTests?: Array<{ id: string; status: string; message: string; timestamp: string; }>;
  recommendations?: Array<{
    id: string;
    title?: string;
    text?: string;
    priority: "high" | "medium" | "low";
    description?: string;
    actionable: boolean;
    action?: string;
  }>;
  apiTests?: { passed: number; failed: number; total: number; };
  navigationTests2?: { passed: number; failed: number; total: number; };
  formValidationTests2?: { passed: number; failed: number; total: number; };
  performanceTests2?: { passed: number; failed: number; total: number; };
  securityTests2?: { passed: number; failed: number; total: number; };
}
