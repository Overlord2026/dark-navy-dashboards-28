// SWAG Retirement Roadmap™ Types
export interface SwagPhase {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number | null; // null for ongoing phases like Legacy
  description: string;
  fundingRequirement: number;
  investmentCategories: InvestmentCategory[];
  enabled: boolean;
  order: number;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  description: string;
  targetAllocation: number; // percentage
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  expectedReturn: number;
  products: InvestmentProduct[];
}

export interface InvestmentProduct {
  id: string;
  name: string;
  type: string;
  description: string;
  minimumInvestment: number;
  expectedReturn: number;
  fees: number;
  liquidity: 'high' | 'medium' | 'low';
}

export interface EnhancedProfile {
  // Client & Family
  primaryClient: {
    name: string;
    age: number;
    occupation: string;
    retirementAge: number;
  };
  spouse?: {
    name: string;
    age: number;
    occupation: string;
    retirementAge: number;
  };
  dependents: Array<{
    name: string;
    age: number;
    relationship: string;
    supportYears: number;
  }>;
  
  // Beneficiaries
  beneficiaries: Array<{
    name: string;
    relationship: string;
    percentage: number;
    contingent: boolean;
  }>;
  
  // Professional Team
  professionals: {
    attorney?: {
      name: string;
      firm: string;
      contact: string;
      specialties: string[];
    };
    accountant?: {
      name: string;
      firm: string;
      contact: string;
      specialties: string[];
    };
    insuranceAgent?: {
      name: string;
      company: string;
      contact: string;
    };
  };
  
  // Estate Documents
  estateDocuments: {
    will: { hasDocument: boolean; lastUpdated?: Date; location?: string };
    trust: { hasDocument: boolean; lastUpdated?: Date; location?: string; type?: string };
    powerOfAttorney: { hasDocument: boolean; lastUpdated?: Date; location?: string };
    healthDirectives: { hasDocument: boolean; lastUpdated?: Date; location?: string };
    digitalAssets: { hasDocument: boolean; lastUpdated?: Date; location?: string };
  };
  
  // Location & Tax
  stateOfResidence: string;
  taxBracket: number;
  
  // Assets - Expanded
  assets: {
    liquid: AssetAccount[];
    taxable: AssetAccount[];
    taxDeferred: AssetAccount[];
    roth: AssetAccount[];
    realEstate: RealEstateAsset[];
    business: BusinessAsset[];
    digitalAssets: DigitalAsset[];
    insurance: InsuranceAsset[];
    annuities: AnnuityAsset[];
    collectibles: CollectibleAsset[];
  };
  
  // Income Sources - Detailed
  incomeStreams: {
    employment: EmploymentIncome[];
    socialSecurity: SocialSecurityProjection;
    pensions: PensionIncome[];
    rental: RentalIncome[];
    business: BusinessIncome[];
    investments: InvestmentIncome[];
    other: OtherIncome[];
  };
  
  // Expenses - Granular
  expenses: {
    housing: ExpenseDetail;
    transportation: ExpenseDetail;
    food: ExpenseDetail;
    healthcare: ExpenseDetail;
    insurance: ExpenseDetail;
    entertainment: ExpenseDetail;
    education: ExpenseDetail;
    charitable: ExpenseDetail;
    other: ExpenseDetail;
    totalMonthly: number;
    inflationAssumption: number;
  };
}

export interface AssetAccount {
  id: string;
  institution: string;
  accountType: string;
  balance: number;
  contributionLimit?: number;
  currentContribution: number;
  employerMatch?: number;
  expectedReturn: number;
  fees: number;
}

export interface RealEstateAsset {
  id: string;
  propertyType: string;
  address: string;
  currentValue: number;
  mortgageBalance: number;
  rentalIncome?: number;
  expenses: number;
  appreciationRate: number;
}

export interface BusinessAsset {
  id: string;
  businessName: string;
  ownership: number;
  currentValue: number;
  cashFlow: number;
  growthRate: number;
  exitStrategy?: string;
  exitTimeline?: number;
}

export interface DigitalAsset {
  id: string;
  assetType: string;
  description: string;
  currentValue: number;
  volatility: 'low' | 'medium' | 'high' | 'extreme';
}

export interface InsuranceAsset {
  id: string;
  policyType: string;
  deathBenefit: number;
  cashValue: number;
  premiumAnnual: number;
  beneficiaries: string[];
}

export interface AnnuityAsset {
  id: string;
  annuityType: string;
  currentValue: number;
  monthlyPayment: number;
  startDate: Date;
  guaranteedPeriod: number;
}

export interface CollectibleAsset {
  id: string;
  category: string;
  description: string;
  currentValue: number;
  appreciationRate: number;
  liquidity: 'low' | 'medium' | 'high';
}

export interface EmploymentIncome {
  id: string;
  employer: string;
  salary: number;
  bonus: number;
  commission: number;
  growthRate: number;
  endAge: number;
}

export interface SocialSecurityProjection {
  primaryBenefitAge67: number;
  spousalBenefit?: number;
  filingStrategy: string;
  taxable: boolean;
}

export interface PensionIncome {
  id: string;
  provider: string;
  monthlyBenefit: number;
  startAge: number;
  survivorBenefit: number;
  colaAdjustment: boolean;
}

export interface RentalIncome {
  id: string;
  propertyAddress: string;
  monthlyRent: number;
  expenses: number;
  netIncome: number;
  growthRate: number;
}

export interface BusinessIncome {
  id: string;
  businessName: string;
  currentIncome: number;
  growthRate: number;
  retirementValue: number;
}

export interface InvestmentIncome {
  id: string;
  source: string;
  currentIncome: number;
  growthRate: number;
  reinvestmentRate: number;
}

export interface OtherIncome {
  id: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  endDate?: Date;
}

export interface ExpenseDetail {
  current: number;
  retirement: number;
  inflationProtected: boolean;
  essential: boolean;
  notes?: string;
}

export interface PhaseAllocation {
  phaseId: string;
  allocatedAmount: number;
  projectedIncome: number;
  fundingStatus: 'underfunded' | 'on_track' | 'overfunded';
  recommendedActions: string[];
}

export interface SwagRetirementAnalysisInput extends RetirementAnalysisInput {
  profile: EnhancedProfile;
  phases: SwagPhase[];
}

export interface SwagRetirementAnalysisResults extends RetirementAnalysisResults {
  phaseAllocations: PhaseAllocation[];
  phaseProjections: PhaseProjection[];
  investmentAllocationSummary: AllocationSummary;
}

export interface PhaseProjection {
  phaseId: string;
  projectedBalance: number;
  projectedIncome: number;
  shortfall: number;
  confidenceLevel: number;
  riskFactors: string[];
}

export interface AllocationSummary {
  totalPortfolioValue: number;
  allocationByPhase: Array<{
    phaseId: string;
    allocation: number;
    percentage: number;
  }>;
  allocationByAccount: Array<{
    accountId: string;
    allocation: number;
    targetPhase: string;
  }>;
  rebalancingNeeded: boolean;
  recommendations: string[];
}

export interface WhiteLabelConfig {
  phases: SwagPhase[];
  investmentMappings: InvestmentMapping[];
  brandingSettings: BrandingSettings;
  enabledFeatures: string[];
}

export interface InvestmentMapping {
  id: string;
  accountType: string;
  defaultPhase: string;
  allocationRules: AllocationRule[];
}

export interface AllocationRule {
  condition: string;
  targetPhase: string;
  percentage: number;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  companyName: string;
  footerText?: string;
  disclaimers: string[];
}

// Import existing types
import { RetirementAnalysisInput, RetirementAnalysisResults } from './retirement';