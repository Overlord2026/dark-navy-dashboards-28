
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  id: string;
  status: DiagnosticTestStatus;
  message: string;
  route?: string;
  details?: any;
  timestamp?: string | number;
}

export interface Recommendation {
  id?: string;
  text: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  action?: string | { label: string; } | (() => Promise<void>);
  category?: string;
  description?: string;
  effort?: string;
  impact?: string;
}

export interface DiagnosticModule {
  id: string;
  name: string;
  description: string;
  run: () => Promise<DiagnosticResult[]>;
}
