// Unified analytics exports
export type { BfoEvent } from '../bfoAnalytics';
export { track as trackBfo } from '../bfoAnalytics';
export { track as trackGeneric } from './track';

// Re-export the main track function as default
export { track } from './track';