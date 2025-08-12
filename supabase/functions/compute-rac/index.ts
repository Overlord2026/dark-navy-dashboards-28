import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function metrics(returns: number[]) {
  // naive implementations; replace with robust versions later
  const mean = returns.reduce((a, b) => a + b, 0) / Math.max(returns.length, 1);
  const neg = returns.filter(r => r < 0);
  const stdev = Math.sqrt(returns.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(returns.length, 1));
  const sortino = mean / (Math.sqrt(neg.reduce((a, b) => a + b * b, 0) / Math.max(neg.length, 1)) || 1);
  const cvar5 = neg.sort((a, b) => a - b).slice(0, Math.max(1, Math.floor(returns.length * 0.05))).reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(returns.length * 0.05));
  
  // Ulcer (sum of squared drawdowns)
  let peak = -Infinity, ulcer = 0, mdd = 0, tuw = 0, curDD = 0;
  let level = 1;
  for (const r of returns) {
    level *= (1 + r);
    if (level > peak) { 
      peak = level; 
      curDD = 0; 
    } else { 
      const dd = (peak - level) / peak; 
      ulcer += dd * dd; 
      curDD += 1; 
      tuw += 1; 
      if (dd > mdd) mdd = dd; 
    }
  }
  const vol_ann = stdev * Math.sqrt(12);
  return { mdd, tuw_days: tuw, ulcer_index: ulcer, sortino, cvar5, vol_annualized: vol_ann };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      fund_id, 
      window_start, 
      window_end, 
      weights = { mdd: 0.25, tuw: 0.20, ulcer: 0.15, sortino: 0.15, cvar5: 0.15, vol: 0.10 } 
    } = await req.json();
    
    console.log(`Computing RAC for fund ${fund_id} from ${window_start} to ${window_end}`);

    const { data: rows, error } = await supabase
      .from("fund_returns_unsmoothed").select("period_date, return_unsmoothed")
      .eq("fund_id", fund_id).gte("period_date", window_start).lte("period_date", window_end)
      .order("period_date", { ascending: true });
    if (error) throw error;

    const rets = rows.map((r: any) => Number(r.return_unsmoothed || 0));
    const m = metrics(rets);

    const z = (x: number) => Math.max(0, Math.min(100, x));
    const inv = (x: number) => -x; // invert for penalties
    const score =
      100
      + weights.sortino * z(m.sortino)
      + weights.cvar5 * z(inv(m.cvar5) * 100)
      + weights.ulcer * z(inv(m.ulcer_index) * 100)
      + weights.vol * z(inv(m.vol_annualized) * 100)
      + weights.mdd * z(inv(m.mdd) * 100)
      + weights.tuw * z(inv(m.tuw_days));

    const rac = Math.max(0, Math.min(100, score));
    const payload = { fund_id, window_start, window_end, submetrics: m, weights, rac };

    const { data: receipt, error: recErr } = await supabase.from("pmqi_receipts").insert({
      tenant_id: null, 
      fund_id, 
      kind: "RAC", 
      payload, 
      model_hash: "rac_v1", 
      policy_hash: "policy_v1"
    }).select().single();
    if (recErr) throw recErr;

    const { error: upErr } = await supabase.from("risk_metrics").upsert({
      tenant_id: null, 
      fund_id, 
      window_start, 
      window_end,
      mdd: m.mdd, 
      time_under_water_days: m.tuw_days, 
      ulcer_index: m.ulcer_index,
      sortino: m.sortino, 
      cvar_5: m.cvar5, 
      vol_annualized: m.vol_annualized, 
      nav_lag_days: null
    }, { onConflict: "fund_id,window_start,window_end" });
    if (upErr) throw upErr;

    const { error: upErr2 } = await supabase.from("rac_scores").upsert({
      tenant_id: null, 
      fund_id, 
      window_start, 
      window_end, 
      rac,
      weights, 
      submetrics: m, 
      reason_codes: ['RAC_INITIAL'], 
      breach_flags: [], 
      receipt_sha256: receipt.sha256
    }, { onConflict: "fund_id,window_start,window_end" });
    if (upErr2) throw upErr2;

    console.log(`Successfully computed RAC: ${rac.toFixed(2)}`);
    return new Response(JSON.stringify({ ok: true, rac, receipt_sha256: receipt.sha256 }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error computing RAC:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});