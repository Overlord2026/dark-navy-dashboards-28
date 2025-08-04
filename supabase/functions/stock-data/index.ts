import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');

    if (!TWELVE_DATA_API_KEY || !ALPHA_VANTAGE_API_KEY) {
      console.error('Missing required API keys');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const normalizedSymbol = symbol.toUpperCase().trim();
    console.log(`Fetching stock data for: ${normalizedSymbol}`);

    // Try Twelve Data API first
    const twelveDataResponse = await fetch(
      `https://api.twelvedata.com/quote?symbol=${normalizedSymbol}&apikey=${TWELVE_DATA_API_KEY}`
    );
    
    if (twelveDataResponse.ok) {
      const twelveData = await twelveDataResponse.json();
      
      if (twelveData.symbol && !twelveData.code) {
        // Get additional data from Alpha Vantage
        const overviewResponse = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${normalizedSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        
        let overviewData = {};
        if (overviewResponse.ok) {
          overviewData = await overviewResponse.json();
        }

        const stockData = {
          symbol: normalizedSymbol,
          companyName: twelveData.name || normalizedSymbol,
          sector: overviewData.Sector || 'Unknown',
          industry: overviewData.Industry || 'Unknown',
          price: parseFloat(twelveData.close) || 0,
          change: parseFloat(twelveData.change) || 0,
          changePercent: parseFloat(twelveData.percent_change) || 0,
          marketCap: overviewData.MarketCapitalization ? parseFloat(overviewData.MarketCapitalization) : null,
          peRatio: overviewData.PERatio ? parseFloat(overviewData.PERatio) : null,
          dividendYield: overviewData.DividendYield ? parseFloat(overviewData.DividendYield) : null,
          volume: parseInt(twelveData.volume) || 0,
          avgVolume: parseInt(twelveData.average_volume) || parseInt(twelveData.volume) || 0,
          week52High: overviewData['52WeekHigh'] ? parseFloat(overviewData['52WeekHigh']) : null,
          week52Low: overviewData['52WeekLow'] ? parseFloat(overviewData['52WeekLow']) : null,
          isLoading: false
        };

        return new Response(
          JSON.stringify(stockData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Fallback to Alpha Vantage
    const quoteResponse = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${normalizedSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (quoteResponse.ok) {
      const quoteData = await quoteResponse.json();
      
      if (quoteData["Global Quote"]) {
        const globalQuote = quoteData["Global Quote"];
        
        const stockData = {
          symbol: normalizedSymbol,
          companyName: normalizedSymbol,
          sector: 'Unknown',
          industry: 'Unknown',
          price: parseFloat(globalQuote["05. price"]) || 0,
          change: parseFloat(globalQuote["09. change"]) || 0,
          changePercent: parseFloat(globalQuote["10. change percent"]?.replace('%', '')) || 0,
          marketCap: null,
          peRatio: null,
          dividendYield: null,
          volume: parseInt(globalQuote["06. volume"]) || 0,
          avgVolume: parseInt(globalQuote["06. volume"]) || 0,
          week52High: null,
          week52Low: null,
          isLoading: false
        };

        return new Response(
          JSON.stringify(stockData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Return error if all APIs failed
    return new Response(
      JSON.stringify({ 
        error: 'Could not fetch stock data from any provider',
        symbol: normalizedSymbol 
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in stock-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});