
// Types for diagnostic results
export type DiagnosticTestStatus = 'success' | 'warning' | 'error';

export interface DiagnosticResult {
  status: DiagnosticTestStatus;
  message: string;
  details?: string;
}

export interface DiagnosticTestResult {
  name?: string;
  status: DiagnosticTestStatus;
  message: string;
}

export interface NavigationTestResult {
  route: string;
  status: DiagnosticTestStatus;
  message: string;
}

export interface PermissionsTestResult {
  role: string;
  permission: string;
  status: DiagnosticTestStatus;
  message: string;
}

export interface IconTestResult {
  icon: string;
  location: string;
  status: DiagnosticTestStatus;
  message: string;
}

export interface FormFieldTestResult {
  fieldName: string;
  fieldType: string;
  status: DiagnosticTestStatus;
  message: string;
}

export interface FormValidationTestResult {
  formName: string;
  location: string;
  status: DiagnosticTestStatus;
  message: string;
  fields?: FormFieldTestResult[];
}

export interface ApiIntegrationTestResult {
  service: string;
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  message: string;
  authStatus?: 'valid' | 'expired' | 'invalid' | 'not_tested';
}

export interface RoleSimulationTestResult {
  role: string;
  module: string;
  accessStatus: 'granted' | 'denied' | 'error';
  status: DiagnosticTestStatus;
  message: string;
  expectedAccess: boolean;
}

export interface PerformanceTestResult extends DiagnosticTestResult {
  responseTime?: number; // in ms
  memoryUsage?: number; // in MB
  cpuUsage?: number; // percentage
  concurrentUsers?: number;
  endpoint?: string;
}

export interface SecurityTestResult extends DiagnosticTestResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'data-protection' | 'authorization' | 'file-security' | 'input-validation';
  remediation?: string;
}

export interface SystemHealthReport {
  navigation: DiagnosticResult;
  forms: DiagnosticResult;
  database: DiagnosticResult;
  api: DiagnosticResult;
  authentication: DiagnosticResult;
  navigationTests: NavigationTestResult[];
  permissionsTests: PermissionsTestResult[];
  iconTests: IconTestResult[];
  formValidationTests: FormValidationTestResult[];
  apiIntegrationTests: ApiIntegrationTestResult[];
  roleSimulationTests: RoleSimulationTestResult[];
  performanceTests: PerformanceTestResult[];
  securityTests: SecurityTestResult[];
  overall: DiagnosticTestStatus;
  timestamp: string;
}

// Logging system types
export type LogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
  source?: string;
  stackTrace?: string;
}

export interface LogConfig {
  minLevel: LogLevel;
  retentionPeriod: number; // in days
  maxEntries?: number;
  enableRealTimeAlerts: boolean;
  alertThreshold: {
    critical: number; // Number of critical errors to trigger alert
    error: number;    // Number of errors to trigger alert
    timeWindow: number; // Time window in minutes
  };
}
