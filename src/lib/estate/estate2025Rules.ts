import { Estate2025Rules, StateEstateExemption, EstateStrategyAnalysis, ABTrustAnalysis } from '@/types/estate-2025';

// 2025 Federal Estate Tax Updates
export const FEDERAL_2025_RULES: Estate2025Rules['federal'] = {
  estate_exemption: 14060000, // $14.06M for 2025
  gift_annual_exclusion: 19000, // $19,000 for 2025 (up from $18,000)
  gst_exemption: 14060000, // GST matches estate exemption
  sunset_warning: {
    enabled: true,
    reversion_year: 2026,
    estimated_reversion_amount: 7000000, // Approximately $7M estimated reversion
  },
};

// State Estate Tax Exemptions for 2025
export const STATE_2025_EXEMPTIONS: StateEstateExemption[] = [
  { state: 'CT', exemption_amount: 12920000, tax_rate_max: 0.12, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'DC', exemption_amount: 4710100, tax_rate_max: 0.16, portability_allowed: true, effective_date: '2025-01-01' },
  { state: 'HI', exemption_amount: 5490000, tax_rate_max: 0.20, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'IL', exemption_amount: 4000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'ME', exemption_amount: 6800000, tax_rate_max: 0.12, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'MD', exemption_amount: 5000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'MA', exemption_amount: 2000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'MN', exemption_amount: 3000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'NY', exemption_amount: 6940000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'OR', exemption_amount: 1000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'RI', exemption_amount: 1774583, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'VT', exemption_amount: 5000000, tax_rate_max: 0.16, portability_allowed: false, effective_date: '2025-01-01' },
  { state: 'WA', exemption_amount: 2193000, tax_rate_max: 0.20, portability_allowed: false, effective_date: '2025-01-01' },
];

export const ESTATE_2025_RULES: Estate2025Rules = {
  federal: FEDERAL_2025_RULES,
  state_exemptions: STATE_2025_EXEMPTIONS,
  portability: {
    federal_available: true,
    state_recognition: {
      'DC': true, // Only DC recognizes federal portability
      'CT': false, 'HI': false, 'IL': false, 'ME': false,
      'MD': false, 'MA': false, 'MN': false, 'NY': false,
      'OR': false, 'RI': false, 'VT': false, 'WA': false,
    },
  },
};

export class Estate2025Calculator {
  static calculateFederalTax(estateValue: number, maritalStatus: 'single' | 'married', usedExemption = 0): number {
    const exemption = maritalStatus === 'married' 
      ? FEDERAL_2025_RULES.estate_exemption * 2 - usedExemption
      : FEDERAL_2025_RULES.estate_exemption - usedExemption;
    
    const taxableEstate = Math.max(0, estateValue - exemption);
    return taxableEstate * 0.40; // 40% federal estate tax rate
  }

  static calculateStateTax(estateValue: number, state: string): number {
    const stateRule = STATE_2025_EXEMPTIONS.find(s => s.state === state);
    if (!stateRule) return 0;

    const taxableEstate = Math.max(0, estateValue - stateRule.exemption_amount);
    return taxableEstate * stateRule.tax_rate_max;
  }

  static calculateSunsetImpact(estateValue: number, maritalStatus: 'single' | 'married'): number {
    const currentTax = this.calculateFederalTax(estateValue, maritalStatus);
    
    // Estimated post-sunset exemption (~$7M)
    const sunsetExemption = maritalStatus === 'married' 
      ? FEDERAL_2025_RULES.sunset_warning.estimated_reversion_amount * 2
      : FEDERAL_2025_RULES.sunset_warning.estimated_reversion_amount;
    
    const sunsetTaxableEstate = Math.max(0, estateValue - sunsetExemption);
    const sunsetTax = sunsetTaxableEstate * 0.40;
    
    return sunsetTax - currentTax;
  }

  static analyzeABTrustStrategy(
    estateValue: number, 
    state: string, 
    firstSpouseToPassAway: boolean = false
  ): ABTrustAnalysis {
    const stateRule = STATE_2025_EXEMPTIONS.find(s => s.state === state);
    const stateAllowsPortability = stateRule?.portability_allowed || false;

    // AB Trust: Each spouse uses their exemption immediately
    const abTrustSavings = firstSpouseToPassAway 
      ? this.calculateFederalTax(estateValue, 'single', 0) + this.calculateStateTax(estateValue, state)
      : 0;

    // Portability: Second spouse can use both exemptions
    const portabilitySavings = this.calculateFederalTax(estateValue, 'married', 0) + 
      (stateAllowsPortability ? this.calculateStateTax(estateValue, state) : this.calculateStateTax(estateValue, state) * 2);

    return {
      recommended: !stateAllowsPortability || estateValue > FEDERAL_2025_RULES.estate_exemption * 2,
      vs_portability: {
        ab_trust_benefit: abTrustSavings,
        portability_benefit: portabilitySavings,
        net_advantage: abTrustSavings - portabilitySavings,
      },
      state_considerations: [
        stateAllowsPortability 
          ? `${state} recognizes federal portability`
          : `${state} does not recognize federal portability - AB Trust provides state tax benefits`,
      ],
      implementation_cost: 15000, // Estimated legal fees
      ongoing_complexity: stateAllowsPortability ? 'medium' : 'high',
    };
  }

  static generateUrgencyScore(estateValue: number, maritalStatus: 'single' | 'married', age: number): number {
    const sunsetImpact = this.calculateSunsetImpact(estateValue, maritalStatus);
    const yearsToSunset = 2026 - new Date().getFullYear();
    const ageRisk = age > 65 ? (age - 65) * 0.1 : 0;
    
    // Higher urgency for larger sunset impact, older clients, less time remaining
    return Math.min(100, 
      (sunsetImpact / 1000000) * 10 + // $1M sunset impact = 10 points
      ageRisk * 5 + // Age over 65 adds urgency
      (5 - yearsToSunset) * 10 // Less time = more urgency
    );
  }
}