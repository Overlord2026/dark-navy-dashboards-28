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
      id: 'onboarding_progress_display',
      name: 'Onboarding Progress Bar Display',
      enabled: true,
      variants: [
        {
          id: 'percentage',
          name: 'Show % Complete',
          weight: 50,
          config: { displayType: 'percentage', format: '% complete' }
        },
        {
          id: 'steps',
          name: 'Show Steps Remaining',
          weight: 50,
          config: { displayType: 'steps', format: 'steps remaining' }
        }
      ]
    },
    {
      id: 'welcome_banner_text',
      name: 'Welcome Banner Message',
      enabled: true,
      variants: [
        {
          id: 'welcome',
          name: 'Welcome Message',
          weight: 50,
          config: { greeting: 'Welcome, {name}!', tone: 'friendly' }
        },
        {
          id: 'family_office',
          name: 'Family Office Ready',
          weight: 50,
          config: { greeting: 'Your Family Office is Ready, {name}!', tone: 'professional' }
        }
      ]
    },
    {
      id: 'confetti_animation',
      name: 'Milestone Celebration Animation',
      enabled: true,
      variants: [
        {
          id: 'fullscreen',
          name: 'Full-screen Burst',
          weight: 50,
          config: { animationType: 'fullscreen', intensity: 'high', numberOfPieces: 200 }
        },
        {
          id: 'subtle',
          name: 'Subtle Card Sparkle',
          weight: 50,
          config: { animationType: 'contained', intensity: 'low', numberOfPieces: 50 }
        }
      ]
    },
    {
      id: 'education_cta',
      name: 'Education Recommendations CTA',
      enabled: true,
      variants: [
        {
          id: 'start_learning',
          name: 'Start Learning CTA',
          weight: 50,
          config: { buttonText: 'Start Learning', description: 'Begin your educational journey' }
        },
        {
          id: 'curated',
          name: 'Curated for You CTA',
          weight: 50,
          config: { buttonText: 'Curated for You', description: 'Personalized content selection' }
        }
      ]
    },
    {
      id: 'action_button_style',
      name: 'Quick Action Button Style',
      enabled: true,
      variants: [
        {
          id: 'icon_only',
          name: 'Icon Only',
          weight: 50,
          config: { showLabels: false, style: 'minimal' }
        },
        {
          id: 'icon_label',
          name: 'Icon + Label',
          weight: 50,
          config: { showLabels: true, style: 'descriptive' }
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

  // Dashboard-specific metrics tracking
  trackDashboardMetrics(userId: string, metrics: {
    timeOnDashboard?: number;
    npsScore?: number;
    onboardingCompleted?: boolean;
    interactionType?: string;
  }) {
    analytics.track('dashboard_metrics', {
      user_id: userId,
      ...metrics,
      timestamp: Date.now()
    });
  }

  trackTimeOnDashboard(userId: string, timeSpent: number) {
    this.trackDashboardMetrics(userId, { timeOnDashboard: timeSpent });
  }

  trackNPS(userId: string, score: number) {
    this.trackDashboardMetrics(userId, { npsScore: score });
  }

  trackOnboardingCompletion(userId: string) {
    this.trackDashboardMetrics(userId, { onboardingCompleted: true });
  }

  // Helper method to get variant config with fallback
  getVariantConfig(testId: string, userId: string, fallbackConfig: Record<string, any> = {}) {
    const variant = this.getVariant(testId, userId);
    return variant ? variant.config : fallbackConfig;
  }
}

export const abTesting = new ABTestingService();