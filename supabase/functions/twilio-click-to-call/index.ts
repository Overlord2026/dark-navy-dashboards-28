import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallRequest {
  advisorId: string;
  clientPhoneNumber: string;
  clientId?: string;
}

serve(async (req) => {
  console.log('Click-to-call request:', req.method);

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

    const { advisorId, clientPhoneNumber, clientId }: CallRequest = await req.json();

    // Get advisor's phone number
    const { data: phoneRecord } = await supabase
      .from('twilio_phone_numbers')
      .select('phone_number, tenant_id')
      .eq('advisor_id', advisorId)
      .eq('status', 'active')
      .single();

    if (!phoneRecord) {
      throw new Error('No active phone number found for advisor');
    }

    // Get call routing info
    const { data: routing } = await supabase
      .from('call_routing')
      .select('forward_to_number, recording_enabled')
      .eq('advisor_id', advisorId)
      .eq('is_active', true)
      .single();

    if (!routing) {
      throw new Error('No call routing configured for advisor');
    }

    const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    // Create the call
    const callResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: phoneRecord.phone_number,
          To: clientPhoneNumber,
          Url: 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-call-connect',
          Method: 'POST',
          StatusCallback: 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook',
          StatusCallbackMethod: 'POST',
          StatusCallbackEvent: 'initiated,ringing,answered,completed',
          Record: routing.recording_enabled ? 'true' : 'false',
          Timeout: '30'
        }),
      }
    );

    const callData = await callResponse.json();

    if (!callResponse.ok) {
      throw new Error(`Failed to initiate call: ${callData.message}`);
    }

    // Log the call in database
    await supabase.from('call_logs').insert({
      twilio_call_sid: callData.sid,
      from_number: phoneRecord.phone_number,
      to_number: clientPhoneNumber,
      advisor_id: advisorId,
      client_id: clientId,
      tenant_id: phoneRecord.tenant_id,
      direction: 'outbound',
      status: 'initiated',
      call_data: callData
    });

    console.log('Call initiated:', callData.sid);

    return new Response(JSON.stringify({
      success: true,
      callSid: callData.sid,
      status: callData.status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Click-to-call error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});