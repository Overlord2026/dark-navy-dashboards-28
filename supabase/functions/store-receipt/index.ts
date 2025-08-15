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
    const body = await req.json(); // { fund_id, kind, payload, inputs_hash, model_hash, policy_hash }
    console.log(`Storing receipt for fund ${body.fund_id}, kind: ${body.kind}`);
    
    const { data, error } = await supabase.from("pmqi_receipts").insert({
      tenant_id: null, 
      fund_id: body.fund_id, 
      kind: body.kind,
      payload: body.payload, 
      inputs_hash: body.inputs_hash, 
      model_hash: body.model_hash, 
      policy_hash: body.policy_hash
    }).select().single();
    if (error) throw error;
    
    console.log(`Successfully stored receipt with SHA256: ${data.sha256}`);
    return new Response(JSON.stringify({ ok: true, sha256: data.sha256, id: data.id }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("Error storing receipt:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});