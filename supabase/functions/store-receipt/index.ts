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

interface HealthRDSReceipt {
  type: "Health-RDS";
  action: "authorize" | "order" | "share" | "publish" | "pay" | "takedown";
  inputs_hash: string;
  policy_version: string;
  reasons: string[];
  result: "approve" | "deny" | "pending";
  disclosures: string[];
  financial?: {
    hsa_eligible?: boolean;
    est_oop?: number;
    deductibleMet?: boolean;
    estimated_cost_cents?: number;
    coverage_type?: string;
  };
  anchor_ref?: {
    merkle_root: string;
    cross_chain_locator: Array<{
      chain_id: string;
      tx_ref: string;
      ts: number;
      anchor_epoch: number;
    }>;
  };
  ts: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receipt, user_id } = await req.json();
    
    console.log('Storing Health-RDS receipt:', { 
      type: receipt?.type, 
      action: receipt?.action,
      result: receipt?.result,
      user_id 
    });

    // Validate receipt structure
    if (!receipt || receipt.type !== 'Health-RDS') {
      return new Response(
        JSON.stringify({ error: 'Invalid Health-RDS receipt structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const requiredFields = ['action', 'inputs_hash', 'policy_version', 'reasons', 'result', 'disclosures', 'ts'];
    for (const field of requiredFields) {
      if (!receipt[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Store receipt in receipts table using the existing receipt_emit function
    const receiptInputs = {
      action: receipt.action,
      result: receipt.result,
      disclosures: receipt.disclosures,
      financial: receipt.financial || {},
      anchor_ref: receipt.anchor_ref || {},
      receipt_type: 'Health-RDS'
    };

    const policyData = {
      version: receipt.policy_version,
      type: 'healthcare_policy'
    };

    const { data: receiptData, error: receiptError } = await supabase.rpc('receipt_emit', {
      inputs_json: receiptInputs,
      policy_json: policyData,
      outcome: receipt.result,
      reasons: receipt.reasons,
      entity_id: user_id
    });

    if (receiptError) {
      console.error('Error storing receipt:', receiptError);
      return new Response(
        JSON.stringify({ error: 'Failed to store receipt in database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store full Health-RDS receipt in dedicated table
    const { data: healthReceiptData, error: healthReceiptError } = await supabase
      .from('health_rds_receipts')
      .insert({
        receipt_id: receiptData,
        user_id: user_id,
        action: receipt.action,
        inputs_hash: receipt.inputs_hash,
        policy_version: receipt.policy_version,
        reasons: receipt.reasons,
        result: receipt.result,
        disclosures: receipt.disclosures,
        financial_data: receipt.financial,
        anchor_ref: receipt.anchor_ref,
        receipt_timestamp: receipt.ts,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (healthReceiptError) {
      console.error('Error storing Health-RDS receipt:', healthReceiptError);
      // Continue even if this fails - the main receipt was stored
    }

    // Log the receipt storage for telemetry
    console.log('Health-RDS receipt stored successfully:', {
      receipt_id: receiptData,
      action: receipt.action,
      result: receipt.result,
      has_financial: !!receipt.financial,
      has_anchor: !!receipt.anchor_ref,
      disclosure_count: receipt.disclosures?.length || 0
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        receipt_id: receiptData,
        health_receipt_id: healthReceiptData?.id,
        stored_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Store receipt error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});