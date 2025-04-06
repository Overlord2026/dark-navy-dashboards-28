// Diagnostics types
export interface DiagnosticResult {
  name: string;
  description: string;
  status: "success" | "warning" | "error";
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

export interface FormField {
  name: string;
  type: string;
  required?: boolean;
  validations?: string[];
  value?: any;
  errors?: string[];
  valid?: boolean;
}

// API performance monitoring types
export interface ApiPerformanceResult {
  endpoint: string;
  responseTime: number;
  status: "success" | "warning" | "error";
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
