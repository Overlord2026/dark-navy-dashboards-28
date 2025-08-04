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
    const { address } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Getting property valuation for: ${address}`);

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate realistic property valuation data
    const baseValue = Math.floor(Math.random() * 700000) + 300000;
    const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
    const estimatedValue = Math.floor(baseValue * randomFactor);
    
    // Generate a recent date for "last updated"
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 14); // 0-14 days ago
    const lastUpdated = new Date(today);
    lastUpdated.setDate(today.getDate() - daysAgo);
    
    // Random confidence level based on price range
    let confidence: 'high' | 'medium' | 'low';
    const confidenceRandom = Math.random();
    if (confidenceRandom > 0.7) confidence = 'high';
    else if (confidenceRandom > 0.3) confidence = 'medium';
    else confidence = 'low';

    const valuation = {
      estimatedValue,
      lastUpdated: lastUpdated.toISOString().split('T')[0],
      confidence,
      source: 'Property Valuation API'
    };

    return new Response(
      JSON.stringify(valuation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in property-valuation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});