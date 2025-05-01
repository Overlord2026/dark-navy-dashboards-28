
import { DiagnosticTestStatus } from './common';

export interface IconTestResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  iconName: string;
  timestamp: string;
  details?: any;
}
