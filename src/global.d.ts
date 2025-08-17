/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ANALYTICS_ENABLED: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, any>) => void;
    };
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
    };
    analyticsEvents?: Array<{
      event: string;
      properties?: Record<string, any>;
    }>;
  }
}

export {};