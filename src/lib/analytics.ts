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
  
  // Backward compatibility
  track: (eventName: string, properties?: Record<string, any>) => {
    analytics.trackEvent(eventName, properties);
  },
  
  trackPageView: (page: string, properties?: Record<string, any>) => {
    analytics.trackEvent('page_view', { page, ...properties });
  }
};

// Export track function for backward compatibility
export const track = analytics.track;

export default analytics;