// src/lib/analytics.ts
export type AnalyticsProps = Record<string, any>;

export interface FamilyOfficeAnalytics {
  track: (...args: any[]) => void;       // varargs (normalize internally)
  page:  (...args: any[]) => void;
  identify: (...args: any[]) => void;
  group?: (...args: any[]) => void;
  trackEvent?: (...args: any[]) => void; // legacy alias
  // Add missing methods for compatibility
  trackPageView?: (...args: any[]) => void;
  trackFeatureUsage?: (...args: any[]) => void;
  trackConversion?: (...args: any[]) => void;
  trackViralShare?: (...args: any[]) => void;
  trackPersonaClaim?: (...args: any[]) => void;
  trackOnboardingStep?: (...args: any[]) => void;
  trackSecurityEvent?: (...args: any[]) => void;
  trackFAQUsage?: (...args: any[]) => void;
  trackShareClick?: (...args: any[]) => void;
  trackShareSuccess?: (...args: any[]) => void;
  trackFamilyTabView?: (...args: any[]) => void;
  trackFamilyQuickAction?: (...args: any[]) => void;
  trackToolCardOpen?: (...args: any[]) => void;
  trackFamilySegmentSelection?: (...args: any[]) => void;
  trackFamilyGoalsSelection?: (...args: any[]) => void;
  trackFamilyOnboardingComplete?: (...args: any[]) => void;
  trackFamilyOnboardingStart?: (...args: any[]) => void;
}

function makeNoop(): FamilyOfficeAnalytics {
  const log = (...a:any[]) => (import.meta.env.DEV) && console.debug('[analytics]', ...a);
  const client: FamilyOfficeAnalytics = {
    track: (...a)=> log('track', ...a),
    page:  (...a)=> log('page',  ...a),
    identify: (...a)=> log('identify', ...a),
    group: (...a)=> log('group', ...a),
    trackEvent: (...a)=> log('trackEvent', ...a),
    // Add all missing methods
    trackPageView: (...a)=> log('trackPageView', ...a),
    trackFeatureUsage: (...a)=> log('trackFeatureUsage', ...a),
    trackConversion: (...a)=> log('trackConversion', ...a),
    trackViralShare: (...a)=> log('trackViralShare', ...a),
    trackPersonaClaim: (...a)=> log('trackPersonaClaim', ...a),
    trackOnboardingStep: (...a)=> log('trackOnboardingStep', ...a),
    trackSecurityEvent: (...a)=> log('trackSecurityEvent', ...a),
    trackFAQUsage: (...a)=> log('trackFAQUsage', ...a),
    trackShareClick: (...a)=> log('trackShareClick', ...a),
    trackShareSuccess: (...a)=> log('trackShareSuccess', ...a),
    trackFamilyTabView: (...a)=> log('trackFamilyTabView', ...a),
    trackFamilyQuickAction: (...a)=> log('trackFamilyQuickAction', ...a),
    trackToolCardOpen: (...a)=> log('trackToolCardOpen', ...a),
    trackFamilySegmentSelection: (...a)=> log('trackFamilySegmentSelection', ...a),
    trackFamilyGoalsSelection: (...a)=> log('trackFamilyGoalsSelection', ...a),
    trackFamilyOnboardingComplete: (...a)=> log('trackFamilyOnboardingComplete', ...a),
    trackFamilyOnboardingStart: (...a)=> log('trackFamilyOnboardingStart', ...a)
  };
  return client;
}

function resolveRuntime(): FamilyOfficeAnalytics {
  const w:any = (globalThis as any) || (window as any);
  const r:any = w?.analytics || w?.ANALYTICS || null;
  if (!r) return makeNoop();

  // Ensure all funcs exist
  const allMethods = ['track','page','identify','group','trackEvent','trackPageView','trackFeatureUsage','trackConversion','trackViralShare','trackPersonaClaim','trackOnboardingStep','trackSecurityEvent','trackFAQUsage','trackShareClick','trackShareSuccess','trackFamilyTabView','trackFamilyQuickAction','trackToolCardOpen','trackFamilySegmentSelection','trackFamilyGoalsSelection','trackFamilyOnboardingComplete','trackFamilyOnboardingStart'];
  allMethods.forEach(fn=>{
    if (typeof r[fn] !== 'function') r[fn] = (..._args:any[])=>{};
  });
  return r as FamilyOfficeAnalytics;
}

const runtime = resolveRuntime();

function normalizeTrackArgs(...args:any[]): [string, AnalyticsProps?] {
  // Supported patterns:
  // ('event', props?) | (propsOnly) | (props, 'event') | ('event', props, _ignored)
  if (typeof args[0] === 'string') return [args[0], args[1]];
  if (typeof args[1] === 'string') return [args[1], args[0]];
  if (typeof args[0] === 'object') return ['app.event', args[0]];
  return ['app.event', undefined];
}

const analytics: FamilyOfficeAnalytics = {
  track: (...args:any[]) => {
    const [name, props] = normalizeTrackArgs(...args);
    runtime.track(name, props);
  },
  page:  (...args:any[]) => {
    const [name, props] = normalizeTrackArgs(...args);
    runtime.page(name, props);
  },
  identify: (...args:any[]) => {
    const [userId, traits] =
      (typeof args[0] === 'string') ? [args[0], args[1]] :
      ['unknown', args[0]];
    runtime.identify(userId, traits);
  },
  group: (...args:any[]) => {
    const [groupId, traits] =
      (typeof args[0] === 'string') ? [args[0], args[1]] :
      ['unknown', args[0]];
    runtime.group?.(groupId, traits);
  },
  trackEvent: (...args:any[]) => (analytics.track as any)(...args)
};

// Helpers
export function track(eventOrProps:any, maybeProps?:AnalyticsProps) {
  (analytics.track as any)(eventOrProps, maybeProps);
}

// Add emitReceipt export for compatibility
export function emitReceipt(...args: any[]) {
  analytics.track('receipt.emit', args[0] || {});
}

// Initialize function for app startup
export function initializeAnalytics() {
  // Analytics initialization logic if needed
  if (import.meta.env.DEV) {
    console.debug('[analytics] initialized');
  }
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