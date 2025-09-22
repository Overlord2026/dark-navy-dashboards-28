import { BeneficiaryDesignation, BeneficiaryGap, BeneficiaryAnalysis, AdvancedEstateStrategy, StateEstateTaxRule } from '@/types/beneficiary-management';
import { secureActOptimizer } from './secureActOptimizer';
import { professionalCoordination } from './professionalCoordination';

export class BeneficiaryAnalyzer {
  private stateEstateTaxRules: Record<string, StateEstateTaxRule> = {
    'NY': {
      state: 'New York',
      exemption_amount: 6580000,
      tax_rate_schedule: [
        { min_amount: 0, max_amount: 500000, rate: 0.05 },
        { min_amount: 500000, max_amount: 1000000, rate: 0.07 },
        { min_amount: 1000000, max_amount: null, rate: 0.16 }
      ],
      portability_recognized: false,
      generation_skipping_tax: true,
      pickup_tax_only: false,
      effective_date: '2025-01-01'
    },
    'CA': {
      state: 'California',
      exemption_amount: 0, // No state estate tax
      tax_rate_schedule: [],
      portability_recognized: false,
      generation_skipping_tax: false,
      pickup_tax_only: false,
      effective_date: '2025-01-01'
    },
    'FL': {
      state: 'Florida',
      exemption_amount: 0, // No state estate tax
      tax_rate_schedule: [],
      portability_recognized: false,
      generation_skipping_tax: false,
      pickup_tax_only: false,
      effective_date: '2025-01-01'
    },
    'WA': {
      state: 'Washington',
      exemption_amount: 2193000,
      tax_rate_schedule: [
        { min_amount: 0, max_amount: 1000000, rate: 0.10 },
        { min_amount: 1000000, max_amount: 2000000, rate: 0.14 },
        { min_amount: 2000000, max_amount: null, rate: 0.20 }
      ],
      portability_recognized: false,
      generation_skipping_tax: true,
      pickup_tax_only: false,
      effective_date: '2025-01-01'
    }
  };

  analyzeAccountBeneficiaries(
    accounts: Array<{ id: string; name: string; type: string; balance: number }>,
    beneficiaries: BeneficiaryDesignation[]
  ): BeneficiaryGap[] {
    const gaps: BeneficiaryGap[] = [];

    for (const account of accounts) {
      const accountBeneficiaries = beneficiaries.filter(b => b.account_id === account.id);
      const primaryBeneficiaries = accountBeneficiaries.filter(b => b.beneficiary_type === 'primary');
      const contingentBeneficiaries = accountBeneficiaries.filter(b => b.beneficiary_type === 'contingent');

      // Check for missing primary beneficiaries
      if (primaryBeneficiaries.length === 0) {
        gaps.push({
          account_id: account.id,
          account_name: account.name,
          account_type: account.type,
          account_value: account.balance,
          gap_type: 'missing_primary',
          severity: 'critical',
          description: 'No primary beneficiaries designated',
          recommendation: 'Designate primary beneficiaries to avoid probate',
          estimated_probate_cost: account.balance * 0.05 // 5% of account value
        });
      }

      // Check for missing contingent beneficiaries
      if (contingentBeneficiaries.length === 0 && account.balance > 100000) {
        gaps.push({
          account_id: account.id,
          account_name: account.name,
          account_type: account.type,
          account_value: account.balance,
          gap_type: 'missing_contingent',
          severity: 'high',
          description: 'No contingent beneficiaries designated',
          recommendation: 'Add contingent beneficiaries for comprehensive planning',
          estimated_probate_cost: account.balance * 0.03
        });
      }

      // Check percentage allocations
      const primaryPercentage = primaryBeneficiaries.reduce((sum, b) => sum + b.percentage, 0);
      if (primaryPercentage !== 100 && primaryBeneficiaries.length > 0) {
        gaps.push({
          account_id: account.id,
          account_name: account.name,
          account_type: account.type,
          account_value: account.balance,
          gap_type: 'incomplete_percentage',
          severity: 'medium',
          description: `Primary beneficiaries total ${primaryPercentage}% instead of 100%`,
          recommendation: 'Adjust beneficiary percentages to total 100%'
        });
      }
    }

    return gaps;
  }

