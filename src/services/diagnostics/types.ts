
import { NavigationDiagnosticResult, LogLevel } from "@/types/diagnostics";

/**
 * Represents the outcome status of a diagnostic test.
 * 
 * - success: The test passed with no issues
 * - warning: The test passed but with potential concerns that should be addressed
 * - error: The test failed and requires immediate attention
 */
export type DiagnosticTestStatus = "success" | "warning" | "error";

/**
 * Represents the result of a navigation route test.
 * 
 * This extends the base NavigationDiagnosticResult interface to ensure compatibility
 * with existing navigation diagnostic systems.
 */
export interface NavigationTestResult extends NavigationDiagnosticResult {
  // This extends NavigationDiagnosticResult to ensure compatibility
}

/**
 * Represents the result of a permission test.
 * 
 * These tests verify that users with specific roles have appropriate
 * access to resources according to the application's permission model.
 */
export interface PermissionTestResult {
  /** The name of the permission test */
  name: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** The user role being tested */
  role?: string;
  
  /** The resource being accessed */
  resource?: string;
  
  /** Whether the role should have access to the resource */
  expected?: boolean;
  
  /** Whether the role actually has access to the resource */
  actual?: boolean;
  
  /** Legacy field for compatibility */
  permission?: string;
}

/**
 * Represents the result of an API integration test.
 * 
 * These tests verify connectivity to external APIs and services,
 * including authentication, response times, and data validity.
 */
export interface ApiIntegrationTestResult {
  /** The API endpoint being tested */
  endpoint: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** The time taken for the API to respond (ms) */
  responseTime?: number;
  
  /** The HTTP status code returned by the API */
  statusCode?: number;
  
  /** Details of any errors encountered */
  errorDetails?: string;
  
  /** The name of the service providing the API */
  service?: string;
  
  /** The status of authentication with the API */
  authStatus?: string;
  
  /** A specific error code returned by the API */
  errorCode?: string;
  
  /** Whether the issue can be automatically fixed */
  canAutoFix?: boolean;
  
  /** A URL to documentation about the API */
  documentationUrl?: string;
  
  /** Documentation about the API or error */
  documentation?: string;
  
  /** Instructions for fixing the issue */
  fixMessage?: string;
  
  /** When the API was last checked or updated */
  lastUpdated?: string;
}

/**
 * Represents the result of a form validation test.
 * 
 * These tests verify that forms correctly validate input data
 * according to the application's business rules.
 */
export interface FormValidationTestResult {
  /** The name or ID of the form being tested */
  form: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** Specific validation issues found in the form */
  issues?: {
    field: string;
    error: string;
  }[];
  
  /** Legacy field for compatibility */
  formName?: string;
  
  /** Legacy field for compatibility */
  location?: string;
  
  /** Legacy field for compatibility */
  fields?: any[];
}

/**
 * Represents the result of an icon test.
 * 
 * These tests verify that icons render correctly throughout the application.
 */
export interface IconTestResult {
  /** The name of the icon being tested */
  name: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** Whether the icon was successfully rendered */
  rendered?: boolean;
  
  /** The name or ID of the icon */
  icon?: string;
  
  /** Legacy field for compatibility */
  location?: string;
}

/**
 * Represents the result of a role simulation test.
 * 
 * These tests simulate different user roles to verify that
 * access controls function correctly across the application.
 */
export interface RoleSimulationTestResult {
  /** The user role being simulated */
  role: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** Individual access tests performed for this role */
  accessTests?: {
    resource: string;
    expected: boolean;
    actual: boolean;
  }[];
  
  /** The module being tested */
  module?: string;
  
  /** Legacy field for compatibility */
  accessStatus?: string;
  
  /** Legacy field for compatibility */
  expectedAccess?: boolean;
}

/**
 * Represents the result of a performance test.
 * 
 * These tests measure and evaluate various performance metrics
 * to ensure the application meets performance requirements.
 */
export interface PerformanceTestResult {
  /** The name of the performance test */
  name: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** Performance metrics collected during the test */
  metrics?: {
    loadTime?: number;
    renderTime?: number;
    memoryUsage?: number;
    responseTime?: number;
  };
  
  /** Recommendations for improving performance */
  recommendation?: string;
  
  /** Legacy field for compatibility */
  responseTime?: number;
  
  /** Legacy field for compatibility */
  memoryUsage?: number;
  
  /** Legacy field for compatibility */
  cpuUsage?: number;
  
  /** Legacy field for compatibility */
  concurrentUsers?: number;
  
  /** Legacy field for compatibility */
  endpoint?: string;
}

/**
 * Represents the result of a security test.
 * 
 * These tests check for potential security vulnerabilities
 * and ensure the application follows security best practices.
 */
export interface SecurityTestResult {
  /** The name of the security test */
  name: string;
  
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** The severity of the security issue if one was found */
  severity?: "low" | "medium" | "high" | "critical";
  
  /** Detailed information about the security issue */
  details?: string;
  
  /** Recommendations for addressing the security issue */
  recommendation?: string;
  
  /** The category of the security test */
  category?: string;
  
  /** Instructions for remediating the security issue */
  remediation?: string;
}

/**
 * Represents a basic diagnostic result.
 * 
 * Used for simple pass/fail tests that don't require
 * the more detailed information of specific test types.
 */
export interface DiagnosticResult {
  /** The outcome of the test */
  status: DiagnosticTestStatus;
  
  /** A human-readable description of the test result */
  message: string;
  
  /** Legacy field for compatibility */
  details?: string;
}

/**
 * Alias for PermissionTestResult for backward compatibility.
 */
export type PermissionsTestResult = PermissionTestResult;
