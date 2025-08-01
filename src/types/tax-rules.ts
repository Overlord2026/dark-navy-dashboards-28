import { Json } from '@/integrations/supabase/types';

export interface TaxBracket {
  id: string;
  tax_year: number;
  filing_status: string;
  min_income: number;
  max_income: number | null;
  rate: number;
  bracket_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxDeduction {
  id: string;
  tax_year: number;
  deduction_type: string;
  filing_status: string;
  amount: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxRule {
  id: string;
  rule_type: string;
  rule_name: string;
  rule_value: Json;
  effective_year: number;
  expires_year?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type FilingStatus = 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household';

export interface TaxCalculationInputs {
  income: number;
  filingStatus: FilingStatus;
  taxYear: number;
  age?: number;
  deductions?: number;
}