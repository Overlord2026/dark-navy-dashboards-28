
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockAnalysisRequest {
  stockData: any;
  analysisType: 'stock' | 'portfolio';
  portfolioName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('SECURITY ALERT: OPENAI_API_KEY not found in Supabase Edge Function secrets');
      return new Response(
        JSON.stringify({ 
          error: 'API configuration error',
          details: 'OpenAI API key not configured in Supabase Edge Function secrets' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { stockData, analysisType, portfolioName }: StockAnalysisRequest = await req.json();

    let prompt: string;
    let maxTokens: number;

    if (analysisType === 'portfolio' && Array.isArray(stockData)) {
      // Portfolio analysis
      const portfolioSummary = stockData.map(stock => 
        `${stock.symbol} (${stock.companyName}): $${stock.price}, Weight: ${stock.weight}%, Sector: ${stock.sector}`
      ).join('\n');

      prompt = `
        Analyze the following investment portfolio named "${portfolioName}":
        
        ${portfolioSummary}
        
        Provide a comprehensive portfolio analysis (max 300 words) covering:
        1. Overall portfolio composition and diversification
        2. Sector allocation assessment
        3. Risk exposure and volatility assessment
        4. Recommendations for potential rebalancing or adjustments
        5. Market outlook for this portfolio composition
        
        Format the response in 4-5 paragraphs without any preamble or introduction.
      `;
      maxTokens = 800;
    } else {
      // Individual stock analysis
      prompt = `
        Analyze the following stock data for ${stockData.companyName} (${stockData.symbol}):
        - Current Price: $${stockData.price}
        - Change: ${stockData.change > 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)
        - Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A'}
        - P/E Ratio: ${stockData.peRatio || 'N/A'}
        - Dividend Yield: ${stockData.dividendYield ? stockData.dividendYield.toFixed(2) + '%' : 'N/A'}
        - Sector: ${stockData.sector}
        - Industry: ${stockData.industry}
        - 52 Week High: ${stockData.week52High ? '$' + stockData.week52High : 'N/A'}
        - 52 Week Low: ${stockData.week52Low ? '$' + stockData.week52Low : 'N/A'}
        
        Provide a concise investment analysis (max 200 words) covering:
        1. Brief overview of recent performance
        2. Valuation assessment (undervalued/overvalued)
        3. Key strengths and risks
        4. Investment outlook (short and mid-term)
        
        Format the response in 3-4 short paragraphs without any preamble or introduction.
      `;
      maxTokens = 500;
    }

    console.log('Making secure OpenAI API request via Edge Function');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: analysisType === 'portfolio' 
              ? "You are a portfolio manager with expertise in asset allocation and investment strategy. Provide concise, professional portfolio analysis."
              : "You are a financial advisor with expertise in stock analysis. Provide concise, professional insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Analysis generation failed',
          details: errorData.error?.message || 'Unknown OpenAI API error'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Analysis could not be generated.";

    console.log('AI analysis generated successfully via secure Edge Function');

    return new Response(
      JSON.stringify({ 
        analysis,
        analysisType,
        generatedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in AI analysis Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
