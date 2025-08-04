// A/B Testing Framework for Family Office Marketplace
import { analytics } from './analytics';

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  enabled: boolean;
}

class ABTestingService {
  private tests: ABTest[] = [
    {
      id: 'viral_share_button_text',
      name: 'Viral Share Button Text',
      enabled: true,
      variants: [
        {
          id: 'original',
          name: 'Share on LinkedIn',
          weight: 50,
          config: { buttonText: 'Share on LinkedIn', description: 'Share your professional network access' }
        },
        {
          id: 'variant_a',
          name: 'Invite Colleagues',
          weight: 50,
          config: { buttonText: 'Invite Colleagues', description: 'Invite your network to join' }
        }
      ]
    },
    {
      id: 'email_sequence_timing',
      name: '7-Day Email Sequence Timing',
      enabled: true,
      variants: [
        {
          id: 'original',
          name: 'Standard Timing',
          weight: 50,
          config: { days: [1, 3, 5, 7] }
        },
        {
          id: 'variant_a',
          name: 'Faster Timing',
          weight: 50,
          config: { days: [1, 2, 4, 6] }
        }
      ]
    }
  ];

  private getUserSegment(userId: string): string {
    // Simple hash-based assignment for consistent user experience
    const hash = this.hashCode(userId);
    return hash % 100 < 50 ? 'A' : 'B';
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getVariant(testId: string, userId: string): ABTestVariant | null {
    const test = this.tests.find(t => t.id === testId);
    if (!test || !test.enabled) return null;

    const segment = this.getUserSegment(userId);
    const variant = test.variants[segment === 'A' ? 0 : 1] || test.variants[0];

    // Track test exposure
    analytics.track('ab_test_exposure', {
      test_id: testId,
      variant_id: variant.id,
      user_id: userId,
      segment
    });

    return variant;
  }

  trackConversion(testId: string, variantId: string, userId: string, conversionType: string) {
    analytics.track('ab_test_conversion', {
      test_id: testId,
      variant_id: variantId,
      user_id: userId,
      conversion_type: conversionType,
      timestamp: Date.now()
    });
  }

  // Helper method to get variant config with fallback
  getVariantConfig(testId: string, userId: string, fallbackConfig: Record<string, any> = {}) {
    const variant = this.getVariant(testId, userId);
    return variant ? variant.config : fallbackConfig;
  }
}

export const abTesting = new ABTestingService();