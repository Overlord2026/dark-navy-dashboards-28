// Global type definitions for E2E tests
declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, any>) => void;
    };
    analyticsEvents?: Array<{
      event: string;
      properties?: Record<string, any>;
    }>;
  }
}

export {};