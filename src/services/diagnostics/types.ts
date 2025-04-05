
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
