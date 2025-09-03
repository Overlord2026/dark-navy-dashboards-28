import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const SwagRetirementAnalysisInputSchema = z.object({
  profile: z.object({
    client: z.object({ 
      firstName: z.string(), 
      lastName: z.string(), 
      age: z.number(),
      name: z.string().optional() // For compatibility
    }).optional(),
    spouse: z.object({ 
      firstName: z.string().optional(), 
      lastName: z.string().optional(), 
      age: z.number().optional(),
      name: z.string().optional() // For compatibility
    }).default({}),
    filingStatus: z.enum(["single","married_joint","married_separate","hoh"] as const).default("married_joint"),
    // Legacy compatibility fields moved to top level
    primaryClient: z.object({
      name: z.string(),
      age: z.number(),
      retirementAge: z.number().default(65),
      stateOfResidence: z.string().default(""),
      taxBracket: z.string().default("22%")
    }).optional(),
    assets: z.array(z.object({
      name: z.string(),
      balance: z.number(),
      type: z.string(),
      liquid: z.boolean().optional()
    })).optional(),
    goals: z.object({
      retirementAge: z.number().default(65),
      targetIncome: z.number().default(0)
    }).optional(),
    estateDocuments: z.record(z.string(), z.object({
      hasDocument: z.boolean(),
      lastUpdated: z.string().optional()
    })).optional(),
    stateOfResidence: z.string().optional(),
    taxBracket: z.string().optional()
  }),
  socialSecurity: z.object({ 
    clientStartAge: z.number(), 
    spouseStartAge: z.number().optional(), 
    colaPct: z.number().default(2.0),
    enabled: z.boolean().optional(),
    currentEarnings: z.number().optional(),
    earningsHistory: z.array(z.number()).optional(),
    filingAge: z.number().optional(),
    spousalBenefit: z.boolean().optional(),
    spousalEarnings: z.number().optional(),
    colaAdjustment: z.boolean().optional()
  }),
  assets: z.array(z.object({
    name: z.string(),
    balance: z.number(),
    taxType: z.enum(["qualified","roth","taxable","other"] as const),
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
  taxYear: z.number().optional(),
  phases: z.array(z.object({
    id: z.enum(['income-now', 'income-later', 'growth', 'legacy'] as const),
    name: z.string(),
    allocation: z.object({
      phaseId: z.string().optional(),
      stocks: z.number(),
      bonds: z.number(),
      alternatives: z.number(),
      cash: z.number(),
      allocatedAmount: z.number().optional(),
      projectedIncome: z.number().optional(),
      fundingStatus: z.string().optional(),
      recommendedActions: z.array(z.string()).optional()
    }),
    projection: z.object({
      phaseId: z.string().optional(),
      expectedReturn: z.number(),
      volatility: z.number(),
      projectedValue: z.number(),
      projectedBalance: z.number().optional(),
      withdrawalCapacity: z.number(),
      confidenceLevel: z.number().optional(),
      projectedIncome: z.number().optional(),
      shortfall: z.number().optional(),
      riskFactors: z.array(z.string()).optional()
    }),
    yearStart: z.number().optional(),
    yearEnd: z.number().optional(),
    investmentCategories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      allocation: z.number(),
      expectedReturn: z.number(),
      risk: z.number(),
      description: z.string().optional(),
      targetAllocation: z.number().optional(),
      riskLevel: z.string().optional()
    })).optional(),
    enabled: z.boolean().optional(),
    description: z.string().optional(),
    fundingRequirement: z.number().optional(),
    order: z.number().optional()
  })).optional(),
  // Additional compatibility fields  
  goals: z.object({
    retirementAge: z.number().default(65),
    targetIncome: z.number().default(0),
    retirementDate: z.date().optional(),
    currentAge: z.number().optional(),
    desiredLifestyle: z.string().optional(),
    annualRetirementIncome: z.number().optional(),
    inflationRate: z.number().optional(),
    lifeExpectancy: z.number().optional()
  }).optional(),
  expenses: z.array(z.object({
    id: z.string(),
    name: z.string(),
    currentAmount: z.number(),
    retirementAmount: z.number(),
    inflationProtected: z.boolean(),
    essential: z.boolean()
  })).optional(),
  pension: z.object({
    enabled: z.boolean(),
    monthlyBenefit: z.number(),
    startAge: z.number(),
    survivorBenefit: z.number(),
    colaProtection: z.boolean()
  }).optional(),
  accounts: z.array(z.object({
    id: z.string(),
    type: z.string(),
    balance: z.number(),
    annualContribution: z.number(),
    employerMatch: z.number().optional(),
    expectedReturn: z.number(),
    taxStatus: z.string(),
    requiredMinDistribution: z.boolean().optional(),
    rmdAge: z.number().optional()
  })).optional(),
  taxOptimization: z.object({
    withdrawalSequence: z.array(z.string()),
    rothConversionStrategy: z.boolean(),
    taxBracketManagement: z.boolean(),
    harvestLosses: z.boolean()
  }).optional(),
  healthcare: z.object({
    currentAge: z.number(),
    estimatedAnnualCost: z.number(),
    longTermCareInsurance: z.boolean(),
    longTermCareCost: z.number(),
    medicareSupplementation: z.boolean()
  }).optional(),
  legacy: z.object({
    targetInheritance: z.number(),
    charitableGiving: z.number(),
    estateTaxPlanning: z.boolean()
  }).optional()
});

export type SwagRetirementAnalysisInput = z.infer<typeof SwagRetirementAnalysisInputSchema>;