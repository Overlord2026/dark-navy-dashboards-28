// src/lib/analytics.ts
// Safe, typed analytics wrapper (no-ops if method absent)
type AnyAnalytics = { [k: string]: (...a: any[]) => void } | undefined | null;
const a: AnyAnalytics = (globalThis as any).analytics ?? ({} as any);

export type AnalyticsProps = Record<string, any>;

function safeCall(methodName: string, ...args: any[]) {
  if (typeof (a as any)?.[methodName] === 'function') {
    (a as any)[methodName](...args);
  }
}

const analyticsObj = {
  track(event: string, props?: AnalyticsProps) {
    safeCall('track', event, props);
  },
  trackEvent(event: string, props?: AnalyticsProps) {
    safeCall('track', event, props);
  },
  trackPageView(event?: string, props?: AnalyticsProps) {
    safeCall('trackPageView', event, props);
    if (!event) safeCall('track', 'page_view', props);
  },
  trackFeatureUsage(event: string, props?: AnalyticsProps) {
    safeCall('trackFeatureUsage', event, props);
  },
  trackConversion(event: string, props?: AnalyticsProps) {
    safeCall('trackConversion', event, props);
  },
  trackViralShare(event: string, props?: AnalyticsProps) {
    safeCall('trackViralShare', event, props);
  },
  trackPersonaClaim(event: string, props?: AnalyticsProps) {
    safeCall('trackPersonaClaim', event, props);
  },
  trackOnboardingStep(event: string, props?: AnalyticsProps) {
    safeCall('trackOnboardingStep', event, props);
  },
  trackSecurityEvent(event: string, props?: AnalyticsProps) {
    safeCall('trackSecurityEvent', event, props);
  },
  trackFAQUsage(event: string, props?: AnalyticsProps) {
    safeCall('trackFAQUsage', event, props);
  },
  trackShareClick(props?: AnalyticsProps) {
    safeCall('track', 'share_click', props);
  },
  trackShareSuccess(props?: AnalyticsProps) {
    safeCall('track', 'share_success', props);
  },
  trackFamilyTabView(props?: AnalyticsProps) {
    safeCall('track', 'family_tab_view', props);
  },
  trackFamilyQuickAction(props?: AnalyticsProps) {
    safeCall('track', 'family_quick_action', props);
  },
  trackToolCardOpen(props?: AnalyticsProps) {
    safeCall('track', 'tool_card_open', props);
  },
  trackFamilySegmentSelection(props?: AnalyticsProps) {
    safeCall('track', 'family_segment_selection', props);
  },
  trackFamilyGoalsSelection(props?: AnalyticsProps) {
    safeCall('track', 'family_goals_selection', props);
  },
  trackFamilyOnboardingStart(props?: AnalyticsProps) {
    safeCall('trackFamilyOnboardingStart', props) || safeCall('track', 'family_onboarding_start', props);
  },
  trackFamilyOnboardingComplete(props?: AnalyticsProps) {
    safeCall('track', 'family_onboarding_complete', props);
  }
};

export const analytics = analyticsObj;

// Helpers
export function track(eventOrProps:any, maybeProps?:AnalyticsProps) {
  (analytics.track as any)(eventOrProps, maybeProps);
}

// Add emitReceipt export for compatibility
export function emitReceipt(...args: any[]) {
  analytics.track('receipt.emit', args[0] || {});
}

export type AnalyticsInitOptions = {
  // optional hints for future real providers; ignored by the shim
  writeKey?: string;
  endpoint?: string;
  userId?: string;
  traits?: Record<string, any>;
};

/**
 * initializeAnalytics
 * - If a real analytics client exists on window (window.analytics or window.ANALYTICS), keep it.
 * - Otherwise, attach the shim client to window.analytics for consistency.
 * - Optionally call identify() if userId/traits provided.
 * - Returns the active analytics client.
 */
export function initializeAnalytics(opts?: AnalyticsInitOptions) {
  const w: any = (globalThis as any) || (window as any);
  // If a runtime client already exists (Segment/Amplitude/etc.), keep it; else attach our shim.
  if (!w.analytics && !w.ANALYTICS) {
    w.analytics = analytics; // attach shim so downstream code can rely on window.analytics
  }
  // Normalize: ensure trackEvent alias exists
  if (w.analytics && typeof w.analytics.trackEvent !== 'function' && typeof w.analytics.track === 'function') {
    w.analytics.trackEvent = (e: string, p?: Record<string, any>) => w.analytics.track(e, p);
  }
  // Optional identify on init
  if (opts?.userId) {
    w.analytics.identify?.(opts.userId, opts.traits || {});
  }
  
  if (import.meta.env.DEV) {
    console.debug('[analytics] initialized');
  }
  
  return w.analytics;
}

// Export BOTH default and named
export { analytics };
export default analytics;

export function trackExportClick(
  kind: 'csv'|'zip'|'pdf'|'json'|'other',
  props?: AnalyticsProps
){
  analytics.track('export.click', { kind, ...(props||{}) });
}