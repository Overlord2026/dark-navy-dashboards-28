import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json(); // { consent_id, event }
    const { data: token } = await supabase.from("consent_tokens").select("*").eq("id", body.consent_id).single();
    
    if (!token || token.status !== 'active') {
      return new Response("Invalid token", { status: 400, headers: corsHeaders });
    }
    
    const { data: persona } = await supabase.from("personas").select("id").eq("user_id", token.subject_user).limit(1).single();
    
    if (!persona) {
      return new Response("No persona found", { status: 400, headers: corsHeaders });
    }
    
    const { data: rec } = await supabase.from("reason_receipts").insert({
      user_id: token.subject_user, 
      persona_id: persona.id,
      action_key: "xr_attend", 
      reason_code: "OK", 
      explanation: "XR presence/likeness attested"
    }).select().single();
    
    const { data: att } = await supabase.from("xr_attestations").insert({ 
      consent_id: token.id, 
      event: body.event, 
      receipt_id: rec.id 
    }).select().single();
    
    return new Response(
      JSON.stringify({ ok: true, attestation: att }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('XR attest error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});