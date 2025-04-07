
export type LogLevel = "info" | "warning" | "error" | "debug" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  details?: string;
}
