import { z } from "zod";

export const SwagRetirementAnalysisInputSchema = z.object({
  profile: z.object({
    client: z.object({ 
      firstName: z.string(), 
      lastName: z.string(), 
      age: z.number() 
    }),
    spouse: z.object({ 
      firstName: z.string().optional(), 
      lastName: z.string().optional(), 
      age: z.number().optional() 
    }),
    filingStatus: z.enum(["single","married_joint","married_separate","hoh"]).default("married_joint"),
  }),
  socialSecurity: z.object({ 
    clientStartAge: z.number(), 
    spouseStartAge: z.number().optional(), 
    colaPct: z.number().default(2.0) 
  }),
  assets: z.array(z.object({
    name: z.string(),
    balance: z.number(),
    taxType: z.enum(["qualified","roth","taxable","other"]),
    produces1099: z.boolean().default(false)
  })),
  assumptions: z.object({
    inflation: z.number(),
    returns: z.object({
      incomeNow: z.number(),
      incomeLater: z.number(),
      growth: z.number(),
      legacy: z.number(),
    }),
    reserveAmount: z.number().default(0),
  }),
  liabilities: z.array(z.object({ 
    type: z.string(), 
    balance: z.number(), 
    rate: z.number().optional() 
  })).default([]),
  stress: z.object({
    ltc: z.object({ 
      startAge: z.number().optional(), 
      years: z.number().optional(), 
      monthlyCost: z.number().optional() 
    }).optional()
  }).default({}),
  taxYear: z.number().optional()
});

export type SwagRetirementAnalysisInput = z.infer<typeof SwagRetirementAnalysisInputSchema>;

// Legacy compatibility types for existing code
export interface SwagRetirementAnalysisResults {
  successProbability: number;
  projectedValue: number;
  worstCase: number;
  phases: SwagPhase[];
  recommendations: string[];
  readinessScore?: number;
  monthlyIncomeGap?: number;
  monteCarlo?: {
    successProbability: number;
    worstCase10th: number;
    medianPortfolioValue: number;
    swagScore?: number;
  };
  phaseAllocations?: PhaseAllocation[];
  phaseProjections?: PhaseProjection[];
  investmentAllocationSummary?: any;
}

export interface SwagPhase {
  id: 'income-now' | 'income-later' | 'growth' | 'legacy';
  name: string;
  allocation: PhaseAllocation;
  projection: PhaseProjection;
  yearStart?: number;
  yearEnd?: number;
  investmentCategories?: InvestmentCategory[];
  enabled?: boolean;
  description?: string;
  fundingRequirement?: number;
  order?: number;
}

export interface PhaseAllocation {
  phaseId?: string;
  stocks: number;
  bonds: number;
  alternatives: number;
  cash: number;
  allocatedAmount?: number;
  projectedIncome?: number;
  fundingStatus?: string;
  recommendedActions?: string[];
}

export interface PhaseProjection {
  phaseId?: string;
  expectedReturn: number;
  volatility: number;
  projectedValue: number;
  projectedBalance?: number;
  withdrawalCapacity: number;
  confidenceLevel?: number;
  projectedIncome?: number;
  shortfall?: number;
  riskFactors?: string[];
}

export interface EnhancedProfile {
  primaryClient: {
    name: string;
    age: number;
    retirementAge: number;
    stateOfResidence: string;
    taxBracket: string;
    occupation?: string;
  };
  spouse?: {
    name: string;
    age: number;
  };
  client: {
    firstName: string;
    lastName: string;
    age: number;
  };
  filingStatus: string;
  assets: Array<{
    name: string;
    balance: number;
    type: string;
    liquid?: boolean;
  }>;
  goals: {
    retirementAge: number;
    targetIncome: number;
  };
  phases?: SwagPhase[];
  estateDocuments: {
    [key: string]: {
      hasDocument: boolean;
      lastUpdated?: string;
    };
  };
}

export interface InvestmentCategory {
  id: string;
  name: string;
  allocation: number;
  expectedReturn: number;
  risk: number;
  description?: string;
  targetAllocation?: number;
  riskLevel?: string;
}

export interface WhiteLabelConfig {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phases?: SwagPhase[];
  brandingSettings?: any;
  enabledFeatures?: {
    [key: string]: boolean;
  };
}

// Additional compatibility types for SWAG input
export interface SwagRetirementAnalysisInputExtended extends SwagRetirementAnalysisInput {
  phases?: SwagPhase[];
  primaryClient?: {
    name: string;
    age: number;
    retirementAge: number;
    stateOfResidence: string;
    taxBracket: string;
  };
  goals?: {
    retirementAge: number;
    targetIncome: number;
  };
  estateDocuments?: {
    [key: string]: {
      hasDocument: boolean;
      lastUpdated?: string;
    };
  };
}