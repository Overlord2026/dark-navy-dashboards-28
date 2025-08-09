import { analytics } from './analytics';

interface ExperimentConfig {
  name: string;
  variants: string[];
  weights?: number[];
  enabled: boolean;
}

const experiments: Record<string, ExperimentConfig> = {
  leadEmailCTA_v1: {
    name: 'Lead Email CTA Test',
    variants: ['control', 'variant_a', 'variant_b'],
    weights: [0.33, 0.33, 0.34],
    enabled: true
  },
  proposalFollowUp_v1: {
    name: 'Proposal Follow-up Test',
    variants: ['control', 'urgent', 'value_focused'],
    weights: [0.4, 0.3, 0.3],
    enabled: true
  },
  valueCalculatorLink_v1: {
    name: 'Value Calculator Link Test',
    variants: ['control', 'personalized', 'urgency'],
    weights: [0.5, 0.25, 0.25],
    enabled: true
  }
};

// Simple hash function for consistent user assignment
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get user identifier for consistent experiment assignment
function getUserId(): string {
  // Try to get from session storage first
  let userId = sessionStorage.getItem('experiment_user_id');
  
  if (!userId) {
    // Generate a simple user ID based on browser fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Experiment fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    userId = hashCode(fingerprint + navigator.userAgent + screen.width + screen.height).toString();
    
    sessionStorage.setItem('experiment_user_id', userId);
  }
  
  return userId;
}

// Main A/B testing function
export function ab(experimentKey: string): string {
  const experiment = experiments[experimentKey];
  
  if (!experiment || !experiment.enabled) {
    return 'control';
  }
  
  const userId = getUserId();
  const hash = hashCode(experimentKey + userId);
  const normalized = hash / Number.MAX_SAFE_INTEGER;
  
  const weights = experiment.weights || experiment.variants.map(() => 1 / experiment.variants.length);
  let cumulativeWeight = 0;
  
  for (let i = 0; i < experiment.variants.length; i++) {
    cumulativeWeight += weights[i];
    if (normalized < cumulativeWeight) {
      const variant = experiment.variants[i];
      
      // Track experiment exposure
      analytics.track('experiment_exposed', {
        experiment_name: experiment.name,
        experiment_key: experimentKey,
        variant,
        user_id: userId,
        timestamp: Date.now()
      });
      
      return variant;
    }
  }
  
  // Fallback to control
  return experiment.variants[0] || 'control';
}

// Track experiment conversion
export function trackExperimentConversion(experimentKey: string, conversionEvent: string, properties?: Record<string, any>) {
  const experiment = experiments[experimentKey];
  
  if (!experiment || !experiment.enabled) {
    return;
  }
  
  const userId = getUserId();
  const variant = ab(experimentKey); // This will also track exposure if not already tracked
  
  analytics.track('experiment_conversion', {
    experiment_name: experiment.name,
    experiment_key: experimentKey,
    variant,
    conversion_event: conversionEvent,
    user_id: userId,
    timestamp: Date.now(),
    ...properties
  });
}

// Get experiment configuration (for debugging)
export function getExperimentConfig(experimentKey: string): ExperimentConfig | null {
  return experiments[experimentKey] || null;
}

// Get all active experiments (for debugging)
export function getActiveExperiments(): Record<string, ExperimentConfig> {
  return Object.fromEntries(
    Object.entries(experiments).filter(([_, config]) => config.enabled)
  );
}

// Helper function to get variant-specific content
export function getVariantContent<T>(experimentKey: string, contentMap: Record<string, T>, fallback: T): T {
  const variant = ab(experimentKey);
  return contentMap[variant] || fallback;
}

// Example usage:
// const emailCTA = getVariantContent('leadEmailCTA_v1', {
//   control: 'Schedule a Call',
//   variant_a: 'Book Your Free Consultation',
//   variant_b: 'Get Your Personalized Plan'
// }, 'Schedule a Call');