  generateAdvancedStrategies(
    totalEstateValue: number,
    maritalStatus: 'single' | 'married',
    state: string,
    hasChildren: boolean
  ): AdvancedEstateStrategy[] {
    const strategies: AdvancedEstateStrategy[] = [];
    const federalExemption = 14060000; // 2025 federal exemption
    const stateRule = this.stateEstateTaxRules[state];

    // AB Trust Strategy for married couples
    if (maritalStatus === 'married' && totalEstateValue > federalExemption) {
      strategies.push({
        id: crypto.randomUUID(),
        strategy_type: 'ab_trust',
        client_id: 'current-client',
        recommended: true,
        implemented: false,
        strategy_details: {
          trust_value: federalExemption,
          state_jurisdiction: state
        },
        tax_benefits: {
          estate_tax_savings: (totalEstateValue - federalExemption * 2) * 0.40,
          gift_tax_savings: 0,
          income_tax_benefits: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // GRAT Strategy for high-value estates
    if (totalEstateValue > 20000000) {
      strategies.push({
        id: crypto.randomUUID(),
        strategy_type: 'grat',
        client_id: 'current-client',
        recommended: true,
        implemented: false,
        strategy_details: {
          trust_value: 5000000,
          term_years: 10,
          annual_gift_amount: 500000
        },
        tax_benefits: {
          estate_tax_savings: 2000000,
          gift_tax_savings: 1500000,
          income_tax_benefits: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Dynasty Trust for multi-generational wealth
    if (totalEstateValue > 50000000 && hasChildren) {
      strategies.push({
        id: crypto.randomUUID(),
        strategy_type: 'dynasty_trust',
        client_id: 'current-client',
        recommended: true,
        implemented: false,
        strategy_details: {
          trust_value: 13610000, // GST exemption
          generation_skipping: true,
          state_jurisdiction: state === 'NY' ? 'NV' : state // Nevada for dynasty trusts
        },
        tax_benefits: {
          estate_tax_savings: 5000000,
          gift_tax_savings: 3000000,
          income_tax_benefits: 2000000
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return strategies;
  }

  generateFullAnalysis(
    accounts: Array<{ id: string; name: string; type: string; balance: number }>,
    beneficiaries: BeneficiaryDesignation[],
    clientState: string,
    maritalStatus: 'single' | 'married',
    hasChildren: boolean
  ): BeneficiaryAnalysis {
    const gaps = this.analyzeAccountBeneficiaries(accounts, beneficiaries);
    const totalAssetValue = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const accountsWithBeneficiaries = new Set(beneficiaries.map(b => b.account_id)).size;
    const undesignatedAccounts = accounts.filter(acc => 
      !beneficiaries.some(b => b.account_id === acc.id)
    );
    const undesignatedValue = undesignatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      total_accounts: accounts.length,
      accounts_with_beneficiaries: accountsWithBeneficiaries,
      accounts_missing_beneficiaries: accounts.length - accountsWithBeneficiaries,
      total_asset_value: totalAssetValue,
      undesignated_asset_value: undesignatedValue,
      estimated_probate_costs: gaps.reduce((sum, gap) => sum + (gap.estimated_probate_cost || 0), 0),
      gaps,
      recommended_strategies: this.generateAdvancedStrategies(totalAssetValue, maritalStatus, clientState, hasChildren),
      state_specific_considerations: [this.stateEstateTaxRules[clientState] || this.stateEstateTaxRules['CA']]
    };
  }
}

export const beneficiaryAnalyzer = new BeneficiaryAnalyzer();

// Convenience function for gap analysis
export async function analyzeBeneficiaryGaps(
  accountBeneficiaries: Array<{
    id: string;
    account_id: string;
    account_name: string;
    account_type: string;
    account_value: number;
    primary_beneficiaries: BeneficiaryDesignation[];
    contingent_beneficiaries: BeneficiaryDesignation[];
  }>
): Promise<BeneficiaryGap[]> {
  const accounts = accountBeneficiaries.map(ab => ({
    id: ab.account_id,
    name: ab.account_name,
    type: ab.account_type,
    balance: ab.account_value
  }));

  const allBeneficiaries = accountBeneficiaries.flatMap(ab => 
    [...ab.primary_beneficiaries, ...ab.contingent_beneficiaries]
  );

  return beneficiaryAnalyzer.analyzeAccountBeneficiaries(accounts, allBeneficiaries);
}