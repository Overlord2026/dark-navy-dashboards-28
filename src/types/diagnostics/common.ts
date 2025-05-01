
export type DiagnosticTestStatus = "success" | "warning" | "error";

export interface DiagnosticResult {
  id?: string;
  name: string;
  description?: string;
  status: DiagnosticTestStatus;
  message?: string;
  details?: any;
  timestamp?: number;
  route?: string;
  recommendations?: (string | Recommendation)[];
}

export interface DiagnosticSummary {
  overall: DiagnosticTestStatus;
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
}

// Forward declaration for Recommendation which is defined in recommendations.ts
// This is needed to avoid circular imports
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
