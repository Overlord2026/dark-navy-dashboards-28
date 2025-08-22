// Analytics utility for tracking events
export const analytics = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    // Console log for development
    console.log(`Analytics Event: ${eventName}`, properties);
    
    // PostHog integration if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(eventName, properties);
    }
    
    // Google Analytics integration if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  },
  
  // Backward compatibility methods
  track: (eventName: string, properties?: Record<string, any>) => {
    analytics.trackEvent(eventName, properties);
  },
  
  trackPageView: (page: string, properties?: Record<string, any>) => {
    analytics.trackEvent('page_view', { page, ...properties });
  },

  // All the missing methods for compatibility
  trackViralShare: (platform: string, properties?: Record<string, any>, metadata?: any) => {
    analytics.trackEvent('viral_share', { platform, ...properties, metadata });
  },

  trackPersonaClaim: (persona: string, properties?: Record<string, any>) => {
    analytics.trackEvent('persona_claim', { persona, ...properties });
  },

  trackOnboardingStep: (step: string, properties?: Record<string, any>) => {
    analytics.trackEvent('onboarding_step', { step, ...properties });
  },

  trackOnboardingStart: (persona: string, properties?: Record<string, any>) => {
    analytics.trackEvent('onboarding_start', { persona, ...properties });
  },

  trackFeatureUsage: (feature: string, properties?: Record<string, any>) => {
    analytics.trackEvent('feature_usage', { feature, ...properties });
  },

  trackConversion: (type: string, properties?: Record<string, any>) => {
    analytics.trackEvent('conversion', { type, ...properties });
  },

  trackSecurityEvent: (event: string, properties?: Record<string, any>) => {
    analytics.trackEvent('security_event', { event, ...properties });
  },

  trackError: (error: string | Error, properties?: Record<string, any>) => {
    const errorMessage = error instanceof Error ? error.message : error;
    analytics.trackEvent('error', { error: errorMessage, ...properties });
  },

  trackPerformance: (metric: string, properties?: Record<string, any>) => {
    analytics.trackEvent('performance', { metric, ...properties });
  },

  trackFAQUsage: (action: string, properties?: Record<string, any>) => {
    analytics.trackEvent('faq_usage', { action, ...properties });
  },

  // Family-specific events
  trackFamilyOnboardingStart: (segment?: string, properties?: Record<string, any>) => {
    analytics.trackEvent('onboard.families.start', { segment, ...properties });
  },

  trackFamilyOnboardingComplete: (segment: string, goals: string[], properties?: Record<string, any>) => {
    analytics.trackEvent('onboard.families.complete', { segment, goals, ...properties });
  },

  trackFamilySegmentSelection: (segment: string, properties?: Record<string, any>) => {
    analytics.trackEvent('onboard.families.segment', { segment, ...properties });
  },

  trackFamilyGoalsSelection: (goals: string[], properties?: Record<string, any>) => {
    analytics.trackEvent('onboard.families.goals', { goals, ...properties });
  },

  trackFamilyQuickAction: (label: string, route: string, properties?: Record<string, any>) => {
    analytics.trackEvent('family.quickAction.click', { label, route, ...properties });
  },

  trackFamilyTabView: (tabKey: string, segment: string, properties?: Record<string, any>) => {
    analytics.trackEvent('family.tab.view', { tabKey, segment, ...properties });
  },

  trackToolCardOpen: (toolKey: string, toolName: string, category: string, properties?: Record<string, any>) => {
    analytics.trackEvent('tool.card.open', { toolKey, toolName, category, ...properties });
  },

  trackProofCreated: (type: string, reasonCodes?: string[], properties?: Record<string, any>) => {
    analytics.trackEvent('proof.created', { type, reasonCodes, ...properties });
  },

  trackShareClick: (context: string, properties?: Record<string, any>) => {
    analytics.trackEvent('share.click', { context, ...properties });
  },

  trackShareSuccess: (context: string, platform?: string, properties?: Record<string, any>) => {
    analytics.trackEvent('share.success', { context, platform, ...properties });
  }
};

// Export track function for backward compatibility
export const track = analytics.track;

// Initialize function for main.tsx
export const initializeAnalytics = () => {
  console.log('Analytics initialized');
  // Add any initialization logic here
};

export default analytics;