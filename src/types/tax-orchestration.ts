import { Json } from '@/integrations/supabase/types';
import { PolicyBundle } from '@/lib/rulesync/rulesClient';

export interface TaxRuleBundle extends Omit<PolicyBundle, 'content'> {
  content: TaxRuleContent;
}

export interface TaxRuleContent {
  tax_year: number;
  effective_date: string;
  expires_date?: string;
  brackets?: TaxBracketRule[];
  deductions?: TaxDeductionRule[];
  estate_rules?: EstateRuleSet;
  retirement_rules?: RetirementRuleSet;
  meta: {
    source: 'IRS' | 'STATE' | 'MANUAL';
    authority: string;
    regulation_ref?: string;
    last_updated: string;
  };
}

export interface TaxBracketRule {
  filing_status: string;
  brackets: Array<{
    min_income: number;
    max_income: number | null;
    rate: number;
    bracket_order: number;
  }>;
}

export interface TaxDeductionRule {
  filing_status: string;
  deduction_type: 'standard' | 'itemized';
  amount: number;
  conditions?: Json;
}

export interface EstateRuleSet {
  federal_exemption: number;
  generation_skipping_exemption: number;
  annual_exclusion: number;
  state_exemptions: Array<{
    state: string;
    exemption: number;
    portability_allowed: boolean;
  }>;
  trust_rules: {
    ab_trust_threshold: number;
    dynasty_trust_allowed: boolean;
    gst_allocation_required: boolean;
  };
}

export interface RetirementRuleSet {
  secure_act: {
    ten_year_rule_start: string;
    eligible_designated_beneficiaries: string[];
    rmd_age: number;
  };
  roth_conversion: {
    no_rmd_required: boolean;
    backdoor_allowed: boolean;
    mega_backdoor_limits: number;
  };
  inherited_rules: {
    spouse_rollover_allowed: boolean;
    minor_child_stretch_until_majority: boolean;
    disabled_beneficiary_stretch: boolean;
  };
}

export interface TaxRuleOrchestration {
  resolveCurrentRules(domain: string, jurisdiction: string, year: number): Promise<TaxRuleBundle | null>;
  publishTaxUpdate(rules: TaxRuleContent, domain: string, jurisdiction: string): Promise<TaxRuleBundle>;
  validateRuleConsistency(rules: TaxRuleContent): Promise<ValidationResult>;
  getTaxRuleHistory(domain: string, jurisdiction: string): Promise<TaxRuleBundle[]>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}