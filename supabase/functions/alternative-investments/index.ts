import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const altsApiKey = Deno.env.get('ALTS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlternativeInvestment {
  id: string;
  name: string;
  type: string;
  minimumInvestment: number;
  targetReturn: number;
  riskLevel: string;
  liquidity: string;
  description: string;
  status: string;
  assetClass: string;
  geography: string;
  vintage: string;
  committed: number;
  called: number;
  distributed: number;
  nav: number;
  irr: number;
  tvpi: number;
  dpi: number;
}

interface PortfolioSummary {
  totalCommitted: number;
  totalCalled: number;
  totalDistributed: number;
  totalNav: number;
  portfolioIrr: number;
  portfolioTvpi: number;
  portfolioDpi: number;
  assetClassBreakdown: Record<string, number>;
  geographyBreakdown: Record<string, number>;
  vintageBreakdown: Record<string, number>;
}

async function fetchCAISData(userId: string): Promise<AlternativeInvestment[]> {
  console.log(`Fetching CAIS data for user: ${userId}`);
  
  try {
    // CAIS API integration - This is a mock implementation
    // In production, you would connect to the actual CAIS API
    const response = await fetch('https://api.cais.com/v1/investments', {
      headers: {
        'Authorization': `Bearer ${altsApiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`CAIS API error: ${response.status}`);
    }

    const data = await response.json();
    return data.investments || [];
  } catch (error) {
    console.error('Error fetching CAIS data:', error);
    
    // Return mock data for demo purposes
    return [
      {
        id: 'pe-fund-001',
        name: 'Vista Equity Partners Fund VIII',
        type: 'Private Equity',
        minimumInvestment: 250000,
        targetReturn: 15.5,
        riskLevel: 'High',
        liquidity: '7-10 years',
        description: 'Technology-focused buyout fund targeting enterprise software companies',
        status: 'Active',
        assetClass: 'Private Equity',
        geography: 'North America',
        vintage: '2021',
        committed: 500000,
        called: 325000,
        distributed: 85000,
        nav: 380000,
        irr: 18.2,
        tvpi: 1.43,
        dpi: 0.26
      },
      {
        id: 'credit-fund-002',
        name: 'Apollo Strategic Fund III',
        type: 'Private Credit',
        minimumInvestment: 100000,
        targetReturn: 12.0,
        riskLevel: 'Medium-High',
        liquidity: '5-7 years',
        description: 'Direct lending to middle-market companies',
        status: 'Active',
        assetClass: 'Private Credit',
        geography: 'North America',
        vintage: '2022',
        committed: 300000,
        called: 280000,
        distributed: 45000,
        nav: 295000,
        irr: 13.8,
        tvpi: 1.21,
        dpi: 0.16
      },
      {
        id: 'real-estate-003',
        name: 'Blackstone Real Estate Partners X',
        type: 'Real Estate',
        minimumInvestment: 500000,
        targetReturn: 14.0,
        riskLevel: 'Medium-High',
        liquidity: '5-8 years',
        description: 'Opportunistic real estate investments across sectors',
        status: 'Active',
        assetClass: 'Real Estate',
        geography: 'Global',
        vintage: '2023',
        committed: 750000,
        called: 450000,
        distributed: 0,
        nav: 465000,
        irr: 8.5,
        tvpi: 1.03,
        dpi: 0.00
      }
    ];
  }
}

async function fetchiCapitalData(userId: string): Promise<AlternativeInvestment[]> {
  console.log(`Fetching iCapital data for user: ${userId}`);
  
  try {
    // iCapital API integration - Mock implementation
    const response = await fetch('https://api.icapital.com/v1/portfolio', {
      headers: {
        'Authorization': `API-Key ${altsApiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`iCapital API error: ${response.status}`);
    }

    const data = await response.json();
    return data.positions || [];
  } catch (error) {
    console.error('Error fetching iCapital data:', error);
    
    // Return mock data
    return [
      {
        id: 'hedge-fund-001',
        name: 'Citadel Wellington Fund',
        type: 'Hedge Fund',
        minimumInvestment: 1000000,
        targetReturn: 10.0,
        riskLevel: 'Medium',
        liquidity: 'Quarterly',
        description: 'Multi-strategy hedge fund with focus on equity long/short',
        status: 'Active',
        assetClass: 'Hedge Funds',
        geography: 'Global',
        vintage: '2023',
        committed: 1000000,
        called: 1000000,
        distributed: 125000,
        nav: 1080000,
        irr: 12.5,
        tvpi: 1.21,
        dpi: 0.13
      }
    ];
  }
}

function calculatePortfolioSummary(investments: AlternativeInvestment[]): PortfolioSummary {
  const summary: PortfolioSummary = {
    totalCommitted: 0,
    totalCalled: 0,
    totalDistributed: 0,
    totalNav: 0,
    portfolioIrr: 0,
    portfolioTvpi: 0,
    portfolioDpi: 0,
    assetClassBreakdown: {},
    geographyBreakdown: {},
    vintageBreakdown: {}
  };

  investments.forEach(investment => {
    summary.totalCommitted += investment.committed;
    summary.totalCalled += investment.called;
    summary.totalDistributed += investment.distributed;
    summary.totalNav += investment.nav;

    // Asset class breakdown
    summary.assetClassBreakdown[investment.assetClass] = 
      (summary.assetClassBreakdown[investment.assetClass] || 0) + investment.nav;

    // Geography breakdown
    summary.geographyBreakdown[investment.geography] = 
      (summary.geographyBreakdown[investment.geography] || 0) + investment.nav;

    // Vintage breakdown
    summary.vintageBreakdown[investment.vintage] = 
      (summary.vintageBreakdown[investment.vintage] || 0) + investment.nav;
  });

  // Calculate weighted average metrics
  if (summary.totalNav > 0) {
    summary.portfolioIrr = investments.reduce((sum, inv) => 
      sum + (inv.irr * (inv.nav / summary.totalNav)), 0);
    
    summary.portfolioTvpi = (summary.totalNav + summary.totalDistributed) / summary.totalCalled;
    summary.portfolioDpi = summary.totalDistributed / summary.totalCalled;
  }

  return summary;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider = 'cais', userId, action = 'portfolio' } = await req.json();
    
    if (!altsApiKey) {
      throw new Error('ALTS_API_KEY not configured');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log(`Processing alternative investments request: ${action} for provider: ${provider}`);

    let investments: AlternativeInvestment[] = [];

    // Fetch data based on provider
    switch (provider) {
      case 'cais':
        investments = await fetchCAISData(userId);
        break;
      case 'icapital':
        investments = await fetchiCapitalData(userId);
        break;
      case 'yieldstreet':
        // Yieldstreet integration would go here
        investments = [];
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    // Process based on action
    let responseData;
    switch (action) {
      case 'portfolio':
        const portfolioSummary = calculatePortfolioSummary(investments);
        responseData = {
          investments,
          summary: portfolioSummary,
          provider,
          lastUpdated: new Date().toISOString()
        };
        break;
      
      case 'opportunities':
        // Filter for available investment opportunities
        responseData = {
          opportunities: investments.filter(inv => inv.status === 'Open for Investment'),
          provider,
          lastUpdated: new Date().toISOString()
        };
        break;
        
      case 'performance':
        // Return performance analytics
        const summary = calculatePortfolioSummary(investments);
        responseData = {
          performance: {
            irr: summary.portfolioIrr,
            tvpi: summary.portfolioTvpi,
            dpi: summary.portfolioDpi,
            totalValue: summary.totalNav + summary.totalDistributed,
            totalCommitted: summary.totalCommitted
          },
          benchmarks: {
            publicEquity: 9.8,
            bonds: 3.2,
            realEstate: 8.5
          },
          provider,
          lastUpdated: new Date().toISOString()
        };
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    const response = {
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in alternative-investments function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});