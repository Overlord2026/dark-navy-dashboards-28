
import { DiagnosticTestStatus } from './common';

export interface SecurityTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  component?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface PermissionTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  permission: string;
  role: string;
  details?: any;
}

export interface RoleSimulationTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  timestamp: string;
  role: string;
  feature: string;
  details?: any;
}
