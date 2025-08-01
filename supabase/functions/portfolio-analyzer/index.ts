import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PortfolioHolding {
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
  sector?: string;
  expense_ratio?: number;
  dividend_yield?: number;
  beta?: number;
  weight_percent: number;
}

interface PortfolioAnalysis {
  total_value: number;
  holdings_count: number;
  asset_allocation: Record<string, number>;
  sector_allocation: Record<string, number>;
  concentration_risk: number;
  largest_position_weight: number;
}

interface RiskMetrics {
  overall_risk_score: number;
  beta: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  var_95: number;
  concentration_warnings: string[];
}

interface IncomeAnalysis {
  total_annual_income: number;
  weighted_yield: number;
  dividend_income: number;
  interest_income: number;
  distribution_frequency: Record<string, number>;
  income_reliability_score: number;
}

interface FeeAnalysis {
  weighted_expense_ratio: number;
  total_annual_fees: number;
  advisory_fees?: number;
  high_fee_holdings: PortfolioHolding[];
  fee_optimization_savings: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { file_path, holdings, client_name, client_email, analysis_type } = await req.json();

    console.log('Processing portfolio analysis for:', { client_name, analysis_type });

    let portfolioHoldings: PortfolioHolding[] = [];

    if (file_path) {
      // Process uploaded file
      portfolioHoldings = await parseStatementFile(supabase, file_path);
    } else if (holdings) {
      // Use manually entered holdings
      portfolioHoldings = await enhanceHoldings(holdings);
    } else {
      throw new Error('No portfolio data provided');
    }

    // Enhance holdings with market data and calculated weights
    const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.market_value, 0);
    portfolioHoldings = portfolioHoldings.map(holding => ({
      ...holding,
      weight_percent: (holding.market_value / totalValue) * 100
    }));

    // Calculate comprehensive analysis
    const analysis = calculatePortfolioAnalysis(portfolioHoldings);
    const riskMetrics = calculateRiskMetrics(portfolioHoldings, totalValue);
    const incomeAnalysis = calculateIncomeAnalysis(portfolioHoldings, totalValue);
    const feeAnalysis = calculateFeeAnalysis(portfolioHoldings, totalValue);

    // Get user's tenant for model comparison
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new Error('User tenant not found');
    }

    // Find best-fit models if comprehensive analysis
    let modelScores = [];
    if (analysis_type === 'comprehensive') {
      const { data: models, error: modelError } = await supabase
        .rpc('best_model_for_holdings', { holdings: portfolioHoldings });

      if (!modelError && models) {
        modelScores = models;
      }
    }

    // Create or update proposal if client info provided
    let proposalId = null;
    if (client_name) {
      const { data: proposal, error: proposalError } = await supabase
        .from('draft_proposals')
        .insert({
          tenant_id: profile.tenant_id,
          advisor_id: user.id,
          prospect_name: client_name,
          prospect_email: client_email || '',
          current_holdings: portfolioHoldings,
          model_scores: modelScores,
          proposal_data: {
            analysis_type,
            parsed_at: new Date().toISOString(),
            total_value: totalValue,
            risk_score: riskMetrics.overall_risk_score,
            annual_income: incomeAnalysis.total_annual_income,
            annual_fees: feeAnalysis.total_annual_fees
          }
        })
        .select()
        .single();

      if (!proposalError) {
        proposalId = proposal.id;
        
        // Log audit event
        await supabase.rpc('log_proposal_action', {
          p_proposal_id: proposal.id,
          p_action: 'analyze',
          p_details: {
            analysis_type,
            holdings_count: portfolioHoldings.length,
            total_value: totalValue,
            risk_score: riskMetrics.overall_risk_score
          }
        });
      }
    }

    console.log('Portfolio analysis completed successfully');

    return new Response(JSON.stringify({
      proposal_id: proposalId,
      holdings: portfolioHoldings,
      analysis,
      riskMetrics,
      incomeAnalysis,
      feeAnalysis,
      model_scores: modelScores,
      total_value: totalValue
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in portfolio-analyzer function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze portfolio'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function parseStatementFile(supabase: any, filePath: string): Promise<PortfolioHolding[]> {
  // Download and parse statement file
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('proposals')
    .download(filePath);

  if (downloadError) {
    throw new Error(`Failed to download file: ${downloadError.message}`);
  }

  // Determine file type and parse accordingly
  const fileName = filePath.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return await parsePDFStatement(fileData);
  } else if (fileName.endsWith('.csv')) {
    return await parseCSVStatement(fileData);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return await parseExcelStatement(fileData);
  } else {
    // Fallback to text parsing
    const text = await fileData.text();
    return parseTextStatement(text, fileName);
  }
}

async function parsePDFStatement(fileData: Blob): Promise<PortfolioHolding[]> {
  // For now, return mock data - would integrate with OCR service
  console.log('PDF parsing - would integrate with OCR service');
  
  return [
    {
      ticker: 'SPY',
      name: 'SPDR S&P 500 ETF Trust',
      quantity: 1000,
      market_value: 450000,
      cost_basis: 420000,
      asset_class: 'equity',
      sector: 'Diversified',
      expense_ratio: 0.09,
      dividend_yield: 1.8,
      beta: 1.0,
      weight_percent: 60
    },
    {
      ticker: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      quantity: 2000,
      market_value: 160000,
      cost_basis: 170000,
      asset_class: 'bond',
      sector: 'Fixed Income',
      expense_ratio: 0.03,
      dividend_yield: 2.5,
      beta: 0.1,
      weight_percent: 21.3
    },
    {
      ticker: 'VEA',
      name: 'Vanguard FTSE Developed Markets ETF',
      quantity: 2500,
      market_value: 140000,
      cost_basis: 135000,
      asset_class: 'international_equity',
      sector: 'International',
      expense_ratio: 0.05,
      dividend_yield: 2.8,
      beta: 0.9,
      weight_percent: 18.7
    }
  ];
}

async function parseCSVStatement(fileData: Blob): Promise<PortfolioHolding[]> {
  const text = await fileData.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const holdings: PortfolioHolding[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 3) continue;
    
    const holding: PortfolioHolding = {
      ticker: getValue(values, headers, 'ticker') || getValue(values, headers, 'symbol') || '',
      name: getValue(values, headers, 'name') || getValue(values, headers, 'description') || '',
      quantity: parseFloat(getValue(values, headers, 'quantity') || getValue(values, headers, 'shares') || '0'),
      market_value: parseFloat(getValue(values, headers, 'market_value') || getValue(values, headers, 'value') || '0'),
      cost_basis: parseFloat(getValue(values, headers, 'cost_basis') || '') || undefined,
      asset_class: getValue(values, headers, 'asset_class') || 'equity',
      sector: getValue(values, headers, 'sector') || undefined,
      expense_ratio: parseFloat(getValue(values, headers, 'expense_ratio') || '') || undefined,
      dividend_yield: parseFloat(getValue(values, headers, 'dividend_yield') || '') || undefined,
      beta: parseFloat(getValue(values, headers, 'beta') || '') || undefined,
      weight_percent: 0 // Will be calculated later
    };
    
    if (holding.ticker && holding.market_value > 0) {
      holdings.push(holding);
    }
  }
  
  return holdings;
}

