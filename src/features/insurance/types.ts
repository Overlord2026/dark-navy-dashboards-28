export type SuitabilityDecision = 'approve' | 'deny' | 'review_required';

export interface SuitabilityAnalysis {
  decision: SuitabilityDecision;
  score: number;
  reasons: string[];
  timestamp: string;
}