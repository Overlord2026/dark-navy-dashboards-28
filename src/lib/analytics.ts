// Analytics tracking for demo interactions
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.log(`📊 Analytics: ${event}`, properties);
      // In production, this would send to your analytics service
      // posthog.capture(event, properties);
    }
  },
  // Legacy compatibility methods with flexible parameters
  trackEvent: (event: string, properties?: Record<string, any>) => analytics.track(event, properties),
  trackPageView: (path: string, properties?: Record<string, any>) => analytics.track('page_view', { path, ...properties }),
  trackFeatureUsage: (feature: string, properties?: Record<string, any>) => analytics.track('feature_usage', { feature, ...properties }),
  trackConversion: (type: string, properties?: Record<string, any>) => analytics.track('conversion', { type, ...properties }),
  trackError: (error: Error | string, properties?: Record<string, any>) => analytics.track('error', { error: error.toString(), ...properties }),
  trackPerformance: (metric: string, value: number | { value: number }, properties?: Record<string, any>) => {
    const val = typeof value === 'number' ? value : value.value;
    return analytics.track('performance', { metric, value: val, ...properties });
  },
  trackSecurityEvent: (event: string, properties?: Record<string, any>) => analytics.track('security_event', { event, ...properties }),
  trackPersonaClaim: (persona: string, properties?: Record<string, any>) => analytics.track('persona_claim', { persona, ...properties }),
  trackOnboardingStep: (step: string, properties?: Record<string, any>) => analytics.track('onboarding_step', { step, ...properties }),
  trackOnboardingStart: (properties?: Record<string, any>) => analytics.track('onboarding_start', properties),
  trackViralShare: (platform: string, properties?: Record<string, any>) => analytics.track('viral_share', { platform, ...properties }),
  trackShareClick: (type: string, properties?: Record<string, any>) => analytics.track('share_click', { type, ...properties }),
  trackShareSuccess: (type: string | Record<string, any>, properties?: Record<string, any>) => {
    if (typeof type === 'string') {
      return analytics.track('share_success', { type, ...properties });
    } else {
      return analytics.track('share_success', type);
    }
  },
  trackFAQUsage: (question: string, properties?: Record<string, any>) => analytics.track('faq_usage', { question, ...properties }),
  // Family-specific tracking methods
  trackFamilyTabView: (tab: string, properties?: Record<string, any>) => analytics.track('family_tab_view', { tab, ...properties }),
  trackFamilyQuickAction: (action: string, properties?: Record<string, any>) => analytics.track('family_quick_action', { action, ...properties }),
  trackToolCardOpen: (tool: string, properties?: Record<string, any>) => analytics.track('tool_card_open', { tool, ...properties }),
  trackFamilyOnboardingStart: (properties?: Record<string, any>) => analytics.track('family_onboarding_start', properties),
  trackFamilySegmentSelection: (segment: string, properties?: Record<string, any>) => analytics.track('family_segment_selection', { segment, ...properties }),
  trackFamilyGoalsSelection: (goals: string[], properties?: Record<string, any>) => analytics.track('family_goals_selection', { goals, ...properties }),
  trackFamilyOnboardingComplete: (properties?: Record<string, any>) => analytics.track('family_onboarding_complete', properties)
};

// Named exports for compatibility
export const track = analytics.track;
export const initializeAnalytics = () => console.log('Analytics initialized');

export const trackFamilyToolDemo = (toolKey: string) => {
  analytics.track('family.tool.demo.loaded', { toolKey });
};

export const trackProofCreated = (type: string) => {
  analytics.track('proof.created', { type });
};

export const trackExportClick = (kind: string) => {
  analytics.track('export.click', { kind });
};