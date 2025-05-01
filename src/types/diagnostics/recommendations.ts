
export interface Recommendation {
  id: string;
  title?: string;
  text?: string;
  priority: "high" | "medium" | "low";
  description?: string;
  actionable: boolean;
  action?: string;
}
