import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../_shared/secrets.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Runtime checks
void SUPABASE_URL; void SUPABASE_SERVICE_ROLE_KEY;

const supabase = admin;

const ANCHOR_ENABLED = (Deno.env.get("ANCHOR_ENABLED") ?? "false") === "true";

interface EmitReceiptRequest {
  event_type: string;
  evidence_package_id?: string;
  aggregate_id: string;
  aggregate_type: string;
  event_data: Record<string, any>;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmitReceiptRequest = await req.json();
    
    // Get next sequence number for this aggregate
    const { data: lastEvent } = await supabase
      .from("domain_events")
      .select("sequence_number")
      .eq("aggregate_id", body.aggregate_id)
      .order("sequence_number", { ascending: false })
      .limit(1)
      .single();
    
    const sequenceNumber = (lastEvent?.sequence_number || 0) + 1;
    
    // Create deterministic hash
    const hashData = JSON.stringify({
      event_type: body.event_type,
      aggregate_id: body.aggregate_id,
      aggregate_type: body.aggregate_type,
      sequence_number: sequenceNumber,
      event_data: body.event_data,
      timestamp: new Date().toISOString()
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const eventHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Insert domain event
    const { data: domainEvent, error: eventError } = await supabase
      .from("domain_events")
      .insert({
        event_type: body.event_type,
        event_data: body.event_data,
        aggregate_id: body.aggregate_id,
        aggregate_type: body.aggregate_type,
        sequence_number: sequenceNumber,
        event_hash: eventHash,
        metadata: body.metadata || {}
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error creating domain event:', eventError);
      throw eventError;
    }

    // Create evidence package if requested
    let evidencePackage = null;
    if (body.evidence_package_id) {
      const { data: evidence, error: evidenceError } = await supabase
        .from("evidence_packages")
        .select("*")
        .eq("id", body.evidence_package_id)
        .single();

      if (evidenceError) {
        console.error('Error fetching evidence package:', evidenceError);
      } else {
        evidencePackage = evidence;
      }
    }

    let anchor_txid: string | null = null;
    if (ANCHOR_ENABLED) {
      // stub anchor; replace with real chain/notary
      anchor_txid = `notary:${eventHash.slice(0, 16)}`;
    }

    const receipt = {
      id: domainEvent.id,
      event_hash: eventHash,
      anchor_txid,
      sequence_number: sequenceNumber,
      aggregate_id: body.aggregate_id,
      aggregate_type: body.aggregate_type,
      event_type: body.event_type,
      evidence_package: evidencePackage,
      occurred_at: domainEvent.occurred_at,
      metadata: domainEvent.metadata
    };

    return new Response(
      JSON.stringify({ ok: true, receipt }),
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