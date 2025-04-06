export interface NavigationTestResult {
  id: string;
  route: string;
  status: "success" | "warning" | "error";
  message?: string; // Make optional to match actual usage
  timestamp: number;
  recommendations?: (string | Recommendation)[]; // Support both string and object recommendations
  details?: any;
}

export interface FormField {
  id: string;
  name: string;
  fieldName?: string; // Added for compatibility with existing components
  type: "text" | "email" | "password" | "number" | "date" | "select" | "checkbox" | "radio";
  validations: string[];
  value: string;
  status: "success" | "warning" | "error";
  message?: string;
}

export interface FormValidationTestResult {
  id: string;
  name: string;
  form?: string; // Added for compatibility with existing components
  status: "success" | "warning" | "error";
  fields: FormField[];
  message?: string;
  timestamp: number;
}

export interface IconTestResult {
  id: string;
  name?: string; // Added for compatibility with existing components
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
  concurrentUsers?: number; // Added for compatibility with existing components
  cpuUsage?: number;
  memoryUsage?: number;
  timestamp: number;
  details?: any;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  category?: string; // Added for compatibility with existing components
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
  remediation?: string;
  timestamp: number;
}

export interface PermissionTestResult {
  id: string;
  name?: string; // Added for compatibility with existing components
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
  module?: string; // Added for compatibility with existing components
  status: "success" | "warning" | "error";
  action: string;
  expected: boolean;
  actual: boolean;
  message: string;
  timestamp: number;
  details?: any;
}

export interface ApiEndpointDiagnosticResult {
  id?: string; // Make optional to match implementation
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "success" | "warning" | "error";
  responseTime: number;
  responseStatus?: number;
  errorMessage?: string;
  warningMessage?: string; // Added for compatibility with existing components
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

// Add NavigationDiagnosticResult as an alias to NavigationTestResult
export type NavigationDiagnosticResult = NavigationTestResult;

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
  url?: string; // Added for compatibility with components
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
  action?: string | { label: string; }; // Support both string and object with label
  effort?: string; // Added for compatibility
  impact?: string; // Added for compatibility
  description?: string; // Added for compatibility with RecommendationItem
}
