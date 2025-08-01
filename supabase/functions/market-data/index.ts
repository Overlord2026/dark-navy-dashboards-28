// Create an edge function for fetching market data
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  symbol: string;
  beta?: number;
  alpha?: number;
  volatility?: number;
  yield?: number;
  ytdReturn?: number;
  oneYearReturn?: number;
  lastUpdated: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    if (!symbols || !Array.isArray(symbols)) {
      throw new Error('Symbols array is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results: MarketData[] = [];

    // Check cache first
    const { data: cachedData } = await supabase
      .from('market_data_cache')
      .select('*')
      .in('symbol', symbols)
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // 24 hours cache

    const cachedSymbols = new Set(cachedData?.map(d => d.symbol) || []);
    const symbolsToFetch = symbols.filter(symbol => !cachedSymbols.has(symbol));

    // Add cached results
    cachedData?.forEach(data => {
      results.push({
        symbol: data.symbol,
        beta: data.beta,
        alpha: data.alpha,
        volatility: data.volatility,
        yield: data.yield,
        ytdReturn: data.ytd_return,
        oneYearReturn: data.one_year_return,
        lastUpdated: data.updated_at
      });
    });

    // Fetch new data for uncached symbols
    for (const symbol of symbolsToFetch) {
      try {
        console.log(`Fetching data for ${symbol}`);
        
        // Fetch overview data (includes beta, yield, etc.)
        const overviewResponse = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        const overviewData = await overviewResponse.json();

        // Fetch daily adjusted data for returns calculation
        const dailyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        const dailyData = await dailyResponse.json();

        let marketData: MarketData = {
          symbol,
          lastUpdated: new Date().toISOString()
        };

        // Extract data from Alpha Vantage response
        if (overviewData && !overviewData.Note && !overviewData['Error Message']) {
          marketData.beta = overviewData.Beta ? parseFloat(overviewData.Beta) : undefined;
          marketData.yield = overviewData.DividendYield ? parseFloat(overviewData.DividendYield) * 100 : undefined;
          
          // Calculate volatility from price data if available
          if (dailyData['Time Series (Daily)']) {
            const timeSeries = dailyData['Time Series (Daily)'];
            const dates = Object.keys(timeSeries).sort().reverse().slice(0, 252); // Last year of trading days
            
            if (dates.length > 20) {
              const prices = dates.map(date => parseFloat(timeSeries[date]['5. adjusted close']));
              const returns = [];
              
              for (let i = 1; i < prices.length; i++) {
                returns.push(Math.log(prices[i] / prices[i - 1]));
              }
              
              // Calculate standard deviation (annualized)
              const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
              const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
              marketData.volatility = Math.sqrt(variance * 252) * 100; // Annualized volatility
              
              // Calculate YTD and 1-year returns
              const currentPrice = prices[0];
              const yearAgoPrice = prices[Math.min(252, prices.length - 1)];
              const ytdStartPrice = prices[Math.min(getYTDTradingDays(), prices.length - 1)];
              
              if (yearAgoPrice) {
                marketData.oneYearReturn = ((currentPrice - yearAgoPrice) / yearAgoPrice) * 100;
              }
              if (ytdStartPrice) {
                marketData.ytdReturn = ((currentPrice - ytdStartPrice) / ytdStartPrice) * 100;
              }
            }
          }
        } else {
          marketData.error = overviewData.Note || overviewData['Error Message'] || 'Data unavailable';
        }

        results.push(marketData);

        // Cache the result
        await supabase
          .from('market_data_cache')
          .upsert({
            symbol,
            beta: marketData.beta,
            alpha: marketData.alpha,
            volatility: marketData.volatility,
            yield: marketData.yield,
            ytd_return: marketData.ytdReturn,
            one_year_return: marketData.oneYearReturn,
            error_message: marketData.error,
            updated_at: new Date().toISOString()
          });

        // Rate limiting - Alpha Vantage allows 5 calls per minute on free tier
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay

      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        results.push({
          symbol,
          error: 'Data unavailable',
          lastUpdated: new Date().toISOString()
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in market-data function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getYTDTradingDays(): number {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const diffTime = Math.abs(now.getTime() - yearStart.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays * 0.7); // Approximate trading days (weekdays)
}