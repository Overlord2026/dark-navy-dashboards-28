
export interface SubscriptionFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number | string;
  description: string;
  features: SubscriptionFeature[];
  recommended?: boolean;
  buttonText: string;
  color?: string;
}

export type SubscriptionTierType = 'basic' | 'premium' | 'elite';
