/**
 * Unified analytics shim that never crashes when the underlying vendor SDK
 * is missing a method. Supports both:
 *   - track('eventName', { ...props })
 *   - track({ event: 'eventName', ...props })
 */

export interface AnalyticsProps {
  event?: string;
  [k: string]: any;
}

type AnyAnalytics = { [k: string]: any } | null | undefined;

// Try a few globals: window.analytics, globalThis.analytics, etc.
const vendor: AnyAnalytics =
  (globalThis as any)?.analytics ??
  (globalThis as any)?.window?.analytics ??
  null;

function safeCall(method: string, ...args: any[]) {
  try {
    if (vendor && typeof vendor[method] === 'function') {
      vendor[method](...args);
    }
  } catch {
    // no-op
  }
}

// Overload types (so both signatures compile)
export function track(event: string, props?: AnalyticsProps): void;
export function track(props: AnalyticsProps): void;
export function track(arg1?: string | AnalyticsProps, arg2?: AnalyticsProps): void {
  // Normalize to vendor.track(name, props)
  if (typeof arg1 === 'string') {
    safeCall('track', arg1, arg2 ?? {});
    return;
  }
  // arg1 is object form
  const obj = (arg1 ?? {}) as AnalyticsProps;
  const name = obj.event ?? 'event';
  // Send a shallow clone in case vendor mutates the object
  const clone = { ...obj };
  delete clone.event;
  safeCall('track', name, clone);
}

// The main API object (kept for existing imports)
export const analytics = {
  track,
  trackEvent: track, // Alias for compatibility
  trackPageView(props?: AnalyticsProps) {
    track('page_view', props);
  },
  trackFeatureUsage(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackConversion(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackViralShare(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackPersonaClaim(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackOnboardingStep(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackSecurityEvent(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackFAQUsage(event: string, props?: AnalyticsProps) {
    track(event, props);
  },
  trackFamilyOnboardingStart(props?: AnalyticsProps) {
    // Prefer vendor's bespoke method if present; otherwise generic event
    if (vendor && typeof vendor.trackFamilyOnboardingStart === 'function') {
      safeCall('trackFamilyOnboardingStart', props ?? {});
    } else {
      track('family_onboarding_start', props);
    }
  },
  trackFamilyOnboardingComplete(props?: AnalyticsProps) {
    track('family_onboarding_complete', props);
  },
  trackShareClick(props?: AnalyticsProps) {
    track('share_click', props);
  },
  trackShareSuccess(props?: AnalyticsProps) {
    track('share_success', props);
  },
  trackFamilyTabView(props?: AnalyticsProps) {
    track('family_tab_view', props);
  },
  trackFamilyQuickAction(props?: AnalyticsProps) {
    track('family_quick_action', props);
  },
  trackToolCardOpen(props?: AnalyticsProps) {
    track('tool_card_open', props);
  },
  trackFamilySegmentSelection(props?: AnalyticsProps) {
    track('family_segment_selection', props);
  },
  trackFamilyGoalsSelection(props?: AnalyticsProps) {
    track('family_goals_selection', props);
  },
};

// Additional helper functions
export function trackExportClick(kind: 'csv'|'zip'|'pdf'|'json'|'other', props?: AnalyticsProps) {
  track('export_click', { kind, ...(props || {}) });
}

export function initializeAnalytics(opts?: { writeKey?: string; endpoint?: string; userId?: string; traits?: Record<string, any> }) {
  const w: any = (globalThis as any) || (window as any);
  if (!w.analytics && !w.ANALYTICS) {
    w.analytics = analytics;
  }
  if (w.analytics && typeof w.analytics.trackEvent !== 'function' && typeof w.analytics.track === 'function') {
    w.analytics.trackEvent = (e: string, p?: Record<string, any>) => w.analytics.track(e, p);
  }
  if (opts?.userId) {
    w.analytics.identify?.(opts.userId, opts.traits || {});
  }
  return w.analytics;
}

// For test suites that import default as FamilyOfficeAnalytics:
const FamilyOfficeAnalytics = analytics;

// Export defaults and named the same way to satisfy both patterns:
//   import analytics from '@/lib/analytics'
//   import { analytics, track } from '@/lib/analytics'
//   import FamilyOfficeAnalytics from '@/lib/analytics'
//   import { FamilyOfficeAnalytics } from '@/lib/analytics'
export default FamilyOfficeAnalytics;
export { analytics, FamilyOfficeAnalytics, track };