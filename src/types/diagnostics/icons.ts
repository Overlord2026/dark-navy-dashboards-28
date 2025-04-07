
import { DiagnosticTestStatus } from './common';

export interface IconTestResult {
  id: string;
  name?: string;
  icon?: string;
  location?: string;
  iconName?: string;
  status: DiagnosticTestStatus;
  message: string;
  iconType: string;
  renderOutput?: string;
  renderTime?: number;
  timestamp: number;
}
