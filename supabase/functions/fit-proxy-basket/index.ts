import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../_shared/secrets.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Runtime checks
void SUPABASE_URL; void SUPABASE_SERVICE_ROLE_KEY;

const supabase = admin;

// placeholder constrained fit (equal-weights over provided tickers)
function fitExposures(tickers: string[]) {
  const w = 1 / Math.max(tickers.length, 1);
  return tickers.map(t => ({ symbol: t, weight: w }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fund_id, tickers = ["AGG","SPY","HYG"], policy_hash = "policy_v1" } = await req.json();
    console.log(`Fitting proxy basket for fund ${fund_id} with tickers:`, tickers);

    // (In production: fetch public series and solve constrained OLS)
    const exposures = fitExposures(tickers);

    const { error } = await supabase.from("proxy_baskets").insert({
      tenant_id: null, 
      fund_id, 
      exposures, 
      alpha: 0, 
      beta: 1, 
      r2: 0.0, 
      policy_hash
    });
    if (error) throw error;

    console.log(`Successfully fitted proxy basket with exposures:`, exposures);
    return new Response(JSON.stringify({ ok: true, exposures }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error fitting proxy basket:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});