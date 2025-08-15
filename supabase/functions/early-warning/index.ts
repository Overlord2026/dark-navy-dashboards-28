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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fund_id, rdi_min = 60, rac_min = 60, window_end } = await req.json();
    console.log(`Running early warning system for fund ${fund_id}`);
    
    const { data: rdi } = await supabase.from("rdi_scores").select("*")
      .eq("fund_id", fund_id).lte("window_end", window_end)
      .order("window_end", { ascending: false }).limit(1).maybeSingle();
      
    const { data: rac } = await supabase.from("rac_scores").select("*")
      .eq("fund_id", fund_id).lte("window_end", window_end)
      .order("window_end", { ascending: false }).limit(1).maybeSingle();

    const findings: string[] = [];
    if (rdi && rdi.rdi < rdi_min) findings.push("EWS_RDI_BELOW_MIN");
    if (rac && rac.rac < rac_min) findings.push("EWS_RAC_BELOW_MIN");

    console.log(`Early warning findings: ${findings.length > 0 ? findings.join(', ') : 'None'}`);
    return new Response(JSON.stringify({ ok: true, findings, rdi, rac }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error in early warning system:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});