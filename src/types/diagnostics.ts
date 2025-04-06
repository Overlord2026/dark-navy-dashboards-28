
export type LogLevel = "error" | "warning" | "info" | "debug" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  details?: string;
  related?: {
    component?: string;
    file?: string;
    line?: number;
    stackTrace?: string;
    route?: string;
    navigationTab?: string;
    apiEndpoint?: string;
  };
  recommendations?: string[] | Recommendation[];
}

export interface DiagnosticResult {
  id: string;
  route: string;
  status: "success" | "warning" | "error";
  message?: string;
  recommendations?: Recommendation[];
  timestamp?: number;
}

export interface NavigationDiagnosticResult extends DiagnosticResult {
  componentStatus?: {
    rendered: boolean;
    loadTime?: number;
    errors?: string[];
  };
  apiStatus?: {
    endpoint: string;
    status: "success" | "warning" | "error";
    responseTime?: number;
    errorMessage?: string;
  }[];
  consoleErrors?: string[];
}

export interface NavigationTestResult extends DiagnosticResult {
  id: string;
  route: string;
  timestamp: number;
  recommendations?: Recommendation[];
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
  warningMessage?: string;
  expectedDataStructure?: string;
  schemaValidation?: {
    expected: any;
    actual: any;
    valid: boolean;
    errors?: string[];
  };
}

export interface DiagnosticSummary {
  overall: "success" | "warning" | "error";
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
  recommendations?: Recommendation[];
}

export interface QuickFix {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'security' | 'accessibility' | 'reliability' | 'usability';
  fixFunction?: () => void;
}

export interface FixHistoryEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  severity: string;
}

export interface Recommendation {
  id: string;
  text: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'security' | 'accessibility' | 'reliability' | 'usability';
  actionable: boolean;
  action?: {
    label: string;
    handler?: string;
  };
  relatedTest?: string;
  impact?: string;
  effort?: 'easy' | 'medium' | 'hard';
}

export interface FormField {
  name: string;
  type: string;
  required?: boolean;
  validations?: string[];
  value?: any;
  errors?: string[];
  valid?: boolean;
  // Added for backward compatibility
  fieldName?: string;
  fieldType?: string;
  status?: string;
  message?: string;
}

export interface FormValidationTestResult {
  id: string;
  formName: string;
  formComponent?: string;
  location: string;
  status: "success" | "warning" | "error";
  message?: string;
  timestamp: number;
  fields?: FormField[];
  // Added for backward compatibility
  form?: string;
  success?: boolean;
  validationDetails?: {
    invalidFields?: string[];
    missingErrors?: string[];
    unexpectedErrors?: string[];
  };
}

export interface PerformanceTestResult {
  id: string;
  name: string;
  status: "success" | "warning" | "error";
  responseTime: number;
  cpuUsage?: number;
  memoryUsage?: number;
  message?: string;
  details?: any;
  // Added for backward compatibility
  concurrentUsers?: number;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  status: "success" | "warning" | "error";
  severity: "critical" | "high" | "medium" | "low";
  message?: string;
  remediation?: string;
  details?: any;
  // Added for backward compatibility
  category?: string;
}

export interface IconTestResult {
  id: string;
  icon: string;
  location: string;
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
  renderTime?: number;
  // Added for backward compatibility
  name?: string;
  iconName?: string;
}

export interface PermissionTestResult {
  id: string;
  role: string;
  permission: string;
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
  // Added for backward compatibility
  name?: string;
}

export interface RoleSimulationTestResult {
  id: string;
  role: string;
  action: string;
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
  // Added for backward compatibility
  module?: string;
  accessStatus?: string;
  expectedAccess?: boolean;
}

export interface ApiIntegrationTestResult {
  id: string;
  service: string;
  endpoint: string;
  url?: string;
  method?: string;
  status: "success" | "warning" | "error";
  responseTime?: number;
  responseStatus?: number;
  message?: string;
  errorMessage?: string;
  warningMessage?: string;
  authStatus?: string;
  expectedDataStructure?: string;
  details?: any;
}

// Add audit event type for accessibility audits
export type AuditEventType = "user_action" | "system_event" | "security_event" | "accessibility_audit";

// Update AccessibilityAuditResult interface to make element optional
export interface AccessibilityAuditResult {
  id: string;
  url: string;
  element: string | null;
  rule: string;
  message: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  status: 'failed' | 'passed' | 'incomplete';
  category: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  helpUrl: string;
  timestamp: number;
  code?: string;
  selector?: string;
  recommendation?: string;
}
