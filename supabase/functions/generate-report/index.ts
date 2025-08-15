import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { userClient, getCaller } from "../_shared/auth.ts";
import { z } from "https://esm.sh/zod@3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supa = userClient(req);
    const caller = getCaller(req);
    
    if (!caller.entityId) {
      return new Response("Missing entity context", { status: 401, headers: corsHeaders });
    }

    const input = z.object({
      portfolio_id: z.string().uuid(),
      kind: z.enum(["consolidated","performance","fees"]),
      period: z.string(), // "2025Q3"
      persona_scope: z.enum(["all","client","advisor","cpa","attorney","admin"]).default("client")
    }).parse(await req.json());

    const { data, error } = await supa.from("reports").insert({
      entity_id: caller.entityId,
      portfolio_id: input.portfolio_id,
      kind: input.kind,
      period_start: null, 
      period_end: null,
      storage_url: "s3://placeholder/report.pdf",
      persona_scope: input.persona_scope
    }).select().single();

    if (error) {
      return new Response(error.message, { status: 400, headers: corsHeaders });
    }
    
    return new Response(
      JSON.stringify({ ok: true, report: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});