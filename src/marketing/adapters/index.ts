// Marketing Store Adapter Factory

import { USE_SUPABASE_MARKETING } from '@/config/featureFlags';
import { MarketingStoreAdapter } from './MarketingStore';
import { FallbackMarketingAdapter } from './fallbackAdapter';
import { SupabaseMarketingAdapter } from './supabaseAdapter';

// Singleton instances
let fallbackInstance: FallbackMarketingAdapter | null = null;
let supabaseInstance: SupabaseMarketingAdapter | null = null;

export function getMarketingStore(): MarketingStoreAdapter {
  if (USE_SUPABASE_MARKETING) {
    if (!supabaseInstance) {
      supabaseInstance = new SupabaseMarketingAdapter();
    }
    return supabaseInstance;
  } else {
    if (!fallbackInstance) {
      fallbackInstance = new FallbackMarketingAdapter();
    }
    return fallbackInstance;
  }
}

// Export adapter classes for direct use if needed
export { FallbackMarketingAdapter } from './fallbackAdapter';
export { SupabaseMarketingAdapter } from './supabaseAdapter';
export type { MarketingStoreAdapter } from './MarketingStore';