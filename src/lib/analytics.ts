type AnyAnalytics = { [k: string]: (...a: any[]) => void } | undefined | null;
const a: AnyAnalytics = (globalThis as any).analytics ?? ({} as any);

export const analytics = {
  track(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackEvent(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackPageView(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'page_view', props);
  },
  trackFeatureUsage(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackConversion(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackViralShare(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackPersonaClaim(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackOnboardingStep(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackSecurityEvent(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackFAQUsage(event: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event, props);
  },
  trackShareClick(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'share_click', props);
  },
  trackShareSuccess(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'share_success', props);
  },
  trackFamilyTabView(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'family_tab_view', props);
  },
  trackFamilyQuickAction(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'family_quick_action', props);
  },
  trackToolCardOpen(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'tool_card_open', props);
  },
  trackFamilySegmentSelection(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'family_segment_selection', props);
  },
  trackFamilyGoalsSelection(event?: string, props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track(event || 'family_goals_selection', props);
  },
  trackFamilyOnboardingStart(props?: Record<string, any>) {
    if (typeof (a as any)?.trackFamilyOnboardingStart === 'function') {
      (a as any).trackFamilyOnboardingStart(props);
    } else {
      analytics.track('family_onboarding_start', props);
    }
  },
  trackFamilyOnboardingComplete(props?: Record<string, any>) {
    if (typeof (a as any)?.track === 'function') (a as any).track('family_onboarding_complete', props);
  },
  page(props?: Record<string, any>) {
    if (typeof (a as any)?.page === 'function') (a as any).page(props);
  },
  identify(userId?: string, traits?: Record<string, any>) {
    if (typeof (a as any)?.identify === 'function') (a as any).identify(userId, traits);
  },
  group(groupId?: string, traits?: Record<string, any>) {
    if (typeof (a as any)?.group === 'function') (a as any).group(groupId, traits);
  }
};

// Helper functions
export function track(event: string, props?: Record<string, any>) {
  analytics.track(event, props);
}

export function trackExportClick(kind: 'csv'|'zip'|'pdf'|'json'|'other', props?: Record<string, any>) {
  analytics.track('export_click', { kind, ...(props || {}) });
}

export function emitReceipt(props?: Record<string, any>) {
  analytics.track('receipt_emit', props || {});
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

// Type alias for compatibility
export type FamilyOfficeAnalytics = typeof analytics;

// Default export
export default analytics;