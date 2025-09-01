import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProInquiryRequest {
  inquiry_type: string;
  professional_id: string;
  client_context: any;
  service_requested: string;
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

    const requestData: ProInquiryRequest = await req.json()
    console.log('Professional inquiry request:', requestData)

    // Generate inquiry receipt
    const timestamp = new Date().toISOString()
    const inquiry_id = `inq_${requestData.inquiry_type}_${Date.now()}`
    
    // Process inquiry based on type
    let response_data: any = {
      inquiry_id,
      status: 'received',
      professional_notified: true,
      estimated_response_time: '24 hours'
    }

    switch (requestData.inquiry_type) {
      case 'fee_analysis':
        response_data.analysis_type = '401k_fee_comparison'
        response_data.estimated_savings = 'pending_analysis'
        break
      case 'estate_planning':
        response_data.consultation_scheduled = true
        response_data.document_review = 'initiated'
        break
      case 'tax_preparation':
        response_data.tax_year = new Date().getFullYear()
        response_data.complexity_level = 'standard'
        break
      case 'insurance_review':
        response_data.coverage_analysis = 'pending'
        response_data.quote_generation = 'in_progress'
        break
    }

    // Store inquiry in database
    const { error: dbError } = await supabase
      .from('domain_events')
      .insert({
        event_type: 'professional_inquiry',
        event_data: {
          inquiry_id,
          inquiry_type: requestData.inquiry_type,
          professional_id: requestData.professional_id,
          service_requested: requestData.service_requested,
          status: 'received',
          timestamp
        },
        aggregate_id: inquiry_id,
        aggregate_type: 'inquiry',
        event_hash: inquiry_id,
        sequence_number: 1,
        metadata: {
          content_free: true,
          professional_service: true
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store inquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Professional inquiry response:', response_data)

    return new Response(
      JSON.stringify(response_data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Professional inquiry error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})