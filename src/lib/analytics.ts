// src/lib/analytics.ts
export type AnalyticsProps = Record<string, any>;

export interface FamilyOfficeAnalytics {
  track: (event: string, props?: AnalyticsProps) => void;
  page: (name?: string, props?: AnalyticsProps) => void;
  identify: (userId: string, traits?: AnalyticsProps) => void;
  group?: (groupId: string, traits?: AnalyticsProps) => void;
  // Backward compatibility - all these alias to track()
  trackEvent?: (event: string, props?: AnalyticsProps) => void;
  trackPageView?: (page: string, props?: AnalyticsProps) => void;
  trackViralShare?: (props?: AnalyticsProps) => void;
  trackPersonaClaim?: (props?: AnalyticsProps) => void;
  trackOnboardingStep?: (props?: AnalyticsProps) => void;
  trackOnboardingStart?: (props?: AnalyticsProps) => void;
  trackFeatureUsage?: (props?: AnalyticsProps) => void;
  trackConversion?: (props?: AnalyticsProps) => void;
  trackSecurityEvent?: (props?: AnalyticsProps) => void;
  trackFAQUsage?: (props?: AnalyticsProps) => void;
  trackShareClick?: (props?: AnalyticsProps) => void;
  trackShareSuccess?: (props?: AnalyticsProps) => void;
  trackFamilyTabView?: (props?: AnalyticsProps) => void;
  trackFamilyQuickAction?: (props?: AnalyticsProps) => void;
  trackToolCardOpen?: (props?: AnalyticsProps) => void;
  trackFamilySegmentSelection?: (props?: AnalyticsProps) => void;
  trackFamilyGoalsSelection?: (props?: AnalyticsProps) => void;
  trackFamilyOnboardingComplete?: (props?: AnalyticsProps) => void;
  trackFamilyOnboardingStart?: (props?: AnalyticsProps) => void;
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
  const addAlias = (methodName: string) => {
    (client as any)[methodName] = (e: any, p?: any) => client.track(methodName.replace('track', '').toLowerCase(), { event: e, ...p });
  };
  
  addAlias('trackEvent');
  addAlias('trackPageView');
  addAlias('trackViralShare');
  addAlias('trackPersonaClaim');
  addAlias('trackOnboardingStep');
  addAlias('trackOnboardingStart');
  addAlias('trackFeatureUsage');
  addAlias('trackConversion');
  addAlias('trackSecurityEvent');
  addAlias('trackFAQUsage');
  addAlias('trackShareClick');
  addAlias('trackShareSuccess');
  addAlias('trackFamilyTabView');
  addAlias('trackFamilyQuickAction');
  addAlias('trackToolCardOpen');
  addAlias('trackFamilySegmentSelection');
  addAlias('trackFamilyGoalsSelection');
  addAlias('trackFamilyOnboardingComplete');
  addAlias('trackFamilyOnboardingStart');
  
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

// Export BOTH default and named so all imports compile
export { analytics };
export default analytics;