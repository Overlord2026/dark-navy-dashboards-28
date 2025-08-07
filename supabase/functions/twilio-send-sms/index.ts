import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  to: string;
  message: string;
  advisorId?: string;
}

serve(async (req) => {
  console.log('SMS send request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Twilio credentials
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured');
    }

    const { to, message, advisorId }: SMSRequest = await req.json();

    // Get advisor's phone number
    let fromNumber;
    if (advisorId) {
      const { data: phoneRecord } = await supabase
        .from('twilio_phone_numbers')
        .select('phone_number')
        .eq('advisor_id', advisorId)
        .eq('status', 'active')
        .single();

      fromNumber = phoneRecord?.phone_number;
    }

    if (!fromNumber) {
      throw new Error('No active phone number found for advisor');
    }

    const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    // Send SMS via Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: to,
          Body: message,
          StatusCallback: 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to send SMS: ${data.message}`);
    }

    // Log the message in database
    await supabase.from('sms_logs').insert({
      twilio_message_sid: data.sid,
      from_number: fromNumber,
      to_number: to,
      message_body: message,
      advisor_id: advisorId,
      direction: 'outbound',
      status: data.status,
      message_data: data
    });

    console.log('SMS sent successfully:', data.sid);

    return new Response(JSON.stringify({
      success: true,
      messageSid: data.sid,
      status: data.status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});