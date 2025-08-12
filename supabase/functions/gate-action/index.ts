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

type GateInput = {
  action_key: string;
  persona_id: string;
  context?: Record<string, unknown>;
  policy_version?: string;
  content_fingerprint?: string;
};

function evaluatePolicy(ctx: any): { allow: boolean; reason_code: string; explanation?: string } {
  // Minimal baseline policy; expand as needed
  if (ctx?.ceStatus === "overdue") return { allow: false, reason_code: "CE_OVERDUE", explanation: "CE training overdue" };
  if (ctx?.conflict === true) return { allow: false, reason_code: "BLOCK_CONFLICT", explanation: "Conflict detected" };
  if (ctx?.requireDisclosure === true && ctx?.disclosuresAccepted !== true) {
    return { allow: false, reason_code: "REQUIRE_DISCLOSURE", explanation: "Required disclosure not accepted" };
  }
  return { allow: true, reason_code: "OK" };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    
    const { data: auth } = await supabase.auth.getUser(jwt);
    const user_id = auth?.user?.id!;
    const body = await req.json() as GateInput;

    // Fetch persona
    const { data: persona } = await supabase.from("personas").select("*").eq("id", body.persona_id).single();
    if (!persona) return new Response("Invalid persona", { status: 400, headers: corsHeaders });

    // Evaluate
    const res = evaluatePolicy(body.context || {});
    
    // Insert receipt
    const { data: rec, error } = await supabase.from("reason_receipts").insert({
      user_id, 
      persona_id: body.persona_id, 
      action_key: body.action_key,
      reason_code: res.reason_code, 
      explanation: res.explanation ?? null,
      policy_version: body.policy_version ?? "v1",
      content_fingerprint: body.content_fingerprint ?? null
    }).select().single();
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ allow: res.allow, reason_code: res.reason_code, receipt: rec }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Gate action error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});