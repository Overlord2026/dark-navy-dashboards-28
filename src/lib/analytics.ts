/**
 * Unified analytics shim that never crashes and compiles everywhere.
 * Supports both of these call styles:
 *   track('event', { ...props })
 *   track({ event: 'event', ...props })
 * Also exports a tolerant trackEvent(...args) for legacy sites.
 */

export interface AnalyticsProps {
  event?: string;
  [k: string]: any;
}

type AnyAnalytics = { [k: string]: any } | null | undefined;
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

// Overloads so both styles compile
export function track(event: string, props?: AnalyticsProps): void;
export function track(props: AnalyticsProps): void;
export function track(arg1?: string | AnalyticsProps, arg2?: AnalyticsProps): void {
  if (typeof arg1 === 'string') {
    safeCall('track', arg1, arg2 ?? {});
    return;
  }
  const obj = (arg1 ?? {}) as AnalyticsProps;
  const name = obj.event ?? 'event';
  const clone = { ...obj };
  delete clone.event;
  safeCall('track', name, clone);
}

// Tolerant adapter: accepts ANY signature and normalizes
export function trackEvent(...args: any[]): void {
  if (args.length === 0) return;
  if (typeof args[0] === 'string') {
    const name = args[0] as string;
    const props = (args[1] && typeof args[1] === 'object') ? args[1] : {};
    track(name, props);
  } else if (typeof args[0] === 'object') {
    track(args[0] as AnalyticsProps);
  }
}

// API object for existing imports
export const analytics = {
  track,
  trackEvent,
  trackPageView(event?: string, props?: AnalyticsProps) {
    track(event || 'page_view', props);
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
  trackShareClick(event?: string, props?: AnalyticsProps) {
    track(event || 'share_click', props);
  },
  trackShareSuccess(event?: string, props?: AnalyticsProps) {
    track(event || 'share_success', props);
  },
  trackFamilyTabView(event?: string, props?: AnalyticsProps) {
    track(event || 'family_tab_view', props);
  },
  trackFamilyQuickAction(event?: string, props?: AnalyticsProps) {
    track(event || 'family_quick_action', props);
  },
  trackToolCardOpen(event?: string, props?: AnalyticsProps) {
    track(event || 'tool_card_open', props);
  },
  trackFamilySegmentSelection(event?: string, props?: AnalyticsProps) {
    track(event || 'family_segment_selection', props);
  },
  trackFamilyGoalsSelection(event?: string, props?: AnalyticsProps) {
    track(event || 'family_goals_selection', props);
  },
  trackFamilyOnboardingStart(props?: AnalyticsProps) {
    if (vendor && typeof vendor.trackFamilyOnboardingStart === 'function') {
      safeCall('trackFamilyOnboardingStart', props ?? {});
    } else {
      track('family_onboarding_start', props);
    }
  },
  trackFamilyOnboardingComplete(props?: AnalyticsProps) {
    track('family_onboarding_complete', props);
  },
  page(props?: AnalyticsProps) {
    safeCall('page', props);
  },
  identify(userId?: string, traits?: AnalyticsProps) {
    safeCall('identify', userId, traits);
  },
  group(groupId?: string, traits?: AnalyticsProps) {
    safeCall('group', groupId, traits);
  }
};

// Helper functions
export function trackExportClick(kind: 'csv'|'zip'|'pdf'|'json'|'other', props?: AnalyticsProps) {
  track('export_click', { kind, ...(props || {}) });
}

export function emitReceipt(props?: AnalyticsProps) {
  track('receipt_emit', props || {});
}

export function initializeAnalytics(opts?: { writeKey?: string; endpoint?: string; userId?: string; traits?: AnalyticsProps }) {
  const w: any = (globalThis as any) || (window as any);
  if (!w.analytics && !w.ANALYTICS) {
    w.analytics = analytics;
  }
  if (w.analytics && typeof w.analytics.trackEvent !== 'function' && typeof w.analytics.track === 'function') {
    w.analytics.trackEvent = (e: string, p?: AnalyticsProps) => w.analytics.track(e, p);
  }
  if (opts?.userId) {
    w.analytics.identify?.(opts.userId, opts.traits || {});
  }
  return w.analytics;
}

// Type alias for compatibility
export type FamilyOfficeAnalytics = typeof analytics;

// Default export
export default analytics;