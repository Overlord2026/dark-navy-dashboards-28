
export interface NavigationTestResult {
  id: string;
  route: string;
  status: "success" | "warning" | "error";
  message: string;
  timestamp: number;
  recommendations?: string[];
  details?: any;
}

export interface FormField {
  id: string;
  name: string;
  fieldName?: string; // Added for compatibility
  type: "text" | "email" | "password" | "number" | "date" | "select" | "checkbox" | "radio";
  validations: string[];
  value: string;
  status: "success" | "warning" | "error";
  message?: string;
}

export interface FormValidationTestResult {
  id: string;
  name: string;
  form?: string; // Added for compatibility
  status: "success" | "warning" | "error";
  fields: FormField[];
  message?: string;
  timestamp: number;
}

export interface IconTestResult {
  id: string;
  name?: string; // Added for compatibility
  iconName?: string;
  status: "success" | "warning" | "error";
  message: string;
  iconType: string;
  renderOutput?: string;
  renderTime?: number;
  timestamp: number;
}

export interface PerformanceTestResult {
  id: string;
  name: string;
  status: "success" | "warning" | "error";
  message: string;
  responseTime: number;
  threshold: number;
  concurrentUsers?: number; // Added for compatibility
  cpuUsage?: number;
  memoryUsage?: number;
  timestamp: number;
  details?: any;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  category?: string; // Added for compatibility
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
  remediation?: string;
  timestamp: number;
}

export interface PermissionTestResult {
  id: string;
  name?: string; // Added for compatibility
  status: "success" | "warning" | "error";
  message: string;
  permission: string;
  expected: boolean;
  actual: boolean;
  timestamp: number;
  role?: string;
  details?: any;
}

export interface RoleSimulationTestResult {
  id: string;
  role: string;
  module?: string; // Added for compatibility
  status: "success" | "warning" | "error";
  action: string;
  expected: boolean;
  actual: boolean;
  message: string;
  timestamp: number;
  details?: any;
}

export interface ApiEndpointDiagnosticResult {
  id: string; 
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "success" | "warning" | "error";
  responseTime: number;
  responseStatus?: number;
  errorMessage?: string;
  warningMessage?: string; // Added for compatibility
  expectedDataStructure: string;
  schemaValidation: {
    valid: boolean;
    expected: any;
    actual: any;
    errors: string[];
  };
}

// Additional types needed
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  id?: string;
  name: string;
  description?: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
  timestamp?: number;
  route?: string;
}

export interface DiagnosticSummary {
  overall: DiagnosticTestStatus;
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
}

// Types for accessibility audit
export interface AccessibilityAuditResult {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description?: string;
  elements: string[];
  helpUrl?: string;
  rule?: string;
  message?: string;
  element?: string;
  recommendation?: string;
}

// Log entries
export type LogLevel = "info" | "warning" | "error" | "debug" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  details?: string;
}

// Quick fix and recommendations
export interface QuickFix {
  id: string;
  title: string;
  description: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: "critical" | "high" | "medium" | "low";
  category: "reliability" | "security" | "performance" | "usability";
  actionable?: boolean;
}

export interface FixHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Recommendation {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'reliability' | 'usability';
  actionable: boolean;
  action?: string;
}
