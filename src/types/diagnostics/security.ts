
import { DiagnosticTestStatus } from './common';

export interface SecurityTestResult {
  id: string;
  name: string;
  category?: string;
  status: DiagnosticTestStatus;
  message: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
  remediation?: string;
  timestamp: number;
}

export interface PermissionTestResult {
  id: string;
  name?: string;
  status: DiagnosticTestStatus;
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
  module?: string;
  status: DiagnosticTestStatus;
  action: string;
  expected: boolean;
  actual: boolean;
  message: string;
  timestamp: number;
  details?: any;
}
