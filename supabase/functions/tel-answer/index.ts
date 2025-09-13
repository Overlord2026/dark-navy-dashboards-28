import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface TwilioCallRequest {
  CallSid: string;
  From: string;
  To: string;
  CallerName?: string;
  CallerCity?: string;
  CallerState?: string;
  CallerCountry?: string;
}

const generateTwiML = (callSid: string, caller: string) => {
  const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Welcome to MyBFO Legal Services. This call may be recorded for quality assurance and legal compliance.
  </Say>
  <Pause length="1"/>
  <Say voice="alice">
    Before we begin, please note that this is not a confidential attorney-client conversation unless explicitly established.
    We will collect basic information to determine if we can assist you.
  </Say>
  <Pause length="1"/>
  <Say voice="alice">
    By continuing this call, you consent to recording and processing of your voice data.
    Press 1 to continue, or press 2 to speak with a human representative.
  </Say>
  <Gather numDigits="1" action="${baseUrl}/functions/v1/tel-stream" method="POST" timeout="10">
    <Say voice="alice">Please press 1 to continue with intake, or 2 for human assistance.</Say>
  </Gather>
  <Say voice="alice">I didn't receive your selection. Transferring you to a representative.</Say>
  <Redirect>${baseUrl}/functions/v1/tel-handoff</Redirect>
</Response>`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let formData: TwilioCallRequest;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse Twilio webhook form data
      const body = await req.text();
      const urlParams = new URLSearchParams(body);
      formData = Object.fromEntries(urlParams.entries()) as any;
    } else {
      // JSON fallback
      formData = await req.json();
    }

    const { CallSid, From, To, CallerName, CallerCity, CallerState, CallerCountry } = formData;

    console.log('Incoming call:', { CallSid, From, To, CallerName });

    // Get caller's org_id from profiles based on phone number
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('phone', From)
      .single();

    const orgId = profile?.tenant_id || 'unknown';

    // Create initial call record
    const { error: callError } = await supabase
      .from('aies_voice_calls')
      .insert({
        call_id: CallSid,
        org_id: orgId,
        matter_type: 'intake',
        consent_required: true,
        consent_obtained: false,
        geo: {
          caller_city: CallerCity,
          caller_state: CallerState,
          caller_country: CallerCountry,
          caller_name: CallerName
        },
        qualified: false,
        conflict_passed: false
      });

    if (callError) {
      console.error('Error creating call record:', callError);
    }

    // Generate TwiML response
    const twiml = generateTwiML(CallSid, From);

    return new Response(twiml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error in tel-answer:', error);
    
    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We're experiencing technical difficulties. Please call back later or visit our website.</Say>
  <Hangup/>
</Response>`;

    return new Response(errorTwiml, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});