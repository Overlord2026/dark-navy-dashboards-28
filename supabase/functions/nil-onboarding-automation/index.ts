import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OnboardingRequest {
  personaType: 'family' | 'advisor' | 'cpa' | 'attorney' | 'brand' | 'athlete'
  personaData: {
    name: string
    email: string
    jurisdiction?: string
    metadata?: any
  }
  requiredEducation?: string[]
  requiredDisclosures?: string[]
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

    const { personaType, personaData, requiredEducation, requiredDisclosures }: OnboardingRequest = await req.json()
    
    console.log(`Starting NIL onboarding for ${personaType}: ${personaData.name}`)

    // Create persona
    const { data: persona, error: personaError } = await supabaseClient
      .from('nil_personas')
      .insert({
        persona_type: personaType,
        name: personaData.name,
        email: personaData.email,
        jurisdiction: personaData.jurisdiction || 'US',
        metadata: { ...personaData.metadata, onboarding_completed: false }
      })
      .select()
      .single()

    if (personaError) {
      throw personaError
    }

    console.log(`Created persona ${persona.id}`)

    // Set up required policy gates based on persona type
    const policyGates = []

    // Education freshness gate for all personas except family
    if (personaType !== 'family') {
      policyGates.push({
        gate_type: 'education_freshness',
        entity_type: 'persona',
        entity_id: persona.id,
        policy_config: {
          requiredEducationType: `${personaType}_nil_basics`,
          validityPeriodDays: 365
        }
      })
    }

    // Disclosure pack gates for specific interactions
    policyGates.push({
      gate_type: 'disclosure_pack',
      entity_type: 'persona',
      entity_id: persona.id,
      policy_config: {
        requiredChannels: ['social_media', 'endorsement'],
        jurisdiction: personaData.jurisdiction || 'US'
      }
    })

    // Co-sign requirements for athletes
    if (personaType === 'athlete') {
      policyGates.push({
        gate_type: 'co_sign_required',
        entity_type: 'persona',
        entity_id: persona.id,
        policy_config: {
          highValueThreshold: 5000,
          requireGuardianConsent: true
        }
      })
    }

    // Budget policy for brands
    if (personaType === 'brand') {
      policyGates.push({
        gate_type: 'budget_policy',
        entity_type: 'persona',
        entity_id: persona.id,
        policy_config: {
          budgetLimit: 100000,
          budgetPeriodStart: new Date().toISOString().split('T')[0],
          budgetPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      })
    }

    // Create policy gates
    if (policyGates.length > 0) {
      const { error: gatesError } = await supabaseClient
        .from('nil_policy_gates')
        .insert(policyGates)

      if (gatesError) {
        console.error('Error creating policy gates:', gatesError)
      } else {
        console.log(`Created ${policyGates.length} policy gates`)
      }
    }

    // Generate Consent-RDS receipt for onboarding
    const consentReceipt = {
      receipt_type: 'Consent-RDS',
      event_type: 'onboarding_consent',
      entity_type: 'persona',
      entity_id: persona.id,
      policy_hash: generatePolicyHash({ personaType, requiredEducation, requiredDisclosures }),
      inputs_hash: generateInputsHash(personaData),
      decision_outcome: 'consent_granted',
      reason_codes: ['onboarding_initiated'],
      explanation: `NIL onboarding consent for ${personaType} persona`,
      merkle_leaf: generateMerkleLeaf({
        personaType,
        personaId: persona.id,
        event: 'onboarding_consent',
        timestamp: new Date().toISOString()
      }),
      privacy_level: 'high'
    }

    const { data: receipt, error: receiptError } = await supabaseClient
      .from('nil_receipts')
      .insert(consentReceipt)
      .select()
      .single()

    if (receiptError) {
      console.error('Receipt generation error:', receiptError)
    } else {
      console.log(`Generated consent receipt ${receipt.id}`)
    }

    // Return onboarding result
    const result = {
      success: true,
      persona: persona,
      policy_gates_created: policyGates.length,
      consent_receipt_id: receipt?.id,
      next_steps: generateNextSteps(personaType),
      demo_mode: true
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('NIL onboarding error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function generateNextSteps(personaType: string): string[] {
  switch (personaType) {
    case 'athlete':
      return [
        'Complete NIL education module',
        'Review and acknowledge disclosure packs',
        'Set up guardian co-sign if under 18',
        'Configure notification preferences'
      ]
    case 'brand':
      return [
        'Verify business credentials',
        'Set up budget and compliance policies',
        'Review athlete marketplace',
        'Configure partnership preferences'
      ]
    case 'advisor':
    case 'cpa':
    case 'attorney':
      return [
        'Complete professional NIL education',
        'Verify professional credentials',
        'Set up client onboarding workflows',
        'Configure compliance monitoring'
      ]
    case 'family':
      return [
        'Complete family NIL overview',
        'Set up guardian access controls',
        'Review athlete monitoring options',
        'Configure notification preferences'
      ]
    default:
      return ['Complete profile setup', 'Review platform guidelines']
  }
}

function generatePolicyHash(policy: any): string {
  return `sha256:${btoa(JSON.stringify(policy)).substring(0, 32)}`
}

function generateInputsHash(inputs: any): string {
  return `sha256:${btoa(JSON.stringify(inputs)).substring(0, 32)}`
}

function generateMerkleLeaf(data: any): string {
  return `leaf:${btoa(JSON.stringify(data)).substring(0, 32)}`
}