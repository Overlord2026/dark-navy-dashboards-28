import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnchorRequest {
  receiptIds: string[]
  anchorType: 'blockchain' | 'timestamping' | 'notarization'
  priority: 'low' | 'normal' | 'high'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { receiptIds, anchorType, priority }: AnchorRequest = await req.json()
    
    console.log(`Anchoring ${receiptIds.length} receipts with ${anchorType} (priority: ${priority})`)

    // For demo purposes, create a mock anchor reference
    const anchorRef = {
      anchor_type: anchorType,
      anchor_timestamp: new Date().toISOString(),
      anchor_id: `demo_anchor_${Date.now()}`,
      batch_size: receiptIds.length,
      priority: priority,
      status: 'anchored',
      proof_available: true,
      demo_mode: true
    }

    // In production, this would interact with actual blockchain/timestamping services
    if (anchorType === 'blockchain') {
      anchorRef.transaction_hash = `0x${Math.random().toString(16).substring(2, 66)}`
      anchorRef.block_number = Math.floor(Math.random() * 1000000) + 18000000
      anchorRef.network = 'ethereum_mainnet'
    } else if (anchorType === 'timestamping') {
      anchorRef.timestamp_authority = 'demo_tsa'
      anchorRef.timestamp_token = `tst_${Math.random().toString(36).substring(2, 15)}`
    } else if (anchorType === 'notarization') {
      anchorRef.notary_id = 'demo_notary_001'
      anchorRef.notarization_cert = `cert_${Math.random().toString(36).substring(2, 15)}`
    }

    // Update all receipts with anchor reference
    const { error: updateError } = await supabaseClient
      .from('nil_receipts')
      .update({ anchor_ref: anchorRef })
      .in('id', receiptIds)

    if (updateError) {
      console.error('Error updating receipts with anchor:', updateError)
      throw updateError
    }

    // Create a consolidated merkle root for the batch
    const merkleRoot = generateBatchMerkleRoot(receiptIds)
    
    // Update receipts with consolidated merkle root
    await supabaseClient
      .from('nil_receipts')
      .update({ merkle_root: merkleRoot })
      .in('id', receiptIds)

    console.log(`Successfully anchored ${receiptIds.length} receipts`)

    return new Response(
      JSON.stringify({
        success: true,
        anchor_ref: anchorRef,
        merkle_root: merkleRoot,
        receipts_updated: receiptIds.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Anchor processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function generateBatchMerkleRoot(receiptIds: string[]): string {
  // Simple mock merkle root generation for demo
  const concatenated = receiptIds.join('')
  return `root:${btoa(concatenated).substring(0, 32)}`
}