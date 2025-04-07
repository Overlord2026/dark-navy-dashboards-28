
// Re-export all diagnostics types from their respective files
export * from './navigation';
export * from './forms';
export * from './icons';
export * from './performance';
export * from './security';
export * from './api';
export * from './accessibility';
export * from './logging';

// Export everything from common EXCEPT Recommendation (to avoid ambiguity)
export type {
  DiagnosticTestStatus,
  DiagnosticResult,
  DiagnosticSummary
} from './common';

// Explicitly export Recommendation from recommendations.ts
export * from './recommendations';
