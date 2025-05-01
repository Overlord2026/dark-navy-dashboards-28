
import { DiagnosticTestStatus } from './common';

export type LogLevel = "error" | "warning" | "info" | "debug" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  details?: string | Record<string, any>;
}
