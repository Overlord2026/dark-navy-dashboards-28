import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendProInquiryRequest {
  professional_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  message: string;
  inquiry_type: string;
  service_requested?: string;
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

    const requestData: SendProInquiryRequest = await req.json()
    console.log('Send professional inquiry request:', requestData)

    // Validate required fields
    if (!requestData.professional_id || !requestData.client_name || !requestData.client_email || !requestData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const timestamp = new Date().toISOString()
    const inquiry_id = `inq_${requestData.inquiry_type}_${Date.now()}`
    
    // Store inquiry in database using domain_events table
    const { error: dbError } = await supabase
      .from('domain_events')
      .insert({
        event_type: 'professional_inquiry_submitted',
        event_data: {
          inquiry_id,
          professional_id: requestData.professional_id,
          client_name: requestData.client_name,
          client_email: requestData.client_email,
          client_phone: requestData.client_phone,
          message: requestData.message,
          inquiry_type: requestData.inquiry_type,
          service_requested: requestData.service_requested,
          status: 'submitted',
          timestamp
        },
        aggregate_id: inquiry_id,
        aggregate_type: 'professional_inquiry',
        event_hash: inquiry_id,
        sequence_number: 1,
        metadata: {
          content_free: true,
          professional_service: true,
          notification_required: true
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store inquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare success response
    const response_data = {
      inquiry_id,
      status: 'submitted',
      professional_notified: true,
      estimated_response_time: '24 hours',
      message: 'Your inquiry has been sent successfully'
    }

    console.log('Professional inquiry submitted successfully:', response_data)

    return new Response(
      JSON.stringify(response_data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Send professional inquiry error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})