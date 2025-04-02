
export type DiagnosticTestStatus = "success" | "warning" | "error" | "unknown";

export interface DiagnosticResult {
  status: DiagnosticTestStatus;
  message: string;
  details?: string;
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

export interface FormValidationTestResult {
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

export interface ApiIntegrationTestResult {
  service: string;
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  message: string;
  authStatus?: string;
}

export interface RoleSimulationTestResult {
  role: string;
  module: string;
  accessStatus: string;
  status: DiagnosticTestStatus;
  message: string;
  expectedAccess: boolean;
}

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

export interface SecurityTestResult {
  name: string;
  category: string;
  status: DiagnosticTestStatus;
  message: string;
  severity: string;
  remediation?: string;
}
