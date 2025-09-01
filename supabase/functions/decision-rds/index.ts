import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DecisionRDSRequest {
  action: string;
  inputs: any;
  policy_version?: string;
  model_id?: string;
  user_id?: string;
}

interface DecisionRDSResponse {
  receipt_id: string;
  status: 'approved' | 'denied' | 'pending';
  anchor_ref?: string;
  inputs_hash: string;
  policy_hash: string;
  outputs_fp: string;
  receipt_hash: string;
  timestamp: string;
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

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestData: DecisionRDSRequest = await req.json()
    console.log('Decision RDS request:', requestData)

    // Validate required fields
    if (!requestData.action || !requestData.inputs) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action, inputs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate hashes for receipt
    const timestamp = new Date().toISOString()
    const receipt_id = `rec_${requestData.action}_${Date.now()}`
    
    // Create content hashes
    const inputs_hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(requestData.inputs))
    )
    const inputs_hash_hex = Array.from(new Uint8Array(inputs_hash))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    const policy_hash = await crypto.subtle.digest(
      'SHA-256', 
      new TextEncoder().encode(requestData.policy_version || 'v1.0')
    )
    const policy_hash_hex = Array.from(new Uint8Array(policy_hash))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    // Simulate decision logic based on action
    let status: 'approved' | 'denied' | 'pending' = 'approved'
    let outputs: any = { decision: 'approved', reason: 'Policy compliance verified' }

    switch (requestData.action) {
      case 'retirement_roadmap_planning':
        outputs = { 
          roadmap_generated: true, 
          goal_count: requestData.inputs.goals?.length || 0,
          recommendation: 'diversified_portfolio' 
        }
        break
      case '401k_fee_comparison':
        outputs = { 
          fee_analysis: 'completed',
          cost_savings: 0.15,
          benchmark_percentile: 75
        }
        break
      case 'prior_authorization_review':
        outputs = { 
          pa_decision: 'approved',
          medical_necessity: 'confirmed',
          treatment_approved: true
        }
        break
      case 'nil_athlete_search':
        outputs = { 
          matches_found: 5,
          top_match_score: 0.92,
          invitation_sent: true
        }
        break
      default:
        outputs = { decision: 'approved', action_completed: true }
    }

    // Generate outputs fingerprint
    const outputs_hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(outputs))
    )
    const outputs_fp = Array.from(new Uint8Array(outputs_hash))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    // Generate receipt hash
    const receipt_content = {
      receipt_id,
      action: requestData.action,
      inputs_hash: inputs_hash_hex,
      policy_hash: policy_hash_hex,
      outputs_fp,
      timestamp,
      model_id: requestData.model_id || `${requestData.action.replace(/_/g, '-')}-v1.0`
    }

    const receipt_hash_raw = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(receipt_content))
    )
    const receipt_hash = Array.from(new Uint8Array(receipt_hash_raw))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    // Store receipt in database
    const { error: dbError } = await supabase
      .from('domain_events')
      .insert({
        event_type: 'decision_rds',
        event_data: {
          receipt_id,
          action: requestData.action,
          inputs_hash: inputs_hash_hex,
          policy_hash: policy_hash_hex,
          outputs_fp,
          receipt_hash,
          model_id: receipt_content.model_id,
          status,
          timestamp
        },
        aggregate_id: receipt_id,
        aggregate_type: 'receipt',
        event_hash: receipt_hash,
        sequence_number: 1,
        metadata: {
          content_free: true,
          trust_rail: 'decision_rds',
          user_id: requestData.user_id
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store receipt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create anchor reference (simulated for demo)
    const anchor_ref = `anchor_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const response: DecisionRDSResponse = {
      receipt_id,
      status,
      anchor_ref,
      inputs_hash: inputs_hash_hex,
      policy_hash: policy_hash_hex,
      outputs_fp,
      receipt_hash,
      timestamp
    }

    console.log('Decision RDS response:', response)

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Decision RDS error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})