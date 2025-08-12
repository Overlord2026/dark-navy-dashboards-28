// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function ar1Unsmooth(raw: number[], phi?: number) {
  // crude AR(1) inversion fallback; replace with Kalman later
  const p = phi ?? 0.3;
  const u: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    const prev = i > 0 ? raw[i-1] : 0;
    u.push((raw[i] - p*prev));
  }
  return u;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fund_id, method = "AR1", phi } = await req.json();
    console.log(`Computing unsmoothed returns for fund ${fund_id} using ${method}`);
    
    const { data: rows, error } = await supabase
      .from("fund_returns_raw").select("period_date, return_raw")
      .eq("fund_id", fund_id).order("period_date", { ascending: true });
    if (error) throw error;

    const raw = rows.map((r: any) => r.return_raw as number);
    const unsmoothed = ar1Unsmooth(raw, phi);

    const upserts = rows.map((r: any, idx: number) => ({
      tenant_id: null, // fill via RLS on client if needed, else set in caller
      fund_id, 
      period_date: r.period_date, 
      return_unsmoothed: unsmoothed[idx],
      method, 
      params: { phi }, 
      model_hash: "model_ar1_v1"
    }));

    // write with service role; set tenant_id by joining fund to org in your app if needed
    const { error: upErr } = await supabase.from("fund_returns_unsmoothed").upsert(upserts, { onConflict: "fund_id,period_date,method" });
    if (upErr) throw upErr;

    console.log(`Successfully processed ${upserts.length} unsmoothed returns`);
    return new Response(JSON.stringify({ ok: true, count: upserts.length }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error computing unsmoothed returns:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400, 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});