
/**
 * Types for API diagnostics and testing
 */

// Common diagnostic status for all test types
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  id: string;
  timestamp: string;
  category: string;
  status: DiagnosticTestStatus;
  message: string;
  details?: any;
  name?: string;
  description?: string;
  route?: string;
}

export interface ApiIntegrationTestResult {
  id: string;
  service: string;
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  message: string;
  authStatus: 'valid' | 'invalid' | 'expired';
}

export interface ApiEndpointPerformance {
  endpoint: string;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  callVolume: number;
  lastChecked: string;
}

export interface ApiServiceHealth {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  lastIncident?: {
    time: string;
    message: string;
  };
  uptime: number;
  responseTime: number;
}

export interface ApiSecurityVulnerability {
  id: string;
  endpoint: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  remediation: string;
  discoveredAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}

// Navigation test result
export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  name: string;
  message: string;
  responseTime?: number;
  details?: any;
}

// Form validation test result
export interface FormValidationTestResult {
  formId: string;
  status: DiagnosticTestStatus;
  success: boolean;
  message: string;
  timestamp: string;
  fields?: Array<{
    name: string;
    type: string;
    errors?: string[];
    validations?: string[];
  }>;
  validationDetails?: {
    invalidFields?: string[];
    unexpectedErrors?: string[];
    missingErrors?: string[];
  };
}

// Performance test result
export interface PerformanceTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  responseTime: number;
  threshold: number;
  message: string;
  timestamp: string;
}

