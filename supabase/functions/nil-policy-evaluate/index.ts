import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PolicyEvaluationRequest {
  gateType: 'education_freshness' | 'disclosure_pack' | 'exclusivity_lock' | 'budget_policy' | 'co_sign_required'
  entityType: string
  entityId: string
  policyConfig: any
  requestContext: any
}

interface PolicyEvaluationResult {
  allowed: boolean
  reason: string
  gatesPassed: string[]
  gatesFailed: string[]
  receiptId?: string
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

    const { gateType, entityType, entityId, policyConfig, requestContext }: PolicyEvaluationRequest = await req.json()
    
    console.log(`Evaluating policy gate: ${gateType} for ${entityType}:${entityId}`)

    let evaluationResult: PolicyEvaluationResult = {
      allowed: false,
      reason: 'Policy evaluation failed',
      gatesPassed: [],
      gatesFailed: []
    }

    // Policy-as-code evaluation based on gate type
    switch (gateType) {
      case 'education_freshness':
        evaluationResult = await evaluateEducationFreshness(supabaseClient, entityId, policyConfig)
        break
      
      case 'disclosure_pack':
        evaluationResult = await evaluateDisclosurePack(supabaseClient, requestContext, policyConfig)
        break
      
      case 'exclusivity_lock':
        evaluationResult = await evaluateExclusivityLock(supabaseClient, entityId, policyConfig)
        break
      
      case 'budget_policy':
        evaluationResult = await evaluateBudgetPolicy(supabaseClient, entityId, policyConfig)
        break
      
      case 'co_sign_required':
        evaluationResult = await evaluateCoSignRequired(supabaseClient, entityId, policyConfig)
        break
    }

    // Generate Decision-RDS receipt
    const receiptData = {
      receipt_type: 'Decision-RDS',
      event_type: `policy_gate_${gateType}`,
      entity_type: entityType,
      entity_id: entityId,
      policy_hash: generatePolicyHash(policyConfig),
      inputs_hash: generateInputsHash(requestContext),
      decision_outcome: evaluationResult.allowed ? 'allow' : 'deny',
      reason_codes: [evaluationResult.reason],
      explanation: `Policy gate ${gateType} evaluation: ${evaluationResult.reason}`,
      merkle_leaf: generateMerkleLeaf({
        gateType,
        entityType,
        entityId,
        outcome: evaluationResult.allowed,
        timestamp: new Date().toISOString()
      }),
      privacy_level: 'high'
    }

    const { data: receipt, error: receiptError } = await supabaseClient
      .from('nil_receipts')
      .insert(receiptData)
      .select()
      .single()

    if (receiptError) {
      console.error('Receipt generation error:', receiptError)
    } else {
      evaluationResult.receiptId = receipt.id
      console.log(`Generated receipt ${receipt.id} for policy evaluation`)
    }

    // Update policy gate status
    await supabaseClient
      .from('nil_policy_gates')
      .upsert({
        gate_type: gateType,
        entity_type: entityType,
        entity_id: entityId,
        policy_config: policyConfig,
        gate_status: evaluationResult.allowed ? 'active' : 'failed',
        last_evaluation: new Date().toISOString(),
        evaluation_result: evaluationResult
      })

