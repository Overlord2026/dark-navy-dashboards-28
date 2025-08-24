// src/lib/analytics.ts
export type AnalyticsProps = Record<string, any>;

export interface FamilyOfficeAnalytics {
  track: (event: string, props?: AnalyticsProps) => void;
  page: (name?: string, props?: AnalyticsProps) => void;
  identify: (userId: string, traits?: AnalyticsProps) => void;
  group?: (groupId: string, traits?: AnalyticsProps) => void;
  // Backward compatibility
  trackEvent?: (event: string, props?: AnalyticsProps) => void;
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
  // alias for legacy callers
  client.trackEvent = (e, p) => client.track(e, p);
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

// Legacy export helpers for backward compatibility
export function trackExportClick(format: string) {
  analytics.track('export.click', { format });
}

export function trackPageView(page: string, props?: AnalyticsProps) {
  analytics.track('page.view', { page, ...props });
}

// Export BOTH default and named so all imports compile
export { analytics };
export default analytics;