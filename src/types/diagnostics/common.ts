
export enum DiagnosticTestStatus {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
}

export interface Recommendation {
  id: string;
  title?: string;
  text?: string;
  priority: "high" | "medium" | "low";
  description?: string;
  actionable: boolean;
  action?: string;
}

export interface QuickFix {
  id: string;
  title: string;
  description: string;
  area: string;
  severity: "high" | "medium" | "low";
  category: string;
  actionable: boolean;
}

export interface FixHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  area: string;
  severity: "high" | "medium" | "low";
  description: string;
  status: "success" | "failed" | "pending";
}
