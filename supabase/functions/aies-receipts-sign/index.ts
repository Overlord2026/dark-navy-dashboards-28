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

/**
 * Get the appropriate signing key based on persona preference
 */
function getSigningKey(persona?: 'legal' | 'finance'): string | null {
  // For legal persona: prefer AIES_LEGAL_KEY, fallback to AIES_SIGNING_KEY
  if (persona === 'legal') {
    return Deno.env.get('AIES_LEGAL_KEY') || Deno.env.get('AIES_SIGNING_KEY') || null;
  }
  
  // For finance persona: prefer AIES_SIGNING_KEY, fallback to AIES_LEGAL_KEY
  if (persona === 'finance') {
    return Deno.env.get('AIES_SIGNING_KEY') || Deno.env.get('AIES_LEGAL_KEY') || null;
  }
  
  // Default: try both keys
  return Deno.env.get('AIES_LEGAL_KEY') || Deno.env.get('AIES_SIGNING_KEY') || null;
}

/**
 * Get the signing algorithm for the current key
 */
function getSigningAlgorithm(persona?: 'legal' | 'finance'): string {
  // Check which key we're actually using
  const legalKey = Deno.env.get('AIES_LEGAL_KEY');
  const signingKey = Deno.env.get('AIES_SIGNING_KEY');
  
  if (persona === 'legal' && legalKey) {
    return Deno.env.get('AIES_LEGAL_ALGORITHM') || 'ES256';
  }
  
  if (persona === 'finance' && signingKey) {
    return Deno.env.get('AIES_SIGNING_ALG') || 'Ed25519';
  }
  
  // Fallback logic
  if (legalKey) {
    return Deno.env.get('AIES_LEGAL_ALGORITHM') || 'ES256';
  }
  
  return Deno.env.get('AIES_SIGNING_ALG') || 'Ed25519';
}

/**
 * Mock signing function for development
 * In production, this would integrate with actual KMS/HSM
 */
async function mockSignHash(hash: string, keyRef: string, algorithm: string): Promise<string> {
  // For development, create a deterministic "signature"
  // In production, this would be actual cryptographic signing
  const data = `${hash}:${keyRef}:${algorithm}:${Date.now()}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = new Uint8Array(hashBuffer);
  
  // Convert to base64
  const binaryString = String.fromCharCode(...hashArray);
  return btoa(binaryString);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { receipt_id, persona } = body;

    if (!receipt_id) {
      return new Response(
        JSON.stringify({ error: 'receipt_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user's auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('aies_receipts')
      .select('*')
      .eq('id', receipt_id)
      .single();

    if (receiptError || !receipt) {
      return new Response(
        JSON.stringify({ error: 'Receipt not found', details: receiptError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get signing configuration
    const signingKey = getSigningKey(persona);
    const algorithm = getSigningAlgorithm(persona);

    if (!signingKey) {
      return new Response(
        JSON.stringify({ error: 'No signing key configured. Set AIES_LEGAL_KEY or AIES_SIGNING_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Signing receipt ${receipt_id} with ${algorithm} using persona: ${persona || 'default'}`);

    // Sign the receipt hash
    const signature = await mockSignHash(receipt.receipt_hash, signingKey, algorithm);

    // Store signature
    const { data: signatureRecord, error: signatureError } = await supabase
      .from('aies_receipt_signatures')
      .insert({
        receipt_id,
        alg: algorithm,
        key_ref: signingKey,
        sig_b64: signature
      })
      .select()
      .single();

    if (signatureError) {
      console.error('Signature storage error:', signatureError);
      return new Response(
        JSON.stringify({ error: 'Failed to store signature', details: signatureError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all signatures for this receipt
    const { data: allSignatures, error: signaturesError } = await supabase
      .from('aies_receipt_signatures')
      .select('*')
      .eq('receipt_id', receipt_id)
      .order('created_at', { ascending: true });

    if (signaturesError) {
      console.error('Failed to fetch signatures:', signaturesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch signatures', details: signaturesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        signatures: allSignatures
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sign receipt error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});