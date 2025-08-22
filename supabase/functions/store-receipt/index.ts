import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProofSlip {
  id: string;
  type: string;
  entityId: string;
  entityType: string;
  reasons: string[];
  metadata: Record<string, any>;
  timestamp: string;
  inputsHash: string;
  merkleLeaf: string;
  anchored: boolean;
}

interface ReceiptRequest {
  proofSlip: ProofSlip;
  inputs: Record<string, any>;
  outcome: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { proofSlip, inputs, outcome }: ReceiptRequest = await req.json();

    console.log('Storing NIL receipt:', {
      proofSlipId: proofSlip.id,
      type: proofSlip.type,
      entityId: proofSlip.entityId,
      outcome
    });

    // Store the proof slip in the receipts table
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert({
        receipt_id: proofSlip.id,
        entity_id: proofSlip.entityId,
        inputs_hash: proofSlip.inputsHash,
        policy_hash: await generatePolicyHash(proofSlip.type),
        model_hash: 'nil-v1.0',
        reason_codes: proofSlip.reasons,
        outcome,
        leaf: proofSlip.merkleLeaf,
        root: proofSlip.merkleLeaf // Simplified for demo
      })
      .select()
      .single();

    if (receiptError) {
      console.error('Receipt storage error:', receiptError);
      throw receiptError;
    }

    // Store NIL-specific metadata
    const { error: nilError } = await supabase
      .from('nil_receipts')
      .insert({
        receipt_id: proofSlip.id,
        proof_type: proofSlip.type,
        entity_id: proofSlip.entityId,
        entity_type: proofSlip.entityType,
        metadata: proofSlip.metadata,
        anchored: proofSlip.anchored,
        created_at: proofSlip.timestamp
      });

    if (nilError) {
      console.warn('NIL metadata storage warning:', nilError);
      // Don't fail the request for metadata storage issues
    }

    // Log the action for audit trail
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        event_type: 'nil_receipt_stored',
        status: 'success',
        details: {
          proofSlipId: proofSlip.id,
          proofType: proofSlip.type,
          entityId: proofSlip.entityId,
          outcome,
          reasonCount: proofSlip.reasons.length
        },
        user_id: inputs.userId || null
      });

    if (auditError) {
      console.warn('Audit log warning:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        receiptId: receipt.receipt_id,
        proofSlipId: proofSlip.id,
        anchored: proofSlip.anchored,
        timestamp: proofSlip.timestamp
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Store receipt error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generatePolicyHash(proofType: string): Promise<string> {
  // Generate a deterministic policy hash based on proof type
  const policies = {
    'training.complete': 'nil-training-policy-v1',
    'disclosure.approve': 'nil-disclosure-policy-v1',
    'deal.approve': 'nil-deal-policy-v1',
    'payment.settle': 'nil-payment-policy-v1',
    'delta.change': 'nil-dispute-policy-v1',
    'disclosure.ftc': 'nil-ftc-policy-v1'
  };

  const policyString = policies[proofType] || 'nil-default-policy-v1';
  const encoder = new TextEncoder();
  const data = encoder.encode(policyString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}