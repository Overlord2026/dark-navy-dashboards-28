
/**
 * Represents the status of a diagnostic test
 * - success: Test passed successfully
 * - warning: Test passed with warnings
 * - error: Test failed
 */
export type DiagnosticTestStatus = "success" | "warning" | "error";

/**
 * Interface for diagnostic test result
 */
export interface DiagnosticTestResult {
  status: DiagnosticTestStatus;
  message: string;
  details?: string;
  timestamp?: string;
}

/**
 * Interface for diagnostic report
 */
export interface DiagnosticReport {
  timestamp: string;
  overall: DiagnosticTestStatus;
  tests: DiagnosticTestResult[];
  error?: string;
}

/**
 * Interface for API endpoint diagnostic result
 */
export interface ApiEndpointDiagnosticResult {
  name: string;
  url: string;
  method: string;
  status: DiagnosticTestStatus;
  responseTime: number;
  responseStatus?: number;
  responseSize?: number;
  errorMessage?: string;
  expectedDataStructure: string;
  actualDataStructure?: string;
  structureMatch?: boolean;
  authStatus?: "valid" | "invalid" | "expired" | "missing";
  recommendations?: any[];
}

/**
 * Interface for API endpoint test result (internal use)
 */
export interface ApiEndpointTestResult {
  name: string;
  url: string;
  method: string;
  status: DiagnosticTestStatus;
  responseTime: number;
  responseStatus?: number;
  responseSize?: number;
  errorMessage?: string;
  expectedDataStructure?: string; // Optional in test result but required in diagnostic result
  actualDataStructure?: string;
  structureMatch?: boolean;
  authStatus?: "valid" | "invalid" | "expired" | "missing";
}

/**
 * Interface for navigation test result
 */
export interface NavigationTestResult {
  route: string;
  status: DiagnosticTestStatus;
  message: string;
  recommendations?: any[];
  componentStatus?: {
    rendered: boolean;
    loadTime?: number;
    errors?: string[];
  };
  apiStatus?: {
    endpoint: string;
    status: DiagnosticTestStatus;
    responseTime?: number;
    errorMessage?: string;
  }[];
  consoleErrors?: string[];
}

/**
 * Interface for performance test result
 */
export interface PerformanceTestResult {
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  concurrentUsers: number;
  endpoint: string;
}

/**
 * Interface for security test result
 */
export interface SecurityTestResult {
  name: string;
  category: string;
  status: DiagnosticTestStatus;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  remediation?: string;
}

/**
 * Interface for form validation test result
 */
export interface FormValidationTestResult {
  form: string;
  formName: string;
  location: string;
  status: DiagnosticTestStatus;
  message: string;
  fields?: {
    fieldName: string;
    fieldType: string;
    status: DiagnosticTestStatus;
    message: string;
  }[];
}

/**
 * Interface for icon test result
 */
export interface IconTestResult {
  name: string;
  icon: string;
  location: string;
  status: DiagnosticTestStatus;
  message: string;
}

/**
 * Interface for permission test result
 */
export interface PermissionTestResult {
  name: string;
  role: string;
  permission: string;
  status: DiagnosticTestStatus;
  message: string;
}

/**
 * Interface for role simulation test result
 */
export interface RoleSimulationTestResult {
  role: string;
  module: string;
  accessStatus: "granted" | "denied";
  status: DiagnosticTestStatus;
  message: string;
  expectedAccess: boolean;
}

/**
 * Interface for API integration test result
 */
export interface ApiIntegrationTestResult {
  id?: string; // Add ID field for easier reference
  service: string;
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  message: string;
  authStatus: "valid" | "invalid" | "expired" | "missing";
  url?: string; // Added for consistency with ApiEndpointDiagnosticResult
  method?: string; // Added for consistency
  warningMessage?: string; // Added for better error handling
}
