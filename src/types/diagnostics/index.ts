
export * from './common';
export * from './navigation';
export * from './forms';
export * from './api';
export * from './security';
export * from './accessibility';
export * from './icons';
export * from './recommendations';
export * from './logs';

// Define additional types used across the application
export interface DiagnosticSummary {
  overall: DiagnosticTestStatus;
  total: number;
  success: number;
  warnings: number;
  errors: number;
  timestamp: string;
}
