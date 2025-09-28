// Minimal analytics stub: wire your provider later.
// Use: track('legacy.flow_started', { plan_key: 'premium', household_id: '...' })
type Payload = Record<string, unknown>;

export function track(event: string, payload: Payload = {}) {
  // eslint-disable-next-line no-console
  console.debug(`[analytics] ${event}`, payload);
}

// Namespaced events we care about for pricing decisions
export const LEGACY_EVENTS = {
  FLOW_STARTED: "legacy.flow_started",
  CHECKLIST_COMPLETED: "legacy.checklist_completed",
  EXPORT_CREATED: "legacy.export_created",
  SHARE_GRANTED: "legacy.share_granted",
  REMINDER_SCHEDULED: "legacy.reminder_scheduled",
  ITEM_UPDATED: "legacy.item_updated"
} as const;

// Compatibility exports for existing codebase
export const analytics = {
  track,
  trackEvent: track,
  trackPageView: (event?: string, props?: Payload) => track(event || 'PageView', props || {}),
  trackFeatureUsage: (event: string, props?: Payload) => track('FeatureUsage', { feature: event, ...props }),
  trackConversion: (event: string, props?: Payload) => track('Conversion', { type: event, ...props }),
  trackViralShare: (event: string, props?: Payload) => track('ViralShare', { method: event, ...props }),
  trackPersonaClaim: (event: string, props?: Payload) => track('PersonaClaim', { persona: event, ...props }),
  trackOnboardingStep: (event: string, props?: Payload) => track('OnboardingStep', { step: event, ...props }),
  trackSecurityEvent: (event: string, props?: Payload) => track('SecurityEvent', { event, ...props }),
  trackFAQUsage: (event: string, props?: Payload) => track('FAQUsage', { question: event, ...props }),
  trackShareClick: (event?: string, props?: Payload) => track('ShareClick', { method: event, ...props }),
  trackShareSuccess: (event?: string, props?: Payload) => track('ShareSuccess', { method: event, ...props }),
  trackFamilyTabView: (event?: string, props?: Payload) => track('FamilyTabView', { tab: event, ...props }),
  trackFamilyQuickAction: (event?: string, props?: Payload) => track('FamilyQuickAction', { action: event, ...props }),
  trackToolCardOpen: (event?: string, props?: Payload) => track('ToolCardOpen', { tool: event, ...props }),
  trackFamilySegmentSelection: (event?: string, props?: Payload) => track('FamilySegmentSelection', { segment: event, ...props }),
  trackFamilyGoalsSelection: (event?: string, props?: Payload) => track('FamilyGoalsSelection', { goals: event, ...props }),
  trackFamilyOnboardingStart: (props?: Payload) => track('FamilyOnboardingStart', props || {}),
  trackFamilyOnboardingComplete: (props?: Payload) => track('FamilyOnboardingComplete', props || {}),
  page: (props?: Payload) => track('PageView', props || {}),
  identify: (userId?: string, traits?: Payload) => track('UserIdentify', { userId, traits }),
  group: (groupId?: string, traits?: Payload) => track('GroupIdentify', { groupId, traits })
};

// Helper functions for compatibility
export function trackExportClick(kind: 'csv'|'zip'|'pdf'|'json'|'other', props?: Payload) {
  track('export_click', { kind, ...(props || {}) });
}

export function emitReceipt(props?: Payload) {
  track('receipt_emit', props || {});
}

// Default export for compatibility
export default analytics;

// Type alias for compatibility
export type FamilyOfficeAnalytics = typeof analytics;