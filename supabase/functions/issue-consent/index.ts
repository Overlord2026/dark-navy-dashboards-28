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
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const body = await req.json();
    const { data: user } = await supabase.auth.getUser(jwt);
    const issuer_user = user?.user?.id;
    
    if (!issuer_user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const { data, error } = await supabase.from("consent_tokens").insert({
      subject_user: body.subject_user,
      issuer_user,
      scopes: body.scopes,
      conditions: body.conditions ?? {},
      valid_from: body.valid_from ?? new Date().toISOString(),
      valid_to: body.valid_to ?? null,
      status: "active"
    }).select().single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, token: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Issue consent error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});