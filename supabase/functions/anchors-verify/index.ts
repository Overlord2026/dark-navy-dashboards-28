import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnchorVerifyRequest {
  receipt_id: string;
  anchor_ref: string;
  merkle_proof?: string[];
  tree_size?: number;
}

interface AnchorVerifyResponse {
  receipt_id: string;
  verification_status: 'verified' | 'failed' | 'pending';
  anchor_valid: boolean;
  merkle_inclusion_valid: boolean;
  timestamp: string;
  verification_details: {
    anchor_type: string;
    proof_chain_length: number;
    tree_position?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestData: AnchorVerifyRequest = await req.json()
    console.log('Anchor verification request:', requestData)

    // Validate required fields
    if (!requestData.receipt_id || !requestData.anchor_ref) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: receipt_id, anchor_ref' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simulate anchor verification logic
    const timestamp = new Date().toISOString()
    
    // Parse anchor reference to determine type
    let anchor_type = 'timestamping'
    if (requestData.anchor_ref.includes('blockchain')) {
      anchor_type = 'blockchain'
    } else if (requestData.anchor_ref.includes('notary')) {
      anchor_type = 'notarization'
    }

    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay for realism

    // For demo purposes, always verify successfully
    const anchor_valid = true
    const merkle_inclusion_valid = requestData.merkle_proof ? 
      requestData.merkle_proof.length > 0 : true

    const verification_status: 'verified' | 'failed' | 'pending' = 
      anchor_valid && merkle_inclusion_valid ? 'verified' : 'failed'

    // Calculate tree position if merkle proof provided
    let tree_position: number | undefined
    if (requestData.merkle_proof && requestData.tree_size) {
      // Simulate calculating position from proof
      tree_position = Math.floor(Math.random() * requestData.tree_size)
    }

    const response: AnchorVerifyResponse = {
      receipt_id: requestData.receipt_id,
      verification_status,
      anchor_valid,
      merkle_inclusion_valid,
      timestamp,
      verification_details: {
        anchor_type,
        proof_chain_length: requestData.merkle_proof?.length || 0,
        tree_position
      }
    }

    console.log('Anchor verification response:', response)

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Anchor verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})