// Diagnostics types
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  name: string;
  description: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
}

// Audit Log types
export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  status: "success" | "failed";
  resourceType: string;
  resourceId?: string;
  details?: any;
}

// System Health types
export interface SystemHealthResult {
  component: string;
  status: "healthy" | "warning" | "error";
  details?: any;
  lastCheckTime: number;
  message?: string;
}

// Form validation diagnostics types
export interface FormValidationTest {
  id: string;
  formName: string;
  formComponent: string;
  location: string;
  testCases: FormTestCase[];
  message?: string;
}

export interface FormTestCase {
  name: string;
  data: Record<string, any>;
  expectedValid: boolean;
  expectedErrors?: Record<string, string>;
}

export interface FormTestResult {
  formId: string;
  formName: string;
  success: boolean;
  location: string;
  timestamp: number;
  message?: string;
  fields?: FormField[];
  validationDetails?: {
    valid: boolean;
    invalidFields: string[];
    unexpectedErrors: string[];
    missingErrors: string[];
  };
}

export interface FormValidationTestResult extends FormTestResult {
  id: string;
  name: string; // Added this field to match what components expect
  status: DiagnosticTestStatus;
}

export interface FormField {
  name: string;
  type: string;
  required?: boolean;
  validations?: string[];
  value?: any;
  errors?: string[];
  valid?: boolean;
  fieldName?: string;
  fieldType?: string;
  status?: DiagnosticTestStatus;
  message?: string;
}

// API performance monitoring types
export interface ApiPerformanceResult {
  endpoint: string;
  responseTime: number;
  status: DiagnosticTestStatus;
  timestamp: number;
  details?: any;
}

// Navigation health types
export interface NavigationHealthResult {
  link: string;
  status: "ok" | "broken" | "warning";
  message?: string;
  details?: any;
}

// Test Result interfaces for different test types
export interface NavigationTestResult {
  id: string;
  route: string;
  status: DiagnosticTestStatus;
  message?: string;
  timestamp: number;
  details?: any;
}

export interface PermissionTestResult {
  id: string;
  role: string;
  permission: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
}

export interface RoleSimulationTestResult {
  id: string;
  role: string;
  action: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  severity: "critical" | "high" | "medium" | "low";
  message?: string;
  remediation?: string;
  details?: any;
}

export interface PerformanceTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  responseTime: number;
  cpuUsage?: number;
  memoryUsage?: number;
  message?: string;
  details?: any;
}

export interface IconTestResult {
  id: string;
  iconName: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
  renderTime?: number;
}

export interface ApiIntegrationTestResult {
  id: string;
  service: string;
  endpoint: string;
  url?: string;
  method?: string;
  status: DiagnosticTestStatus;
  responseTime?: number;
  responseStatus?: number;
  message?: string;
  errorMessage?: string;
  warningMessage?: string;
  authStatus?: string;
  expectedDataStructure?: string;
  details?: any;
}