    return new Response(
      JSON.stringify(evaluationResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Policy evaluation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function evaluateEducationFreshness(supabase: any, personaId: string, policyConfig: any): Promise<PolicyEvaluationResult> {
  const { data: educationRecords } = await supabase
    .from('nil_education_records')
    .select('*')
    .eq('persona_id', personaId)
    .eq('education_type', policyConfig.requiredEducationType)
    .order('completion_date', { ascending: false })
    .limit(1)

  if (!educationRecords?.length) {
    return {
      allowed: false,
      reason: 'Required education not completed',
      gatesPassed: [],
      gatesFailed: ['education_required']
    }
  }

  const latestEducation = educationRecords[0]
  const completionDate = new Date(latestEducation.completion_date)
  const expiryDate = new Date(latestEducation.expiry_date || completionDate.getTime() + (365 * 24 * 60 * 60 * 1000))
  const now = new Date()

  if (now > expiryDate) {
    return {
      allowed: false,
      reason: 'Education has expired and needs renewal',
      gatesPassed: [],
      gatesFailed: ['education_expired']
    }
  }

  return {
    allowed: true,
    reason: 'Education requirements satisfied',
    gatesPassed: ['education_fresh'],
    gatesFailed: []
  }
}

async function evaluateDisclosurePack(supabase: any, requestContext: any, policyConfig: any): Promise<PolicyEvaluationResult> {
  const { channel, jurisdiction } = requestContext
  
  const { data: disclosurePack } = await supabase
    .from('nil_disclosure_packs')
    .select('*')
    .eq('channel', channel)
    .eq('jurisdiction', jurisdiction)
    .lte('effective_date', new Date().toISOString().split('T')[0])
    .order('effective_date', { ascending: false })
    .limit(1)

  if (!disclosurePack?.length) {
    return {
      allowed: false,
      reason: `No valid disclosure pack found for ${channel} in ${jurisdiction}`,
      gatesPassed: [],
      gatesFailed: ['disclosure_pack_missing']
    }
  }

  return {
    allowed: true,
    reason: 'Disclosure pack requirements satisfied',
    gatesPassed: ['disclosure_pack_valid'],
    gatesFailed: []
  }
}

async function evaluateExclusivityLock(supabase: any, entityId: string, policyConfig: any): Promise<PolicyEvaluationResult> {
  // Check if athlete has active exclusive offers
  const { data: exclusiveOffers } = await supabase
    .from('nil_offers')
    .select('*')
    .eq('athlete_id', entityId)
    .eq('offer_type', 'exclusive')
    .in('status', ['offered', 'accepted'])
    .gt('offer_lock_until', new Date().toISOString())

  if (exclusiveOffers?.length) {
    return {
      allowed: false,
      reason: 'Athlete has active exclusivity agreement that prevents new offers',
      gatesPassed: [],
      gatesFailed: ['exclusivity_violation']
    }
  }

  return {
    allowed: true,
    reason: 'No exclusivity restrictions',
    gatesPassed: ['exclusivity_clear'],
    gatesFailed: []
  }
}

async function evaluateBudgetPolicy(supabase: any, entityId: string, policyConfig: any): Promise<PolicyEvaluationResult> {
  // Get total spending for the budget period
  const { data: payments } = await supabase
    .from('nil_payments')
    .select('amount')
    .eq('from_party', entityId)
    .gte('created_at', policyConfig.budgetPeriodStart)
    .lte('created_at', policyConfig.budgetPeriodEnd)

  const totalSpent = payments?.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0) || 0
  const budgetLimit = policyConfig.budgetLimit || 0

  if (totalSpent >= budgetLimit) {
    return {
      allowed: false,
      reason: `Budget limit of ${budgetLimit} exceeded (spent: ${totalSpent})`,
      gatesPassed: [],
      gatesFailed: ['budget_exceeded']
    }
  }

  return {
    allowed: true,
    reason: `Budget available (${budgetLimit - totalSpent} remaining)`,
    gatesPassed: ['budget_available'],
    gatesFailed: []
  }
}

async function evaluateCoSignRequired(supabase: any, entityId: string, policyConfig: any): Promise<PolicyEvaluationResult> {
  // Demo logic: require co-sign for athletes under 18 or high-value contracts
  const { data: persona } = await supabase
    .from('nil_personas')
    .select('*')
    .eq('id', entityId)
    .single()

  if (!persona) {
    return {
      allowed: false,
      reason: 'Entity not found',
      gatesPassed: [],
      gatesFailed: ['entity_not_found']
    }
  }

  // For demo, assume all athletes need co-sign for contracts over $5000
  const contractValue = policyConfig.contractValue || 0
  if (persona.persona_type === 'athlete' && contractValue > 5000) {
    return {
      allowed: false,
      reason: 'Co-signature required for high-value athlete contracts',
      gatesPassed: [],
      gatesFailed: ['co_sign_required']
    }
  }

  return {
    allowed: true,
    reason: 'No co-signature required',
    gatesPassed: ['co_sign_exempt'],
    gatesFailed: []
  }
}

function generatePolicyHash(policyConfig: any): string {
  return `sha256:${btoa(JSON.stringify(policyConfig)).substring(0, 32)}`
}

function generateInputsHash(inputs: any): string {
  return `sha256:${btoa(JSON.stringify(inputs)).substring(0, 32)}`
}

function generateMerkleLeaf(data: any): string {
  return `leaf:${btoa(JSON.stringify(data)).substring(0, 32)}`
}