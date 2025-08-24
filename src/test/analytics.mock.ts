// Analytics mock for unit tests

import type { FamilyOfficeAnalytics } from '@/lib/analytics';

// Create a comprehensive mock that supports all analytics methods
const mockAnalytics: FamilyOfficeAnalytics = {
  track: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
  group: jest.fn(),
  trackEvent: function(event: string, props?: Record<string, any>) {
    return this.track(event, props);
  }
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