function getValue(values: string[], headers: string[], key: string): string {
  const index = headers.findIndex(h => h.includes(key));
  return index >= 0 ? values[index]?.trim() : '';
}

async function parseExcelStatement(fileData: Blob): Promise<PortfolioHolding[]> {
  // Would integrate with Excel parsing library
  console.log('Excel parsing - would integrate with Excel parser');
  return [];
}

function parseTextStatement(text: string, fileName: string): Promise<PortfolioHolding[]> {
  // Enhanced text parsing logic
  const holdings: PortfolioHolding[] = [];
  const lines = text.split('\n');
  
  // Institution-specific parsing
  if (fileName.includes('schwab')) {
    return Promise.resolve(parseSchwabStatement(lines));
  } else if (fileName.includes('fidelity')) {
    return Promise.resolve(parseFidelityStatement(lines));
  } else if (fileName.includes('vanguard')) {
    return Promise.resolve(parseVanguardStatement(lines));
  }
  
  // Generic parsing
  return Promise.resolve(parseGenericStatement(lines));
}

function parseSchwabStatement(lines: string[]): PortfolioHolding[] {
  // Schwab-specific parsing logic
  return [];
}

function parseFidelityStatement(lines: string[]): PortfolioHolding[] {
  // Fidelity-specific parsing logic
  return [];
}

function parseVanguardStatement(lines: string[]): PortfolioHolding[] {
  // Vanguard-specific parsing logic
  return [];
}

function parseGenericStatement(lines: string[]): PortfolioHolding[] {
  // Generic statement parsing
  return [];
}

async function enhanceHoldings(holdings: any[]): Promise<PortfolioHolding[]> {
  // Enhance holdings with market data if available
  return holdings.map(holding => ({
    ticker: holding.ticker,
    name: holding.name,
    quantity: holding.quantity || 0,
    market_value: holding.market_value,
    cost_basis: holding.cost_basis,
    asset_class: holding.asset_class || 'equity',
    sector: holding.sector,
    expense_ratio: holding.expense_ratio,
    dividend_yield: holding.dividend_yield,
    beta: holding.beta || 1.0,
    weight_percent: 0 // Will be calculated
  }));
}

