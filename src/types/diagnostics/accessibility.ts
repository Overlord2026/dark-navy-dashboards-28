
export interface AccessibilityAuditResult {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description?: string;
  elements: string[];
  helpUrl?: string;
  rule?: string;
  message?: string;
  element?: string;
  recommendation?: string;
  url?: string;
}
