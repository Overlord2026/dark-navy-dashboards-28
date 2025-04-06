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
  route: string;
  status: "success" | "warning" | "error";
  message?: string;
  recommendations?: Recommendation[];
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

export interface ApiEndpointDiagnosticResult {
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
