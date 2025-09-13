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
 * JSON Canonicalization Scheme (JCS) implementation
 */
function canonicalize(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'string') return JSON.stringify(obj);
  if (typeof obj === 'number') {
    if (!isFinite(obj)) {
      throw new Error('Non-finite numbers are not allowed in JCS');
    }
    return Number.isInteger(obj) ? obj.toString() : JSON.stringify(obj);
  }
  
  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalize(item));
    return `[${items.join(',')}]`;
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => `${JSON.stringify(key)}:${canonicalize(obj[key])}`);
    return `{${pairs.join(',')}}`;
  }
  
  throw new Error(`Unsupported type: ${typeof obj}`);
}

/**
 * Compute SHA-256 hash and return as hex string
 */
async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = new Uint8Array(hashBuffer);
  
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      org_id,
      domain,
      use_case,
      close_cycle_id,
      as_of_date,
      materiality_bucket,
      ...rest
    } = body;

    // Validate required fields
    if (!org_id || !domain || !use_case || !close_cycle_id || !as_of_date || !materiality_bucket) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
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

    // Build canonical receipt JSON by merging body with computed fields
    const canonicalReceipt = {
      org_id,
      domain,
      use_case,
      close_cycle_id,
      as_of_date,
      materiality_bucket,
      ...rest,
      created_at: new Date().toISOString(),
      version: '1.0'
    };

    // Canonicalize and compute hash
    const canonicalJson = canonicalize(canonicalReceipt);
    const receiptHash = await sha256Hex(canonicalJson);

    console.log('Creating receipt with hash:', receiptHash);

    // Insert into aies_receipts table
    const { data: receipt, error } = await supabase
      .from('aies_receipts')
      .insert({
        org_id,
        domain,
        use_case,
        close_cycle_id,
        as_of_date,
        materiality_bucket,
        receipt_hash: receiptHash,
        canonical_receipt: canonicalReceipt
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create receipt', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        receipt_id: receipt.id,
        receipt_hash: receiptHash
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create receipt error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});