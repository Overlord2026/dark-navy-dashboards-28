
// Import the types we need from common
import { DiagnosticTestStatus } from './common';

// Define the Recommendation interface (moved from common.ts to avoid circular dependencies)
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

// Add any additional recommendation-specific types here
export interface RecommendationList {
  items: Recommendation[];
  count: number;
  lastUpdated: string;
}

export interface DiagnosticRecommendation extends Recommendation {
  source: string;
  testId?: string;
  status: DiagnosticTestStatus;
}

// QuickFix type definition
export interface QuickFix {
  id: string;
  title: string;
  description: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: "critical" | "high" | "medium" | "low";
  category: "reliability" | "security" | "performance" | "usability";
  actionable?: boolean;
}

// FixHistoryEntry type definition
export interface FixHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
  severity: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
}
