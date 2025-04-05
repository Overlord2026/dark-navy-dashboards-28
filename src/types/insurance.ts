export interface InsurancePolicy {
  id: string;
  name: string;
  provider: string;
  type: string;
  premium: number;
  coverage: number;
  status: "active" | "pending" | "expired";
  policyNumber: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  documents?: string[];
  frequency?: "monthly" | "quarterly" | "annually";
  coverageAmount?: number;
  beneficiaries?: string;
}

export interface HealthInsurancePolicy extends InsurancePolicy {
  deductible: number;
  coInsurance: number;
  outOfPocketMax: number;
  coverageType: "individual" | "family";
  network: string;
}

export interface PropertyInsurancePolicy extends InsurancePolicy {
  propertyAddress: string;
  propertyType: string;
  deductible: number;
  liabilityCoverage: number;
  personalPropertyCoverage: number;
}

export interface UmbrellaInsurancePolicy extends InsurancePolicy {
  coverageLimit: number;
  underlyingPolicies: string[];
  deductible: number;
}

export interface AutoInsurancePolicy extends InsurancePolicy {
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  liabilityCoverage: number;
  collisionDeductible: number;
  comprehensiveDeductible: number;
}

export interface LifeInsurancePolicy extends InsurancePolicy {
  beneficiaries: string[];
  deathBenefit: number;
  policyType: "term" | "whole" | "universal" | "variable";
  termLength?: number; // Only for term policies
  cashValue?: number; // For whole, universal, and variable policies
}

export interface DisabilityInsurancePolicy extends InsurancePolicy {
  benefitAmount: number;
  eliminationPeriod: number; // in days
  benefitPeriod: string;
  ownOccupation: boolean;
  residualBenefits: boolean;
}

export interface LongTermCareInsurancePolicy extends InsurancePolicy {
  dailyBenefit: number;
  benefitPeriod: string;
  eliminationPeriod: number; // in days
  inflationProtection: boolean;
  homeCare: boolean;
}
