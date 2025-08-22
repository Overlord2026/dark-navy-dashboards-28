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
  trackViralShare: (eventName: string, properties?: Record<string, any>, metadata?: any) => {
    analytics.trackEvent('viral_share', { event: eventName, ...properties, metadata });
  },

  trackPersonaClaim: (persona: string, properties?: Record<string, any>) => {
    analytics.trackEvent('persona_claim', { persona, ...properties });
  },

  trackOnboardingStep: (step: string, persona?: string, segment?: string, complete?: boolean, properties?: Record<string, any>) => {
    analytics.trackEvent('onboarding_step', { step, persona, segment, complete, ...properties });
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

  trackSecurityEvent: (event: string, severity?: string, properties?: Record<string, any>) => {
    analytics.trackEvent('security_event', { event, severity, ...properties });
  },

  trackError: (error: string | Error, properties?: Record<string, any>) => {
    const errorMessage = error instanceof Error ? error.message : error;
    analytics.trackEvent('error', { error: errorMessage, ...properties });
  },

  trackPerformance: (metric: string, value?: number, properties?: Record<string, any>) => {
    analytics.trackEvent('performance', { metric, value, ...properties });
  },

  trackFAQUsage: (question: string, properties?: Record<string, any>) => {
    analytics.trackEvent('faq_usage', { question, ...properties });
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