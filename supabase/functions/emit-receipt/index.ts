import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receipt_id, anchor_enabled = false } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const anchorEnabled = Deno.env.get('ANCHOR_ENABLED') === 'true' || anchor_enabled;

    // Get the receipt
    const { data: receipt, error: fetchError } = await supabase
      .from('reason_receipts')
      .select('*')
      .eq('id', receipt_id)
      .single();

    if (fetchError || !receipt) {
      throw new Error('Receipt not found');
    }

    // Normalize receipt data for consistent hashing
    const normalized = normalizeReceipt(receipt);
    const hash = await generateSHA256(normalized);

    // Update receipt with normalized hash
    await supabase
      .from('reason_receipts')
      .update({ hash })
      .eq('id', receipt_id);

    let anchor_txid = null;
    
    // Optional anchoring to blockchain
    if (anchorEnabled) {
      try {
        anchor_txid = await anchorToBlockchain(hash, receipt);
        
        // Update receipt with anchor transaction ID
        await supabase
          .from('reason_receipts')
          .update({ anchor_txid })
          .eq('id', receipt_id);
          
      } catch (anchorError) {
        console.error('Anchoring failed:', anchorError);
        // Continue without anchoring - this is optional
      }
    }

    return new Response(
      JSON.stringify({
        receipt_id,
        hash,
        anchor_txid,
        anchored: !!anchor_txid,
        normalized_data: normalized
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Emit receipt error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function normalizeReceipt(receipt: any) {
  // Remove volatile fields and sort keys for deterministic hashing
  const normalized = {
    user_id: receipt.user_id,
    persona_id: receipt.persona_id,
    action_key: receipt.action_key,
    reason_code: receipt.reason_code,
    explanation: receipt.explanation,
    // Round timestamp to minute for deterministic hashing
    timestamp: Math.floor(new Date(receipt.created_at).getTime() / 60000) * 60000
  };

  // Sort keys deterministically
  const sorted: Record<string, any> = {};
  Object.keys(normalized).sort().forEach(key => {
    sorted[key] = normalized[key as keyof typeof normalized];
  });

  return sorted;
}

async function generateSHA256(data: any): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

async function anchorToBlockchain(hash: string, receipt: any): Promise<string> {
  // Mock blockchain anchoring - in production this would integrate with
  // actual blockchain services like Ethereum, Bitcoin, or other networks
  
  const mockTransaction = {
    hash: hash,
    timestamp: Date.now(),
    receipt_id: receipt.id,
    user_id: receipt.user_id
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock transaction ID
  const txid = `0x${hash.slice(0, 32)}${Date.now().toString(16)}`;
  
  console.log('Anchored to blockchain:', { txid, hash, receipt_id: receipt.id });
  
  return txid;
}