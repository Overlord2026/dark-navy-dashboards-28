// src/types/analytics.d.ts
import type { FamilyOfficeAnalytics } from '@/lib/analytics';

declare global {
  interface Window {
    analytics?: FamilyOfficeAnalytics;
    ANALYTICS?: FamilyOfficeAnalytics;
  }
}

export {};