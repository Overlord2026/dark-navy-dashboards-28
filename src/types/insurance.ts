
export type InsurancePolicyType = 
  | "term-life" 
  | "permanent-life" 
  | "annuity" 
  | "health" 
  | "long-term-care" 
  | "homeowners" 
  | "auto" 
  | "umbrella";

export type PaymentFrequency = "monthly" | "quarterly" | "annually";

export interface InsuranceDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  type: InsurancePolicyType;
  provider: string;
  premium: number;
  frequency: PaymentFrequency;
  coverageAmount: number;
  startDate: string;
  endDate?: string;
  beneficiaries?: string;
  policyNumber?: string;
  documents?: InsuranceDocument[];
}
