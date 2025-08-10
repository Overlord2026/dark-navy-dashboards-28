import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { accountId, currentPositions, targetWeights, triggers } = await req.json();

    // Calculate rebalancing trades
    const trades = [];
    let rationale = `Rebalancing Analysis:\n`;

    for (const [assetClass, targetWeight] of Object.entries(targetWeights)) {
      const currentWeight = currentPositions[assetClass] || 0;
      const drift = Math.abs(targetWeight - currentWeight);
      
      if (drift > 0.05) { // 5% drift threshold
        trades.push({
          assetClass,
          action: targetWeight > currentWeight ? 'buy' : 'sell',
          amount: Math.abs(targetWeight - currentWeight),
          rationale: `Drift of ${drift.toFixed(2)}% exceeds threshold`
        });
      }
    }

    rationale += `Generated ${trades.length} trades\n`;
    rationale += `Triggers: ${triggers.join(', ')}\n`;

    // Save to audit table
    const { error } = await supabaseClient
      .from('recommendation_audit')
      .insert({
        user_id: 'system', // Replace with actual user ID
        input_snapshot: { accountId, currentPositions, targetWeights, triggers },
        optimization_results: { trades },
        rationale,
        rationale_hash: btoa(rationale),
        model_version: 'v1.0'
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ trades, rationale, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rebalancing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});