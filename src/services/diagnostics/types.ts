
// Types for diagnostic results
export interface DiagnosticResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface NavigationTestResult {
  route: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface PermissionsTestResult {
  role: string;
  permission: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface IconTestResult {
  icon: string;
  location: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface FormFieldTestResult {
  fieldName: string;
  fieldType: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface FormValidationTestResult {
  formName: string;
  location: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  fields?: FormFieldTestResult[];
}

export interface ApiIntegrationTestResult {
  service: string;
  endpoint: string;
  responseTime: number;
  status: 'success' | 'warning' | 'error';
  message: string;
  authStatus?: 'valid' | 'expired' | 'invalid' | 'not_tested';
}

export interface RoleSimulationTestResult {
  role: string;
  module: string;
  accessStatus: 'granted' | 'denied' | 'error';
  status: 'success' | 'warning' | 'error';
  message: string;
  expectedAccess: boolean;
}

export interface SystemHealthReport {
  navigation: DiagnosticResult;
  forms: DiagnosticResult;
  database: DiagnosticResult;
  api: DiagnosticResult;
  authentication: DiagnosticResult;
  navigationTests: NavigationTestResult[];
  permissionsTests: PermissionsTestResult[];
  iconTests: IconTestResult[];
  formValidationTests: FormValidationTestResult[];
  apiIntegrationTests: ApiIntegrationTestResult[];
  roleSimulationTests: RoleSimulationTestResult[];
  overall: 'healthy' | 'warning' | 'critical';
  timestamp: string;
}
