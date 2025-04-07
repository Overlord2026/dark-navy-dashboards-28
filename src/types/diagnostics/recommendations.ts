
export interface QuickFix {
  id: string;
  title: string;
  description: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: "critical" | "high" | "medium" | "low";
  category: "reliability" | "security" | "performance" | "usability";
  actionable?: boolean;
}

export interface FixHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Recommendation {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'reliability' | 'usability';
  actionable: boolean;
  action?: string | { label: string; };
  effort?: string;
  impact?: string;
  description?: string;
}
