
// Fix re-export issues
export * from './common';
export * from './recommendations';

// Export types to fix isolatedModules errors
export type { 
  ApiEndpointDiagnosticResult,
  AccessibilityAuditResult 
} from './api';

export type { DiagnosticResultSummary } from './summary';
export type { DiagnosticResult } from './common';
export type { FormValidationTestResult } from './forms';
export type { NavigationTestResult } from './navigation';
export type { PerformanceTestResult } from './performance';
