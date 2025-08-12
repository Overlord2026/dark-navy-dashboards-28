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
    const body = await req.json(); // { consent_id, reason }
    const { data: token } = await supabase.from("consent_tokens").select("*").eq("id", body.consent_id).single();
    
    if (!token) return new Response("No token", { status: 404, headers: corsHeaders });
    
    await supabase.from("consent_tokens").update({ status: "revoked" }).eq("id", token.id);

    const { data: rev } = await supabase.from("revocations").insert({ 
      consent_id: token.id, 
      reason: body.reason ?? null 
    }).select().single();

    // Emit a takedown receipt stub (surface to owners)
    const { data: p } = await supabase.from("personas").select("id").eq("user_id", token.subject_user).limit(1).single();
    if (p) {
      await supabase.from("reason_receipts").insert({
        user_id: token.subject_user, 
        persona_id: p.id, 
        action_key: "takedown",
        reason_code: "TAKEDOWN_DUE_TO_REVOCATION", 
        explanation: body.reason ?? null, 
        policy_version: "v1"
      });
    }
    
    await supabase.from("revocations").update({ propagated: true }).eq("id", rev.id);
    
    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Propagate revocation error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});