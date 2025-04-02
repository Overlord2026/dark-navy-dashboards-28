
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
  recommendations?: string[];
}

export interface NavigationDiagnosticResult {
  route: string;
  status: "success" | "warning" | "error";
  message: string;
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

export interface DiagnosticSummary {
  overall: "success" | "warning" | "error";
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
}
