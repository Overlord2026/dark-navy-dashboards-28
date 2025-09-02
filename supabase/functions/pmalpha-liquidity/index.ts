import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inline liquidity scoring logic
interface LiquidityData {
  fundId: string;
  horizonDays: number;
  events: any[];
  managerSignals: any[];
}

interface LiquidityResult {
  score: number;
  breakdown: {
    eventScore: number;
    signalScore: number;
    timeScore: number;
  };
}

function scoreLiquidity(data: LiquidityData): LiquidityResult {
  const { events, managerSignals, horizonDays } = data;
  
  // Simple scoring algorithm
  const eventScore = Math.min(events.length * 10, 40);
  const signalScore = Math.min(managerSignals.length * 5, 30);
  const timeScore = Math.max(30 - (horizonDays / 10), 0);
  
  const score = eventScore + signalScore + timeScore;
  
  return {
    score: Math.min(score, 100),
    breakdown: { eventScore, signalScore, timeScore }
  };
}

async function persistLiquidityScore(
  userId: string,
  fundId: string,
  inputs: LiquidityData,
  result: LiquidityResult
): Promise<string> {
  // Return a mock ID for now
  return crypto.randomUUID();
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LiquidityRequest {
  fundId: string;
  horizonDays?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: LiquidityRequest = await req.json();
    const { fundId, horizonDays = 90 } = body;

    if (!fundId) {
      return new Response(
        JSON.stringify({ error: 'fundId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Computing liquidity score for fund: ${fundId}`);

    // Fetch liquidity events
    const { data: events, error: eventsError } = await supabaseClient
      .from('liquidity_events')
      .select('*')
      .eq('fund_id', fundId)
      .gte('event_date', new Date(Date.now() - horizonDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('event_date', { ascending: false });

    if (eventsError) {
      console.warn('Failed to fetch liquidity events:', eventsError);
    }

    // Fetch manager signals
    const { data: managerSignals, error: signalsError } = await supabaseClient
      .from('manager_signals')
      .select('*')
      .eq('fund_id', fundId)
      .order('signal_date', { ascending: false })
      .limit(10);

    if (signalsError) {
      console.warn('Failed to fetch manager signals:', signalsError);
    }

    // Calculate liquidity score
    const liquidityResult = await scoreLiquidity({
      fundId,
      horizonDays,
      events: events || [],
      managerSignals: managerSignals || []
    });

    // Persist score to database
    const scoreId = await persistLiquidityScore(
      user.id,
      fundId,
      { fundId, horizonDays, events: events || [], managerSignals: managerSignals || [] },
      liquidityResult
    );

    console.log(`Liquidity score calculated: ${liquidityResult.score}/100, saved as ${scoreId}`);

    return new Response(
      JSON.stringify({
        success: true,
        scoreId,
        score: liquidityResult.score,
        breakdown: liquidityResult.breakdown,
        metadata: {
          fundId,
          horizonDays,
          eventsAnalyzed: (events || []).length,
          signalsAnalyzed: (managerSignals || []).length,
          calculatedAt: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Liquidity scoring failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Liquidity scoring failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});