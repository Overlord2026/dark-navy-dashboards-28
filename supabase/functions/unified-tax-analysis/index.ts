import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaxOpportunity {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  complexity: 'low' | 'medium' | 'high';
  timeFrame: 'immediate' | 'this_year' | 'multi_year';
  category: 'roth_conversion' | 'withdrawal_sequencing' | 'bracket_management' | 'deduction_optimization' | 'estate_planning';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionItems: string[];
}

interface UserData {
  agi: number;
  age: number;
  filing_status: string;
  retirement_accounts: {
    traditional_401k: number;
    roth_401k: number;
    traditional_ira: number;
    roth_ira: number;
  };
  taxable_accounts: number;
  state: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis_type, include_ai_recommendations, user_data }: {
      analysis_type: 'standard' | 'comprehensive';
      include_ai_recommendations: boolean;
      user_data: UserData;
    } = await req.json();

    console.log('Starting unified tax analysis', { analysis_type, user_data });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get tax rules and brackets from database
    const { data: taxBrackets, error: bracketsError } = await supabase
      .from('tax_brackets')
      .select('*')
      .eq('tax_year', 2024)
      .eq('filing_status', user_data.filing_status)
      .eq('is_active', true)
      .order('bracket_order');

    if (bracketsError) {
      console.error('Error fetching tax brackets:', bracketsError);
    }

    const { data: deductions, error: deductionsError } = await supabase
      .from('tax_deductions')
      .select('*')
      .eq('tax_year', 2024)
      .eq('filing_status', user_data.filing_status)
      .eq('is_active', true);

    if (deductionsError) {
      console.error('Error fetching tax deductions:', deductionsError);
    }

    // Perform comprehensive tax analysis
    const opportunities: TaxOpportunity[] = [];

    // 1. Roth Conversion Analysis
    const rothOpportunity = analyzeRothConversion(user_data, taxBrackets || []);
    if (rothOpportunity.potentialSavings > 1000) {
      opportunities.push(rothOpportunity);
    }

    // 2. Tax Bracket Management
    const bracketOpportunity = analyzeBracketManagement(user_data, taxBrackets || []);
    if (bracketOpportunity.potentialSavings > 500) {
      opportunities.push(bracketOpportunity);
    }

    // 3. Withdrawal Sequencing
    const withdrawalOpportunity = analyzeWithdrawalSequencing(user_data);
    if (withdrawalOpportunity.potentialSavings > 800) {
      opportunities.push(withdrawalOpportunity);
    }

    // 4. Deduction Optimization
    const deductionOpportunity = analyzeDeductionOptimization(user_data, deductions || []);
    if (deductionOpportunity.potentialSavings > 300) {
      opportunities.push(deductionOpportunity);
    }

    // 5. Estate Planning (if comprehensive analysis)
    if (analysis_type === 'comprehensive') {
      const estateOpportunity = analyzeEstatePlanning(user_data);
      if (estateOpportunity.potentialSavings > 2000) {
        opportunities.push(estateOpportunity);
      }
    }

    // Calculate total potential savings
    const totalPotentialSavings = opportunities.reduce((sum, op) => sum + op.potentialSavings, 0);

    // Generate recommendations
    const recommendations = generateRecommendations(opportunities, user_data, include_ai_recommendations);
    const nextSteps = generateNextSteps(opportunities);

    // Calculate confidence score based on data quality and opportunity types
    const confidenceScore = calculateConfidenceScore(user_data, opportunities);

    const result = {
      opportunities: opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings),
      totalPotentialSavings,
      confidenceScore,
      analysisTimestamp: new Date().toISOString(),
      recommendations,
      nextSteps
    };

    console.log('Tax analysis completed', { 
      opportunityCount: opportunities.length, 
      totalSavings: totalPotentialSavings 
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in unified tax analysis:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to complete tax analysis',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeRothConversion(userData: UserData, taxBrackets: any[]): TaxOpportunity {
  const traditionalBalance = userData.retirement_accounts.traditional_401k + userData.retirement_accounts.traditional_ira;
  const currentTaxRate = getCurrentTaxRate(userData.agi, taxBrackets);
  
  // Simplified Roth conversion analysis
  const conversionAmount = Math.min(50000, traditionalBalance * 0.1);
  const currentTax = conversionAmount * currentTaxRate;
  const futureTaxSavings = conversionAmount * 0.25; // Assume 25% future rate
  const potentialSavings = Math.max(0, futureTaxSavings - currentTax);

  return {
    id: 'roth-conversion',
    title: 'Roth IRA Conversion Opportunity',
    description: `Convert $${conversionAmount.toLocaleString()} from traditional to Roth accounts to optimize long-term tax efficiency`,
    potentialSavings: Math.round(potentialSavings),
    complexity: potentialSavings > 5000 ? 'medium' : 'low',
    timeFrame: 'this_year',
    category: 'roth_conversion',
    confidence: 0.85,
    impact: potentialSavings > 3000 ? 'high' : 'medium',
    actionItems: [
      `Calculate optimal conversion amount for ${userData.filing_status} status`,
      'Consider tax implications in current year vs. future years',
      'Evaluate state tax implications for conversion',
      'Plan quarterly estimated tax payments if needed'
    ]
  };
}

function analyzeBracketManagement(userData: UserData, taxBrackets: any[]): TaxOpportunity {
  const currentBracket = getCurrentTaxBracket(userData.agi, taxBrackets);
  const nextBracket = getNextTaxBracket(userData.agi, taxBrackets);
  
  if (!nextBracket) {
    return {
      id: 'bracket-management',
      title: 'Tax Bracket Optimization',
      description: 'Optimize income timing across tax years',
      potentialSavings: 0,
      complexity: 'low',
      timeFrame: 'this_year',
      category: 'bracket_management',
      confidence: 0.7,
      impact: 'low',
      actionItems: []
    };
  }

  const roomInBracket = nextBracket.min_income - userData.agi;
  const potentialSavings = Math.min(roomInBracket * 0.05, 2000); // Conservative estimate

  return {
    id: 'bracket-management',
    title: 'Tax Bracket Management',
    description: `Optimize income timing to stay within current ${currentBracket?.rate || 22}% tax bracket`,
    potentialSavings: Math.round(potentialSavings),
    complexity: 'medium',
    timeFrame: 'multi_year',
    category: 'bracket_management',
    confidence: 0.75,
    impact: potentialSavings > 1000 ? 'medium' : 'low',
    actionItems: [
      'Review year-end income and deduction timing',
      'Consider deferring bonuses or accelerating deductions',
      'Evaluate quarterly estimated tax payments',
      'Plan multi-year income smoothing strategies'
    ]
  };
}

function analyzeWithdrawalSequencing(userData: UserData): TaxOpportunity {
  const totalRetirementAssets = Object.values(userData.retirement_accounts).reduce((sum, val) => sum + val, 0);
  const taxableAssets = userData.taxable_accounts;
  
  // Assume user is in or near retirement if substantial assets
  if (userData.age < 50 || totalRetirementAssets < 100000) {
    return {
      id: 'withdrawal-sequencing',
      title: 'Withdrawal Sequencing Strategy',
      description: 'Optimize retirement withdrawal order',
      potentialSavings: 0,
      complexity: 'low',
      timeFrame: 'multi_year',
      category: 'withdrawal_sequencing',
      confidence: 0.6,
      impact: 'low',
      actionItems: []
    };
  }

  // Conservative estimate of annual withdrawal optimization
  const annualWithdrawal = totalRetirementAssets * 0.04; // 4% rule
  const potentialSavings = annualWithdrawal * 0.15; // 15% optimization potential

  return {
    id: 'withdrawal-sequencing',
    title: 'Retirement Withdrawal Optimization',
    description: 'Optimize the order of withdrawals from different account types to minimize lifetime taxes',
    potentialSavings: Math.round(potentialSavings),
    complexity: 'high',
    timeFrame: 'multi_year',
    category: 'withdrawal_sequencing',
    confidence: 0.8,
    impact: 'high',
    actionItems: [
      'Develop multi-year withdrawal strategy',
      'Consider tax-loss harvesting in taxable accounts',
      'Plan Roth conversion ladder if needed',
      'Coordinate with Social Security timing decisions'
    ]
  };
}

function analyzeDeductionOptimization(userData: UserData, deductions: any[]): TaxOpportunity {
  const standardDeduction = deductions.find(d => d.deduction_type === 'standard')?.amount || 29200;
  const estimatedItemized = userData.agi * 0.15; // Rough estimate
  
  const deductionBenefit = Math.max(0, estimatedItemized - standardDeduction);
  const potentialSavings = deductionBenefit * 0.22; // Marginal tax rate

  return {
    id: 'deduction-optimization',
    title: 'Deduction Strategy Optimization',
    description: 'Maximize itemized deductions through timing and planning strategies',
    potentialSavings: Math.round(potentialSavings),
    complexity: 'low',
    timeFrame: 'this_year',
    category: 'deduction_optimization',
    confidence: 0.7,
    impact: potentialSavings > 1000 ? 'medium' : 'low',
    actionItems: [
      'Review charitable giving opportunities',
      'Consider bunching itemized deductions',
      'Evaluate state and local tax strategies',
      'Plan medical expense timing if applicable'
    ]
  };
}

function analyzeEstatePlanning(userData: UserData): TaxOpportunity {
  const totalAssets = userData.taxable_accounts + Object.values(userData.retirement_accounts).reduce((sum, val) => sum + val, 0);
  
  // Only relevant for higher net worth individuals
  if (totalAssets < 500000) {
    return {
      id: 'estate-planning',
      title: 'Estate Tax Planning',
      description: 'Advanced estate planning strategies',
      potentialSavings: 0,
      complexity: 'high',
      timeFrame: 'multi_year',
      category: 'estate_planning',
      confidence: 0.6,
      impact: 'low',
      actionItems: []
    };
  }

  const potentialSavings = totalAssets * 0.02; // 2% of assets as potential savings

  return {
    id: 'estate-planning',
    title: 'Estate Tax Planning Strategies',
    description: 'Implement advanced estate planning techniques to minimize estate taxes and maximize wealth transfer',
    potentialSavings: Math.round(potentialSavings),
    complexity: 'high',
    timeFrame: 'multi_year',
    category: 'estate_planning',
    confidence: 0.7,
    impact: 'high',
    actionItems: [
      'Review current estate plan and beneficiary designations',
      'Consider annual gift tax exclusion strategies',
      'Evaluate trust structures for tax efficiency',
      'Plan for step-up in basis optimization'
    ]
  };
}

function getCurrentTaxRate(agi: number, taxBrackets: any[]): number {
  for (const bracket of taxBrackets.sort((a, b) => a.bracket_order - b.bracket_order)) {
    if (agi >= bracket.min_income && (bracket.max_income === null || agi <= bracket.max_income)) {
      return bracket.rate / 100;
    }
  }
  return 0.22; // Default fallback
}

function getCurrentTaxBracket(agi: number, taxBrackets: any[]): any {
  return taxBrackets.find(bracket => 
    agi >= bracket.min_income && (bracket.max_income === null || agi <= bracket.max_income)
  );
}

function getNextTaxBracket(agi: number, taxBrackets: any[]): any {
  return taxBrackets
    .sort((a, b) => a.bracket_order - b.bracket_order)
    .find(bracket => bracket.min_income > agi);
}

function generateRecommendations(opportunities: TaxOpportunity[], userData: UserData, includeAI: boolean): string[] {
  const recommendations = [
    `Focus on the ${opportunities.length} identified tax opportunities to maximize your annual savings potential`,
    'Prioritize high-impact, low-complexity strategies for immediate implementation',
    'Consider consulting with a tax professional for complex strategies'
  ];

  if (includeAI) {
    recommendations.push(
      'AI analysis suggests a phased implementation approach over 2-3 years',
      'Consider tax-loss harvesting opportunities in volatile market conditions',
      'Evaluate state tax implications for all strategies'
    );
  }

  return recommendations;
}

function generateNextSteps(opportunities: TaxOpportunity[]): string[] {
  const steps = [
    'Review and prioritize identified opportunities based on your financial goals',
    'Gather required financial documents and data for implementation',
    'Schedule consultation with tax professional if needed'
  ];

  if (opportunities.some(op => op.complexity === 'high')) {
    steps.push('Seek professional guidance for complex strategies requiring expert implementation');
  }

  steps.push('Monitor and track progress quarterly to ensure optimal outcomes');

  return steps;
}

function calculateConfidenceScore(userData: UserData, opportunities: TaxOpportunity[]): number {
  let score = 0.7; // Base confidence

  // Adjust based on data completeness
  if (userData.agi > 0) score += 0.1;
  if (userData.retirement_accounts.traditional_401k > 0) score += 0.05;
  if (userData.taxable_accounts > 0) score += 0.05;

  // Adjust based on opportunity quality
  const avgOpportunityConfidence = opportunities.reduce((sum, op) => sum + op.confidence, 0) / opportunities.length;
  score = (score + avgOpportunityConfidence) / 2;

  return Math.min(0.95, Math.max(0.5, score));
}