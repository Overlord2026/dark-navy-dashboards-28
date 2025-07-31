
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = 'phc_Yc8jTGjpIN3vMS0YSvT6ZpOZ7UhEwnyBaUhI2i8ec46'; // Replace with actual key
const POSTHOG_HOST = 'https://us.i.posthog.com'; // US instance

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Privacy-focused settings
      capture_pageview: false, // We'll manually track page views
      capture_pageleave: true,
      disable_session_recording: false, // Enable if you want session recordings
      respect_dnt: true,
      // Performance optimizations
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded successfully');
        }
      }
    });
  }
};

export const analytics = {
  // Page tracking
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      page_name: pageName,
      ...properties
    });
  },

  // User identification
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  },

  // Feature usage tracking
  trackFeatureUsage: (featureName: string, properties?: Record<string, any>) => {
    posthog.capture('feature_used', {
      feature_name: featureName,
      ...properties
    });
  },

  // Conversion events
  trackConversion: (conversionType: string, properties?: Record<string, any>) => {
    posthog.capture('conversion', {
      conversion_type: conversionType,
      ...properties
    });
  },

  // Custom events
  track: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  },

  // Error tracking
  trackError: (error: Error, context?: Record<string, any>) => {
    posthog.capture('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  },

  // Performance tracking
  trackPerformance: (metric: string, value: number, context?: Record<string, any>) => {
    posthog.capture('performance_metric', {
      metric_name: metric,
      metric_value: value,
      ...context
    });
  },

  // Security event tracking
  trackSecurityEvent: (eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => {
    posthog.capture('security_event', {
      event_type: eventType,
      severity,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // User properties
  setUserProperties: (properties: Record<string, any>) => {
    posthog.setPersonProperties(properties);
  },

  // Reset user (for logout)
  reset: () => {
    posthog.reset();
  }
};
