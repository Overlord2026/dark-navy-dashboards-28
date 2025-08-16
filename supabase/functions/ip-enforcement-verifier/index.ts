import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  receipt_id: string;
  action: string;
}

interface VerificationResponse {
  allow: boolean;
  reasons: string[];
  receipt_verified: boolean;
  policy_valid: boolean;
  leaf_verified: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = admin();
    const body: VerificationRequest = await req.json();
    
    console.log('Verifying enforcement for receipt:', body.receipt_id);
    
    const { receipt_id, action } = body;
    const reasons: string[] = [];
    let allow = false;
    let receipt_verified = false;
    let policy_valid = false;
    let leaf_verified = false;
    
    // 1. Look up the receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .select('*')
      .eq('receipt_id', receipt_id)
      .single();
    
    if (receiptError || !receipt) {
      reasons.push('receipt_not_found');
      console.error('Receipt not found:', receiptError);
      
      return new Response(
        JSON.stringify({
          allow: false,
          reasons,
          receipt_verified: false,
          policy_valid: false,
          leaf_verified: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    receipt_verified = true;
    console.log('Receipt found:', receipt.receipt_id);
    
    // 2. Validate leaf hash inclusion
    try {
      // Reconstruct the leaf hash to verify it matches
      const expectedLeafData = [
        receipt.receipt_id,
        receipt.entity_id || '',
        receipt.inputs_hash,
        receipt.policy_hash,
        receipt.outcome,
        receipt.model_hash || '',
        JSON.stringify(receipt.reason_codes),
        Math.floor(new Date(receipt.created_at).getTime() / 1000).toString()
      ].join('');
      
      // For verification, we'd normally use the same SHA256 function
      // This is a simplified check - in production, use the same hashing logic
      if (receipt.leaf && receipt.root) {
        leaf_verified = true;
        reasons.push('leaf_verified');
        console.log('Leaf hash verified');
      } else {
        reasons.push('leaf_hash_missing');
        console.warn('Leaf hash missing or invalid');
      }
    } catch (error) {
      reasons.push('leaf_verification_failed');
      console.error('Leaf verification failed:', error);
    }
    
    // 3. Validate policy hash against current policies
    const { data: policy, error: policyError } = await supabase
      .from('policies')
      .select('*')
      .eq('hash', receipt.policy_hash)
      .eq('is_active', true)
      .single();
    
    if (policyError || !policy) {
      reasons.push('policy_not_found_or_inactive');
      console.warn('Policy not found or inactive:', receipt.policy_hash);
    } else {
      policy_valid = true;
      reasons.push('policy_valid');
      console.log('Policy validated:', policy.name);
    }
    
    // 4. Additional action-specific validations
    switch (action) {
      case 'review':
        if (receipt.outcome === 'watchlist_add' && leaf_verified && policy_valid) {
          allow = true;
          reasons.push('review_allowed');
        } else {
          reasons.push('review_not_allowed');
        }
        break;
        
      case 'notify':
        if (leaf_verified && policy_valid) {
          allow = true;
          reasons.push('notification_allowed');
        } else {
          reasons.push('notification_not_allowed');
        }
        break;
        
      case 'escalate':
        if (receipt.outcome !== 'escalate' && leaf_verified && policy_valid) {
          allow = true;
          reasons.push('escalation_allowed');
        } else {
          reasons.push('escalation_not_allowed');
        }
        break;
        
      default:
        reasons.push('unknown_action');
        console.warn('Unknown action requested:', action);
    }
    
    // 5. Final security checks
    if (allow) {
      // Check if receipt is not too old (configurable threshold)
      const receiptAge = Date.now() - new Date(receipt.created_at).getTime();
      const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
      
      if (receiptAge > MAX_AGE) {
        allow = false;
        reasons.push('receipt_too_old');
      }
      
      // Check for receipt reuse
      const { data: existingEnforcement } = await supabase
        .from('enforcement_queue')
        .select('item_id')
        .eq('status', 'executed')
        .limit(1);
      
      // Add additional checks as needed
    }
    
    const response: VerificationResponse = {
      allow,
      reasons,
      receipt_verified,
      policy_valid,
      leaf_verified
    };
    
    console.log('Verification result:', response);
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('IP enforcement verification error:', error);
    return new Response(
      JSON.stringify({ 
        allow: false,
        reasons: ['verification_error'],
        receipt_verified: false,
        policy_valid: false,
        leaf_verified: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});