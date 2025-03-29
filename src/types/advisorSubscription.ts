
export interface AdvisorSubscriptionFeature {
  id: string;
  name: string;
  included: boolean;
}

export interface AdvisorSubscriptionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: AdvisorSubscriptionFeature[];
  active: boolean;
}

export interface AdvisorDiscount {
  id: string;
  name: string;
  percentage: number;
  active: boolean;
}
