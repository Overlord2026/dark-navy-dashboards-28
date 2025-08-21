import { beforeAll, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock analytics for tests
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: vi.fn(),
    trackError: vi.fn(),
    trackPerformance: vi.fn(),
    trackSecurityEvent: vi.fn(),
  },
  initializeAnalytics: vi.fn(),
}))

// Mock monitoring for tests  
vi.mock('@/lib/monitoring', () => ({
  setupErrorMonitoring: vi.fn(),
  monitorAuthEvents: vi.fn(),
  monitorDatabaseErrors: vi.fn(),
  monitorAPIErrors: vi.fn(),
}))

// Mock IndexedDB for tests
Object.defineProperty(window, 'indexedDB', {
  value: {
    open: vi.fn(),
    deleteDatabase: vi.fn(),
  },
})

// Clean up after each test
afterEach(() => {
  cleanup()
})