import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BarVerificationRequest {
  onboardingId: string;
  barNumber: string;
  jurisdiction: string;
  firstName: string;
  lastName: string;
}

interface BarVerificationResponse {
  verified: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'not_found';
  admissionDate?: string;
  disciplinaryActions?: boolean;
  details?: any;
  source?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { onboardingId, barNumber, jurisdiction, firstName, lastName }: BarVerificationRequest = await req.json()

    if (!onboardingId || !barNumber || !jurisdiction) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mock bar verification - In production, this would integrate with actual bar APIs
    const verificationResult: BarVerificationResponse = await verifyBarLicense(
      barNumber,
      jurisdiction,
      firstName,
      lastName
    )

    // Update onboarding record with verification result
    const { error: updateError } = await supabaseClient
      .from('attorney_onboarding')
      .update({
        bar_verification_status: verificationResult.verified ? 'verified' : 'failed',
        bar_verification_data: verificationResult,
        updated_at: new Date().toISOString()
      })
      .eq('id', onboardingId)

    if (updateError) {
      console.error('Error updating onboarding:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update verification status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log verification attempt
    await supabaseClient
      .from('attorney_onboarding_log')
      .insert([{
        onboarding_id: onboardingId,
        previous_status: 'pending',
        new_status: verificationResult.verified ? 'verified' : 'failed',
        notes: `Bar verification ${verificationResult.verified ? 'successful' : 'failed'} for ${jurisdiction} bar #${barNumber}`,
        automated: true
      }])

    return new Response(
      JSON.stringify({
        success: true,
        verification: verificationResult,
        message: verificationResult.verified 
          ? 'Bar license verified successfully' 
          : 'Bar license verification failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in verify-bar-license function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function verifyBarLicense(
  barNumber: string,
  jurisdiction: string,
  firstName: string,
  lastName: string
): Promise<BarVerificationResponse> {
  // Mock verification logic - replace with actual API calls
  console.log(`Verifying bar license: ${barNumber} in ${jurisdiction} for ${firstName} ${lastName}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock verification based on bar number pattern
  const isValid = barNumber.length >= 5 && !barNumber.includes('000')
  
  if (isValid) {
    return {
      verified: true,
      status: 'active',
      admissionDate: '2010-05-15',
      disciplinaryActions: false,
      details: {
        fullName: `${firstName} ${lastName}`,
        barNumber,
        jurisdiction,
        admissionDate: '2010-05-15',
        status: 'Active - In Good Standing',
        nextRenewal: '2024-12-31'
      },
      source: 'Mock State Bar API'
    }
  } else {
    return {
      verified: false,
      status: 'not_found',
      details: {
        error: 'No matching records found',
        searched: { barNumber, jurisdiction, firstName, lastName }
      },
      source: 'Mock State Bar API'
    }
  }
}

// Integration examples for real bar APIs:

async function verifyWithCaliforniaBar(barNumber: string, firstName: string, lastName: string) {
  // California State Bar API integration would go here
  // Example: https://apps.calbar.ca.gov/attorney/LicenseeSearch/...
  return null
}

async function verifyWithNewYorkBar(barNumber: string, firstName: string, lastName: string) {
  // New York State Bar API integration would go here
  return null
}

async function verifyWithTexasBar(barNumber: string, firstName: string, lastName: string) {
  // Texas State Bar API integration would go here
  return null
}