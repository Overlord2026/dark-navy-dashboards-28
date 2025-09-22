export interface Estate2025Rules {
  federal: {
    estate_exemption: number;
    gift_annual_exclusion: number;
    gst_exemption: number;
    sunset_warning: {
      enabled: boolean;
      reversion_year: number;
      estimated_reversion_amount: number;
    };
  };
  state_exemptions: StateEstateExemption[];
  portability: {
    federal_available: boolean;
    state_recognition: Record<string, boolean>;
  };
}

export interface StateEstateExemption {
  state: string;
  exemption_amount: number;
  tax_rate_max: number;
  portability_allowed: boolean;
  effective_date: string;
}

export interface EstateStrategyAnalysis {
  client_profile: {
    estate_value: number;
    marital_status: 'single' | 'married';
    state: string;
    age: number;
  };
  current_exposure: {
    federal_tax_due: number;
    state_tax_due: number;
    total_tax_exposure: number;
  };
  sunset_impact: {
    post_2026_federal_tax: number;
    additional_tax_risk: number;
    urgency_score: number;
  };
  recommended_strategies: RecommendedStrategy[];
}

export interface RecommendedStrategy {
  id: string;
  strategy_name: string;
  description: string;
  potential_savings: number;
  implementation_urgency: 'low' | 'medium' | 'high' | 'critical';
  time_sensitive: boolean;
  professional_required: ('attorney' | 'cpa' | 'advisor')[];
  ab_trust_analysis?: ABTrustAnalysis;
}

export interface ABTrustAnalysis {
  recommended: boolean;
  vs_portability: {
    ab_trust_benefit: number;
    portability_benefit: number;
    net_advantage: number;
  };
  state_considerations: string[];
  implementation_cost: number;
  ongoing_complexity: 'low' | 'medium' | 'high';
}