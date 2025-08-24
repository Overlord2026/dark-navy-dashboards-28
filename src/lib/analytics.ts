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
  client.trackEvent = (e: string, p?: AnalyticsProps) => client.track(e, p);
  client.trackPageView = (page: string, props?: AnalyticsProps) => client.track('page_view', { page, ...props });
  client.trackViralShare = (props?: AnalyticsProps) => client.track('viral_share', props);
  client.trackPersonaClaim = (props?: AnalyticsProps) => client.track('persona_claim', props);
  client.trackOnboardingStep = (props?: AnalyticsProps) => client.track('onboarding_step', props);
  client.trackOnboardingStart = (props?: AnalyticsProps) => client.track('onboarding_start', props);
  client.trackFeatureUsage = (props?: AnalyticsProps) => client.track('feature_usage', props);
  client.trackConversion = (props?: AnalyticsProps) => client.track('conversion', props);
  client.trackSecurityEvent = (props?: AnalyticsProps) => client.track('security_event', props);
  client.trackFAQUsage = (props?: AnalyticsProps) => client.track('faq_usage', props);
  client.trackShareClick = (props?: AnalyticsProps) => client.track('share_click', props);
  client.trackShareSuccess = (props?: AnalyticsProps) => client.track('share_success', props);
  client.trackFamilyTabView = (props?: AnalyticsProps) => client.track('family_tab_view', props);
  client.trackFamilyQuickAction = (props?: AnalyticsProps) => client.track('family_quick_action', props);
  client.trackToolCardOpen = (props?: AnalyticsProps) => client.track('tool_card_open', props);
  client.trackFamilySegmentSelection = (props?: AnalyticsProps) => client.track('family_segment_selection', props);
  client.trackFamilyGoalsSelection = (props?: AnalyticsProps) => client.track('family_goals_selection', props);
  client.trackFamilyOnboardingComplete = (props?: AnalyticsProps) => client.track('family_onboarding_complete', props);
  client.trackFamilyOnboardingStart = (props?: AnalyticsProps) => client.track('family_onboarding_start', props);
  
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