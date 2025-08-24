// Unified analytics exports
export type { BfoEvent } from '../bfoAnalytics';
export { track as trackBfo } from '../bfoAnalytics';
export { track as trackGeneric } from './track';

// Re-export the main track function as default
export { track } from './track';

// Export analytics object and default for compatibility
export { analytics, default } from './compatibility';