
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  id: string;
  status: DiagnosticTestStatus;
  message: string;
  details?: any;
  timestamp?: number;
}

export interface Recommendation {
  text: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  action?: () => Promise<void>;
}

export interface DiagnosticModule {
  id: string;
  name: string;
  description: string;
  run: () => Promise<DiagnosticResult[]>;
}
