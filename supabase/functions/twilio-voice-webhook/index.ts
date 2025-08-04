import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TwilioWebhookBody {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: string;
  Direction: string;
  CallDuration?: string;
  RecordingUrl?: string;
  RecordingSid?: string;
  TranscriptionText?: string;
  TranscriptionStatus?: string;
}

serve(async (req) => {
  console.log('Twilio Voice webhook received:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse Twilio webhook data
    const formData = await req.formData();
    const webhookData: TwilioWebhookBody = {};
    
    for (const [key, value] of formData.entries()) {
      webhookData[key as keyof TwilioWebhookBody] = value as string;
    }

    console.log('Webhook data:', webhookData);

    // Get advisor info from phone number
    const { data: phoneRecord } = await supabase
      .from('twilio_phone_numbers')
      .select('advisor_id, tenant_id')
      .eq('phone_number', webhookData.To)
      .single();

    if (!phoneRecord) {
      console.log('No phone record found for:', webhookData.To);
      return new Response('Phone number not found', { status: 404 });
    }

    // Handle different call events
    switch (webhookData.CallStatus) {
      case 'ringing':
        // Initial call - create call log
        await supabase.from('call_logs').insert({
          twilio_call_sid: webhookData.CallSid,
          from_number: webhookData.From,
          to_number: webhookData.To,
          advisor_id: phoneRecord.advisor_id,
          tenant_id: phoneRecord.tenant_id,
          direction: webhookData.Direction === 'inbound' ? 'inbound' : 'outbound',
          status: 'ringing',
          call_data: webhookData
        });

        // Get call routing rules
        const { data: routing } = await supabase
          .from('call_routing')
          .select('*')
          .eq('advisor_id', phoneRecord.advisor_id)
          .eq('is_active', true)
          .single();

        if (routing && webhookData.Direction === 'inbound') {
          // Check business hours
          const now = new Date();
          const currentHour = now.getHours();
          const businessHours = routing.business_hours;
          const startHour = parseInt(businessHours.start.split(':')[0]);
          const endHour = parseInt(businessHours.end.split(':')[0]);

          let twimlResponse = '';

          if (currentHour >= startHour && currentHour < endHour) {
            // Business hours - forward call
            twimlResponse = `
              <Response>
                <Say voice="alice">Please hold while we connect you to your advisor.</Say>
                <Dial>${routing.forward_to_number}</Dial>
                ${routing.voicemail_enabled ? `
                <Record 
                  action="https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook" 
                  method="POST" 
                  maxLength="120"
                  transcribe="true"
                  transcribeCallback="https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook"
                />
                ` : ''}
              </Response>
            `;
          } else {
            // After hours - go to voicemail
            twimlResponse = `
              <Response>
                <Say voice="alice">Thank you for calling. We're currently closed. Please leave a message after the tone.</Say>
                <Record 
                  action="https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook" 
                  method="POST" 
                  maxLength="120"
                  transcribe="true"
                  transcribeCallback="https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook"
                />
              </Response>
            `;
          }

          return new Response(twimlResponse, {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/xml',
            },
          });
        }
        break;

      case 'completed':
      case 'failed':
      case 'busy':
      case 'no-answer':
        // Update call log with final status
        await supabase
          .from('call_logs')
          .update({
            status: webhookData.CallStatus,
            duration_seconds: webhookData.CallDuration ? parseInt(webhookData.CallDuration) : null,
            recording_url: webhookData.RecordingUrl,
            recording_sid: webhookData.RecordingSid,
            transcript: webhookData.TranscriptionText,
            call_data: webhookData
          })
          .eq('twilio_call_sid', webhookData.CallSid);

        // If it's a voicemail (has recording), create voicemail record
        if (webhookData.RecordingUrl && webhookData.RecordingSid) {
          await supabase.from('voicemails').insert({
            call_log_id: (await supabase
              .from('call_logs')
              .select('id')
              .eq('twilio_call_sid', webhookData.CallSid)
              .single()).data?.id,
            advisor_id: phoneRecord.advisor_id,
            client_phone: webhookData.From,
            recording_url: webhookData.RecordingUrl,
            recording_sid: webhookData.RecordingSid,
            transcription: webhookData.TranscriptionText,
            duration_seconds: webhookData.CallDuration ? parseInt(webhookData.CallDuration) : null,
            tenant_id: phoneRecord.tenant_id
          });

          // Send voicemail notification (can implement email/SMS later)
          console.log('New voicemail received for advisor:', phoneRecord.advisor_id);
        }
        break;
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});