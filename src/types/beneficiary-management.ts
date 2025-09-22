export interface BeneficiaryDesignation {
  id: string;
  account_id: string;
  beneficiary_type: 'primary' | 'contingent';
  beneficiary_name: string;
  relationship: string;
  percentage: number;
  trust_name?: string;
  trust_type?: 'revocable' | 'irrevocable' | 'charitable';
  per_stirpes: boolean;
  date_of_birth?: string;
  ssn_last_four?: string;
  created_at: string;
  updated_at: string;
}

export interface BeneficiaryGap {
  account_id: string;
  account_name: string;
  account_type: string;
  account_value: number;
  gap_type: 'missing_primary' | 'missing_contingent' | 'incomplete_percentage' | 'outdated_designation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  estimated_probate_cost?: number;
}

export interface AdvancedEstateStrategy {
  id: string;
  strategy_type: 'ab_trust' | 'grat' | 'ilit' | 'qprt' | 'charitable_remainder' | 'dynasty_trust';
  client_id: string;
  recommended: boolean;
  implemented: boolean;
  strategy_details: {
    trust_value?: number;
    annual_gift_amount?: number;
    term_years?: number;
    remainder_percentage?: number;
    generation_skipping?: boolean;
    state_jurisdiction?: string;
  };
  tax_benefits: {
    estate_tax_savings: number;
    gift_tax_savings: number;
    income_tax_benefits: number;
  };
  created_at: string;
  updated_at: string;
}

export interface StateEstateTaxRule {
  state: string;
  exemption_amount: number;
  tax_rate_schedule: Array<{
    min_amount: number;
    max_amount: number | null;
    rate: number;
  }>;
  portability_recognized: boolean;
  generation_skipping_tax: boolean;
  pickup_tax_only: boolean;
  effective_date: string;
}

export interface BeneficiaryAnalysis {
  total_accounts: number;
  accounts_with_beneficiaries: number;
  accounts_missing_beneficiaries: number;
  total_asset_value: number;
  undesignated_asset_value: number;
  estimated_probate_costs: number;
  gaps: BeneficiaryGap[];
  recommended_strategies: AdvancedEstateStrategy[];
  state_specific_considerations: StateEstateTaxRule[];
}