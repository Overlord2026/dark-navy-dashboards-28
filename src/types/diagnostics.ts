
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
  fieldName?: string; // Added for backward compatibility
  fieldType?: string; // Added for backward compatibility
  status?: string;    // Added for backward compatibility
  message?: string;   // Added for backward compatibility
}

export interface FormValidationTestResult {
  id: string;
  formName: string;
  form?: string;      // Added for backward compatibility
  formComponent?: string;
  location: string;
  status: "success" | "warning" | "error";
  message?: string;
  timestamp: number;
  fields?: FormField[];
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
  concurrentUsers?: number; // Added for backward compatibility
}

export interface SecurityTestResult {
  id: string;
  name: string;
  status: "success" | "warning" | "error";
  severity: "critical" | "high" | "medium" | "low";
  message?: string;
  remediation?: string;
  details?: any;
  category?: string;  // Added for backward compatibility
}

export interface IconTestResult {
  id: string;
  icon: string;
  name?: string;      // Added for backward compatibility
  location: string;
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
  renderTime?: number;
}

export interface PermissionTestResult {
  id: string;
  role: string;
  permission: string;
  name?: string;      // Added for backward compatibility
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
}

export interface RoleSimulationTestResult {
  id: string;
  role: string;
  action: string;
  module?: string;    // Added for backward compatibility
  accessStatus?: string; // Added for backward compatibility
  expectedAccess?: boolean; // Added for backward compatibility
  status: "success" | "warning" | "error";
  message?: string;
  details?: any;
}
