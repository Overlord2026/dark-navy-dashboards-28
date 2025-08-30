// Legacy analytics - use @/lib/analyticsBridge instead
import { analytics as bridge } from '@/lib/analyticsBridge';

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

// Normalized analytics using bridge
export const analytics = {
  track: bridge.track,
  trackEvent: bridge.track,
  trackPageView: (event?: string, props?: AnalyticsProps) => bridge.track(event || 'PageView', props),
  trackFeatureUsage: (event: string, props?: AnalyticsProps) => bridge.track('FeatureUsage', { feature: event, ...props }),
  trackConversion: (event: string, props?: AnalyticsProps) => bridge.track('Conversion', { type: event, ...props }),
  trackViralShare: (event: string, props?: AnalyticsProps) => bridge.track('ViralShare', { method: event, ...props }),
  trackPersonaClaim: (event: string, props?: AnalyticsProps) => bridge.track('PersonaClaim', { persona: event, ...props }),
  trackOnboardingStep: (event: string, props?: AnalyticsProps) => bridge.track('OnboardingStep', { step: event, ...props }),
  trackSecurityEvent: (event: string, props?: AnalyticsProps) => bridge.track('SecurityEvent', { event, ...props }),
  trackFAQUsage: (event: string, props?: AnalyticsProps) => bridge.track('FAQUsage', { question: event, ...props }),
  trackShareClick: (event?: string, props?: AnalyticsProps) => bridge.track('ShareClick', { method: event, ...props }),
  trackShareSuccess: (event?: string, props?: AnalyticsProps) => bridge.track('ShareSuccess', { method: event, ...props }),
  trackFamilyTabView: (event?: string, props?: AnalyticsProps) => bridge.track('FamilyTabView', { tab: event, ...props }),
  trackFamilyQuickAction: (event?: string, props?: AnalyticsProps) => bridge.track('FamilyQuickAction', { action: event, ...props }),
  trackToolCardOpen: (event?: string, props?: AnalyticsProps) => bridge.track('ToolCardOpen', { tool: event, ...props }),
  trackFamilySegmentSelection: (event?: string, props?: AnalyticsProps) => bridge.track('FamilySegmentSelection', { segment: event, ...props }),
  trackFamilyGoalsSelection: (event?: string, props?: AnalyticsProps) => bridge.track('FamilyGoalsSelection', { goals: event, ...props }),
  trackFamilyOnboardingStart: (props?: AnalyticsProps) => bridge.track('FamilyOnboardingStart', props),
  trackFamilyOnboardingComplete: (props?: AnalyticsProps) => bridge.track('FamilyOnboardingComplete', props),
  page: (props?: AnalyticsProps) => bridge.track('PageView', props),
  identify: (userId?: string, traits?: AnalyticsProps) => bridge.track('UserIdentify', { userId, traits }),
  group: (groupId?: string, traits?: AnalyticsProps) => bridge.track('GroupIdentify', { groupId, traits })
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