// Analytics mock for unit tests

import type { FamilyOfficeAnalytics } from '@/lib/analytics';

// Create a comprehensive mock that supports all analytics methods
const mockAnalytics = {
  track: jest.fn(),
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
  trackFeatureUsage: jest.fn(),
  trackConversion: jest.fn(),
  trackViralShare: jest.fn(),
  trackPersonaClaim: jest.fn(),
  trackOnboardingStep: jest.fn(),
  trackSecurityEvent: jest.fn(),
  trackFAQUsage: jest.fn(),
  trackShareClick: jest.fn(),
  trackShareSuccess: jest.fn(),
  trackFamilyTabView: jest.fn(),
  trackFamilyQuickAction: jest.fn(),
  trackToolCardOpen: jest.fn(),
  trackFamilySegmentSelection: jest.fn(),
  trackFamilyGoalsSelection: jest.fn(),
  trackFamilyOnboardingStart: jest.fn(),
  trackFamilyOnboardingComplete: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
  group: jest.fn()
};

// Set up global analytics mock
export const setupAnalyticsMock = () => {
  (window as any).analytics = mockAnalytics;
  (window as any).ANALYTICS = mockAnalytics;
  return mockAnalytics;
};

// Clean up mocks between tests
export const clearAnalyticsMocks = () => {
  (mockAnalytics.track as jest.Mock).mockClear();
  (mockAnalytics.page as jest.Mock).mockClear();
  (mockAnalytics.identify as jest.Mock).mockClear();
  (mockAnalytics.group as jest.Mock).mockClear();
};

// Helper to get call counts and arguments
export const getAnalyticsCalls = () => ({
  track: (mockAnalytics.track as jest.Mock).mock.calls,
  page: (mockAnalytics.page as jest.Mock).mock.calls,
  identify: (mockAnalytics.identify as jest.Mock).mock.calls,
  group: (mockAnalytics.group as jest.Mock).mock.calls,
});

// Default export for convenience
export default mockAnalytics;