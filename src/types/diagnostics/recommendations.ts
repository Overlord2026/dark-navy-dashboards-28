
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
