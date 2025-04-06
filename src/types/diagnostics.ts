export interface NavigationTestResult {
  id: string;
  route: string;
  status: "success" | "warning" | "error";
  message: string;
  timestamp: number;
  recommendations?: string[];
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
  status: "success" | "warning" | "error";
  message: string;
  iconType: string;
  renderOutput?: string;
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
  timestamp: number;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  category?: string; // Added for compatibility
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
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
}

export interface ApiEndpointDiagnosticResult {
  id: string; // Added for compatibility
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "success" | "warning" | "error";
  responseTime: number;
  responseStatus?: number;
  errorMessage?: string;
  expectedDataStructure: string;
  schemaValidation: {
    valid: boolean;
    expected: any;
    actual: any;
    errors: string[];
  };
}
