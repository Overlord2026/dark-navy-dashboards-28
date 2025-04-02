
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
  permission?: string; // Added for compatibility
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
  location?: string; // Added for compatibility
  fields?: any[]; // Added for compatibility
}

export interface IconTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  rendered?: boolean;
  icon?: string;
  location?: string; // Added for compatibility
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
  accessStatus?: string; // Added for compatibility
  expectedAccess?: boolean; // Added for compatibility
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
  memoryUsage?: number; // Added for compatibility
  cpuUsage?: number; // Added for compatibility
  concurrentUsers?: number; // Added for compatibility
  endpoint?: string; // Added for compatibility
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
  details?: string; // Added for compatibility
}

export type PermissionsTestResult = PermissionTestResult;
