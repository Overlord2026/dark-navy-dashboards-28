
import { NavigationDiagnosticResult, LogLevel } from "@/types/diagnostics";

export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface NavigationTestResult extends NavigationDiagnosticResult {
  // This extends NavigationDiagnosticResult to ensure compatibility
}

export interface PermissionTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  role?: string;
  resource?: string;
  expected?: boolean;
  actual?: boolean;
}

export interface ApiIntegrationTestResult {
  endpoint: string;
  status: DiagnosticTestStatus;
  message: string;
  responseTime?: number;
  statusCode?: number;
  errorDetails?: string;
  service?: string;
  authStatus?: string;
  errorCode?: string;
  canAutoFix?: boolean;
  documentationUrl?: string;
  documentation?: string;
  fixMessage?: string;
  lastUpdated?: string;
}

export interface FormValidationTestResult {
  form: string;
  status: DiagnosticTestStatus;
  message: string;
  issues?: {
    field: string;
    error: string;
  }[];
  formName?: string;
}

export interface IconTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  rendered?: boolean;
  icon?: string;
}

export interface RoleSimulationTestResult {
  role: string;
  status: DiagnosticTestStatus;
  message: string;
  accessTests?: {
    resource: string;
    expected: boolean;
    actual: boolean;
  }[];
  module?: string;
}

export interface PerformanceTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  metrics?: {
    loadTime?: number;
    renderTime?: number;
    memoryUsage?: number;
    responseTime?: number;
  };
  recommendation?: string;
  responseTime?: number;
}

export interface SecurityTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  severity?: "low" | "medium" | "high" | "critical";
  details?: string;
  recommendation?: string;
  category?: string;
  remediation?: string;
}

export interface DiagnosticResult {
  status: DiagnosticTestStatus;
  message: string;
}

export type PermissionsTestResult = PermissionTestResult;
