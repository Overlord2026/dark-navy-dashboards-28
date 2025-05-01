
// Re-export from other diagnostic modules
export * from './common';
export * from './navigation';
export * from './forms';
export * from './api';
export * from './security';
export * from './accessibility';
export * from './icons';
// Re-export recommendations without the conflicting type
export * from './logs';
// Export specific named exports from recommendations to avoid conflicts
export { 
  RecommendationList, 
  DiagnosticRecommendation, 
  QuickFix, 
  FixHistoryEntry 
} from './recommendations';

// Define additional types used across the application
export interface DiagnosticSummary {
  overall: import('./common').DiagnosticTestStatus;
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
}
