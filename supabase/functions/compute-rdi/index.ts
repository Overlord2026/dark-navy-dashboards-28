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

function maxDrawdown(series: number[]) {
  let peak = -Infinity, mdd = 0;
  for (const x of series) {
    if (x > peak) peak = x;
    const dd = (peak - x);
    if (dd > mdd) mdd = dd;
  }
  return mdd;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fund_id, window_start, window_end } = await req.json();
    console.log(`Computing RDI for fund ${fund_id} from ${window_start} to ${window_end}`);

    const { data: u, error: e1 } = await supabase
      .from("fund_returns_unsmoothed").select("period_date, return_unsmoothed")
      .eq("fund_id", fund_id).gte("period_date", window_start).lte("period_date", window_end)
      .order("period_date", { ascending: true });
    if (e1) throw e1;

    // proxy is placeholder (flat 0) unless you also load fitted series
    const cum = (arr: number[]) => arr.reduce((a: number[], r) => [...a, (a.at(-1) ?? 1) * (1 + r)], [] as number[]);
    const fund_curve = cum(u.map((r: any) => Number(r.return_unsmoothed || 0)));
    const proxy_curve = cum(new Array(fund_curve.length).fill(0)); // TODO: replace with fitted proxy series

    const dd_fund = maxDrawdown(fund_curve);
    const dd_proxy = maxDrawdown(proxy_curve);
    const rdi = Math.max(0, 100 - ((dd_fund - dd_proxy) * 100));

    const payload = { fund_id, window_start, window_end, dd_fund, dd_proxy, rdi };
    const { data: receipt, error: recErr } = await supabase.from("pmqi_receipts").insert({
      tenant_id: null, 
      fund_id, 
      kind: "RDI", 
      payload, 
      model_hash: "rdi_v1", 
      policy_hash: "policy_v1"
    }).select().single();
    if (recErr) throw recErr;

    const { error: upErr } = await supabase.from("rdi_scores").upsert({
      tenant_id: null, 
      fund_id, 
      window_start, 
      window_end,
      drawdown_fund: dd_fund, 
      drawdown_proxy: dd_proxy, 
      lag_applied_days: 0,
      rdi, 
      reason_codes: ['RDI_INITIAL'], 
      receipt_sha256: receipt.sha256
    }, { onConflict: "fund_id,window_start,window_end" });
    if (upErr) throw upErr;

    console.log(`Successfully computed RDI: ${rdi.toFixed(2)}`);
    return new Response(JSON.stringify({ ok: true, rdi, receipt_sha256: receipt.sha256 }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error computing RDI:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});