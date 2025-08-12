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

const ANCHOR_ENABLED = (Deno.env.get("ANCHOR_ENABLED") ?? "false") === "true";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json(); // {receipt_id}
    const { data: rec } = await supabase.from("reason_receipts").select("*").eq("id", body.receipt_id).single();
    
    if (!rec) return new Response("No receipt", { status: 404, headers: corsHeaders });
    
    // Create deterministic hash
    const hashData = JSON.stringify({
      action_key: rec.action_key, 
      reason_code: rec.reason_code, 
      persona_id: rec.persona_id, 
      created_at: rec.created_at
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    let anchor_txid: string | null = null;
    if (ANCHOR_ENABLED) {
      // stub anchor; replace with real chain/notary
      anchor_txid = `notary:${hash.slice(0, 16)}`;
    }

    const { data: updated, error } = await supabase.from("reason_receipts")
      .update({ sha256: hash, anchor_txid })
      .eq("id", rec.id)
      .select()
      .single();
      
    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, receipt: updated }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Emit receipt error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});