function calculatePortfolioAnalysis(holdings: PortfolioHolding[]): PortfolioAnalysis {
  const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
  
  // Asset allocation
  const assetAllocation = holdings.reduce((acc, h) => {
    acc[h.asset_class] = (acc[h.asset_class] || 0) + h.market_value;
    return acc;
  }, {} as Record<string, number>);

  // Convert to percentages
  Object.keys(assetAllocation).forEach(key => {
    assetAllocation[key] = (assetAllocation[key] / totalValue) * 100;
  });

  // Sector allocation
  const sectorAllocation = holdings.reduce((acc, h) => {
    const sector = h.sector || 'Unknown';
    acc[sector] = (acc[sector] || 0) + h.market_value;
    return acc;
  }, {} as Record<string, number>);

  Object.keys(sectorAllocation).forEach(key => {
    sectorAllocation[key] = (sectorAllocation[key] / totalValue) * 100;
  });

  const largestPosition = Math.max(...holdings.map(h => h.market_value));
  const largestPositionWeight = (largestPosition / totalValue) * 100;

  return {
    total_value: totalValue,
    holdings_count: holdings.length,
    asset_allocation: assetAllocation,
    sector_allocation: sectorAllocation,
    concentration_risk: largestPositionWeight > 10 ? largestPositionWeight : 0,
    largest_position_weight: largestPositionWeight
  };
}

function calculateRiskMetrics(holdings: PortfolioHolding[], totalValue: number): RiskMetrics {
  const weightedBeta = holdings.reduce((sum, h) => {
    const weight = h.market_value / totalValue;
    return sum + (weight * (h.beta || 1.0));
  }, 0);

  const concentrationWarnings = [];
  const maxPosition = Math.max(...holdings.map(h => h.market_value / totalValue * 100));
  
  if (maxPosition > 20) {
    concentrationWarnings.push(`Largest position represents ${maxPosition.toFixed(1)}% of portfolio`);
  }
  
  // Calculate overall risk score using multiple factors
  let riskScore = 0;
  
  // Asset allocation risk (40% weight)
  const equityWeight = holdings.reduce((sum, h) => {
    if (['equity', 'international_equity', 'emerging_markets'].includes(h.asset_class)) {
      return sum + (h.market_value / totalValue);
    }
    return sum;
  }, 0);
  
  riskScore += equityWeight * 70 * 0.4; // Higher equity = higher risk
  
  // Concentration risk (30% weight)
  const concentrationRisk = Math.min(maxPosition / 100, 0.5) * 100; // Cap at 50%
  riskScore += concentrationRisk * 0.3;
  
  // Volatility risk (20% weight)
  const volatilityRisk = weightedBeta * 50; // Beta-based volatility
  riskScore += volatilityRisk * 0.2;
  
  // Diversification risk (10% weight)
  const diversificationRisk = Math.max(0, (20 - holdings.length) / 20) * 100;
  riskScore += diversificationRisk * 0.1;

  return {
    overall_risk_score: Math.min(Math.max(Math.round(riskScore), 1), 100),
    beta: weightedBeta,
    volatility: 0.15 + (weightedBeta - 1) * 0.05, // Estimated volatility
    sharpe_ratio: 0.8, // Mock - would calculate from returns
    max_drawdown: 0.12, // Mock
    var_95: 0.08, // Mock
    concentration_warnings: concentrationWarnings
  };
}

function calculateIncomeAnalysis(holdings: PortfolioHolding[], totalValue: number): IncomeAnalysis {
  const totalAnnualIncome = holdings.reduce((sum, h) => {
    return sum + (h.market_value * (h.dividend_yield || 0) / 100);
  }, 0);

  const weightedYield = holdings.reduce((sum, h) => {
    const weight = h.market_value / totalValue;
    return sum + (weight * (h.dividend_yield || 0));
  }, 0);

  return {
    total_annual_income: totalAnnualIncome,
    weighted_yield: weightedYield,
    dividend_income: totalAnnualIncome * 0.8, // Mock split
    interest_income: totalAnnualIncome * 0.2, // Mock split
    distribution_frequency: {
      'Monthly': 0.2,
      'Quarterly': 0.6,
      'Annual': 0.2
    },
    income_reliability_score: 85 // Mock score
  };
}

function calculateFeeAnalysis(holdings: PortfolioHolding[], totalValue: number): FeeAnalysis {
  const weightedExpenseRatio = holdings.reduce((sum, h) => {
    const weight = h.market_value / totalValue;
    return sum + (weight * (h.expense_ratio || 0));
  }, 0);

  const totalAnnualFees = totalValue * (weightedExpenseRatio / 100);
  const highFeeHoldings = holdings.filter(h => (h.expense_ratio || 0) > 1.0);

  return {
    weighted_expense_ratio: weightedExpenseRatio,
    total_annual_fees: totalAnnualFees,
    advisory_fees: totalValue * 0.0125, // 1.25% advisory fee
    high_fee_holdings: highFeeHoldings,
    fee_optimization_savings: highFeeHoldings.reduce((sum, h) => {
      return sum + (h.market_value * 0.005); // Potential 0.5% savings
    }, 0)
  };
}