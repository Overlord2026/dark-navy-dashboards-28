// src/lib/analytics.ts
export type AnalyticsProps = Record<string, any>;

export interface FamilyOfficeAnalytics {
  track: (event: string, props?: AnalyticsProps) => void;
  page: (name?: string, props?: AnalyticsProps) => void;
  identify: (userId: string, traits?: AnalyticsProps) => void;
  group?: (groupId: string, traits?: AnalyticsProps) => void;
  // Backward compatibility - all these alias to track()
  trackEvent?: (event: string, props?: AnalyticsProps) => void;
  trackPageView?: (event: string, props?: AnalyticsProps) => void;
  trackViralShare?: (event: string, props?: AnalyticsProps) => void;
  trackPersonaClaim?: (event: string, props?: AnalyticsProps) => void;
  trackOnboardingStep?: (event: string, props?: AnalyticsProps) => void;
  trackOnboardingStart?: (event: string, props?: AnalyticsProps) => void;
  trackFeatureUsage?: (event: string, props?: AnalyticsProps) => void;
  trackConversion?: (event: string, props?: AnalyticsProps) => void;
  trackSecurityEvent?: (event: string, props?: AnalyticsProps) => void;
  trackFAQUsage?: (event: string, props?: AnalyticsProps) => void;
  trackShareClick?: (event: string, props?: AnalyticsProps) => void;
  trackShareSuccess?: (event: string, props?: AnalyticsProps) => void;
  trackFamilyTabView?: (event: string, props?: AnalyticsProps) => void;
  trackFamilyQuickAction?: (event: string, props?: AnalyticsProps) => void;
  trackToolCardOpen?: (event: string, props?: AnalyticsProps) => void;
  trackFamilySegmentSelection?: (event: string, props?: AnalyticsProps) => void;
  trackFamilyGoalsSelection?: (event: string, props?: AnalyticsProps) => void;
  trackFamilyOnboardingComplete?: (event: string, props?: AnalyticsProps) => void;
  trackFamilyOnboardingStart?: (event: string, props?: AnalyticsProps) => void;
}

// Try to use a runtime client (Segment/Amplitude/etc.) if present, otherwise no-op.
function makeNoop(): FamilyOfficeAnalytics {
  const log = (...args: any[]) => {
    if (import.meta.env.DEV) console.debug('[analytics]', ...args);
  };
  const client: FamilyOfficeAnalytics = {
    track: (e, p) => log('track', e, p),
    page: (n, p) => log('page', n, p),
    identify: (id, t) => log('identify', id, t),
    group: (id, t) => log('group', id, t),
  };
  // Add all method aliases for legacy callers
  client.trackEvent = (e: string, p?: AnalyticsProps) => client.track(e, p);
  client.trackPageView = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackViralShare = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackPersonaClaim = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackOnboardingStep = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackOnboardingStart = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFeatureUsage = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackConversion = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackSecurityEvent = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFAQUsage = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackShareClick = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackShareSuccess = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilyTabView = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilyQuickAction = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackToolCardOpen = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilySegmentSelection = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilyGoalsSelection = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilyOnboardingComplete = (e: string, props?: AnalyticsProps) => client.track(e, props);
  client.trackFamilyOnboardingStart = (e: string, props?: AnalyticsProps) => client.track(e, props);
  
  return client;
}

function resolveRuntime(): FamilyOfficeAnalytics {
  // Common globals used by tag managers
  const w = (globalThis as any) || (window as any);
  const runtime: any =
    w?.analytics ||      // Segment style
    w?.ANALYTICS ||      // generic
    null;

  if (!runtime) return makeNoop();

  // Normalize: if runtime lacks trackEvent, alias it
  if (typeof runtime.trackEvent !== 'function' && typeof runtime.track === 'function') {
    runtime.trackEvent = (e: string, p?: AnalyticsProps) => runtime.track(e, p);
  }
  // Ensure required methods exist (fallback to noop if missing)
  ['track','page','identify'].forEach(fn => {
    if (typeof runtime[fn] !== 'function') runtime[fn] = (...args: any[]) => {};
  });
  return runtime as FamilyOfficeAnalytics;
}

const analytics: FamilyOfficeAnalytics = resolveRuntime();

// Optional helper for callers who prefer a function
export function track(event: string, props?: AnalyticsProps) {
  analytics.track(event, props);
}

/**
 * Standardized export event helper.
 * kind: 'csv' | 'zip' | 'pdf' | 'json' | 'other'
 * props: e.g., { toolKey, rows, bytes, persona }
 */
export function trackExportClick(
  kind: 'csv' | 'zip' | 'pdf' | 'json' | 'other',
  props?: AnalyticsProps
) {
  analytics.track('export.click', { kind, ...(props || {}) });
}

// Initialize analytics (no-op for shim)
export function initializeAnalytics() {
  // Analytics is already initialized via the resolveRuntime() call
  // This is just for compatibility with existing main.tsx
  if (import.meta.env.DEV) {
    console.debug('[analytics] Analytics initialized via shim');
  }
}

// Legacy export helpers for backward compatibility  
export function trackPageView(page: string, props?: AnalyticsProps) {
  analytics.track('page.view', { page, ...props });
}

// Export missing functions for compatibility
export function emitReceipt() { /* compatibility stub */ }
export function getReceipts() { /* compatibility stub */ }

// Export BOTH default and named so all imports compile
export { analytics };
export default analytics;