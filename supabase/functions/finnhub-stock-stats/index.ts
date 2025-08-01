import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockStats {
  ticker: string;
  name: string;
  sector: string;
  beta: number;
  volatility: number;
  yield: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  price: number;
  marketValue?: number;
}

async function fetchStockStats(ticker: string): Promise<StockStats> {
  console.log(`Fetching data for ticker: ${ticker}`);
  
  try {
    // Fetch company profile
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${finnhubApiKey}`
    );
    const profile = await profileResponse.json();

    // Fetch current quote
    const quoteResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhubApiKey}`
    );
    const quote = await quoteResponse.json();

    // Fetch metrics
    const metricsResponse = await fetch(
      `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${finnhubApiKey}`
    );
    const metrics = await metricsResponse.json();

    // Rate limiting: Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      ticker,
      name: profile.name || ticker,
      sector: profile.finnhubIndustry || 'Unknown',
      beta: metrics.metric?.beta || 1.0,
      volatility: metrics.metric?.volatility || 0,
      yield: metrics.metric?.dividendYieldIndicatedAnnual || 0,
      oneYearReturn: metrics.metric?.['52WeekPriceReturnDaily'] || 0,
      threeYearReturn: metrics.metric?.['3YearAnnualizedReturn'] || 0,
      fiveYearReturn: metrics.metric?.['5YearAnnualizedReturn'] || 0,
      price: quote.c || 0
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    // Return fallback data
    return {
      ticker,
      name: ticker,
      sector: 'Unknown',
      beta: 1.0,
      volatility: 0.15,
      yield: 0,
      oneYearReturn: 0,
      threeYearReturn: 0,
      fiveYearReturn: 0,
      price: 0
    };
  }
}

function calculatePortfolioBeta(holdings: Array<StockStats & { weight: number }>): number {
  return holdings.reduce((portfolioBeta, holding) => {
    return portfolioBeta + (holding.beta * holding.weight);
  }, 0);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tickers, holdings } = await req.json();
    
    if (!finnhubApiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    console.log(`Processing ${tickers?.length || 0} tickers`);

    // Fetch stats for all tickers
    const portfolioStats = await Promise.all(
      tickers.map((ticker: string) => fetchStockStats(ticker))
    );

    // If holdings data is provided, calculate portfolio metrics
    let portfolioMetrics = null;
    if (holdings && Array.isArray(holdings)) {
      const holdingsWithStats = holdings.map(holding => {
        const stats = portfolioStats.find(stat => stat.ticker === holding.ticker);
        return {
          ...holding,
          ...stats,
          weight: holding.marketValue / holdings.reduce((sum, h) => sum + h.marketValue, 0)
        };
      });

      const portfolioBeta = calculatePortfolioBeta(holdingsWithStats);
      const avgVolatility = holdingsWithStats.reduce((sum, h) => sum + (h.volatility * h.weight), 0);
      const avgYield = holdingsWithStats.reduce((sum, h) => sum + (h.yield * h.weight), 0);

      portfolioMetrics = {
        portfolioBeta,
        avgVolatility,
        avgYield,
        riskLevel: portfolioBeta > 1.2 ? 'Aggressive' : portfolioBeta > 0.8 ? 'Growth' : 'Moderate',
        volatilityVsSP500: ((portfolioBeta - 1) * 100).toFixed(1) + '%',
        holdingsWithStats
      };
    }

    const response = {
      success: true,
      data: portfolioStats,
      portfolioMetrics,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in finnhub-stock-stats function:', error);
    
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