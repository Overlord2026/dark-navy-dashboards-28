
// Fix re-export issues
export * from './common';
export * from './recommendations';

// Export types to fix isolatedModules errors
export type { 
  ApiEndpointDiagnosticResult,
  AccessibilityAuditResult 
} from './api';

// Define DiagnosticResultSummary type
export interface DiagnosticResultSummary {
  apiTests: { passed: number; failed: number; total: number };
  formValidationTests: { passed: number; failed: number; total: number };
  navigationTests: { passed: number; failed: number; total: number };
  performanceTests: { passed: number; failed: number; total: number };
  securityTests: { passed: number; failed: number; total: number };
  timestamp: string;
  recommendations: Array<{
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    actionable: boolean;
  }>;
}

export type FormField = {
  name: string;
  type: string;
  required?: boolean;
  validations?: string[];
  value?: any;
};

export type IconTestResult = {
  id: string;
  iconName: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
};

export type PermissionTestResult = {
  id: string;
  role: string;
  resource: string;
  permission: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
};

export type RoleSimulationTestResult = {
  id: string;
  role: string;
  scenario: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
};

export type SecurityTestResult = {
  id: string;
  testName: string;
  category: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
};
