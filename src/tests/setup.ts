import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock analytics for tests
const mockAnalytics = {
  track: () => {},
  trackError: () => {},
  trackPerformance: () => {},
  trackSecurityEvent: () => {},
};

const mockMonitoring = {
  setupErrorMonitoring: () => {},
  monitorAuthEvents: () => {},
  monitorDatabaseErrors: () => {},
  monitorAPIErrors: () => {},
};

// Mock modules
Object.defineProperty(window, 'analytics', { value: mockAnalytics });
Object.defineProperty(window, 'monitoring', { value: mockMonitoring });

// Mock IndexedDB for tests
Object.defineProperty(window, 'indexedDB', {
  value: {
    open: () => Promise.resolve({}),
    deleteDatabase: () => Promise.resolve(),
  },
});

// Clean up after each test
afterEach(() => {
  cleanup()
})