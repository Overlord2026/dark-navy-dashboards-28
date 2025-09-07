import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, key);

    console.log('Anchor function called');

    const { receipt_id, digest_hex } = await req.json() as { receipt_id: string; digest_hex: string };
    
    if (!receipt_id || !digest_hex) {
      console.error('Missing required fields:', { receipt_id, digest_hex });
      return new Response(
        JSON.stringify({ error: 'Missing receipt_id or digest_hex' }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Processing anchor for receipt:', receipt_id);

    const now = new Date().toISOString();
    const txid = `ctlog:${digest_hex.slice(0,16)}:${now}`;

    // Get receipt tenant_id
    const { data: rec, error: recErr } = await supabase
      .from("receipts")
      .select("tenant_id")
      .eq("id", receipt_id)
      .single();

    if (recErr) {
      console.error('Failed to fetch receipt:', recErr);
      return new Response(
        JSON.stringify({ error: recErr.message }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert anchor record
    const { error: aErr } = await supabase.from("anchors").insert({
      tenant_id: rec.tenant_id,
      receipt_id,
      substrate: "ctlog",
      txid,
      inclusion_proof: { note: "mock anchor proof" },
      anchored_at: now,
      created_by: "service_role"
    });

    if (aErr) {
      console.error('Failed to create anchor:', aErr);
      return new Response(
        JSON.stringify({ error: aErr.message }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update receipt status
    const { error: rErr } = await supabase
      .from("receipts")
      .update({ anchor_status: "anchored" })
      .eq("id", receipt_id);

    if (rErr) {
      console.error('Failed to update receipt status:', rErr);
      return new Response(
        JSON.stringify({ error: rErr.message }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Successfully anchored receipt:', receipt_id, 'with txid:', txid);

    return new Response(
      JSON.stringify({ ok: true, txid }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Anchor function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});