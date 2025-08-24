// src/lib/analytics.ts
export type AnalyticsProps = Record<string, any>;

export interface FamilyOfficeAnalytics {
  track: (...args: any[]) => void;       // varargs (normalize internally)
  page:  (...args: any[]) => void;
  identify: (...args: any[]) => void;
  group?: (...args: any[]) => void;
  trackEvent?: (...args: any[]) => void; // legacy alias
}

function makeNoop(): FamilyOfficeAnalytics {
  const log = (...a:any[]) => (import.meta.env.DEV) && console.debug('[analytics]', ...a);
  const client: FamilyOfficeAnalytics = {
    track: (...a)=> log('track', ...a),
    page:  (...a)=> log('page',  ...a),
    identify: (...a)=> log('identify', ...a),
    group: (...a)=> log('group', ...a),
    trackEvent: (...a)=> log('trackEvent', ...a)
  };
  return client;
}

function resolveRuntime(): FamilyOfficeAnalytics {
  const w:any = (globalThis as any) || (window as any);
  const r:any = w?.analytics || w?.ANALYTICS || null;
  if (!r) return makeNoop();

  // Ensure all funcs exist
  ['track','page','identify','group','trackEvent'].forEach(fn=>{
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