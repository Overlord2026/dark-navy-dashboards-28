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

interface TwilioHandoffRequest {
  CallSid: string;
  From: string;
  To: string;
  DialCallStatus?: string;
  DialCallDuration?: string;
}

const getAvailableAgents = async (orgId: string) => {
  // Query for available human agents
  const { data: agents } = await supabase
    .from('profiles')
    .select('phone, display_name')
    .eq('tenant_id', orgId)
    .eq('role', 'advisor')
    .eq('status', 'available')
    .limit(3);

  return agents || [];
};

const logHandoffEvent = async (callSid: string, eventType: string, details: any) => {
  const { error } = await supabase
    .from('aies_voice_calls')
    .update({
      scheduling: {
        handoff_events: [
          {
            timestamp: new Date().toISOString(),
            event_type: eventType,
            details
          }
        ]
      }
    })
    .eq('call_id', callSid);

  if (error) {
    console.error('Error logging handoff event:', error);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let formData: TwilioHandoffRequest;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const body = await req.text();
      const urlParams = new URLSearchParams(body);
      formData = Object.fromEntries(urlParams.entries()) as any;
    } else {
      formData = await req.json();
    }

    const { CallSid, From, To, DialCallStatus, DialCallDuration } = formData;

    console.log('Handoff request:', { CallSid, From, To, DialCallStatus });

    // Get call record to determine org
    const { data: callRecord } = await supabase
      .from('aies_voice_calls')
      .select('org_id, matter_type')
      .eq('call_id', CallSid)
      .single();

    if (!callRecord) {
      console.error('Call record not found for:', CallSid);
      
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Unable to process transfer. Please call our main number.</Say>
  <Hangup/>
</Response>`, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Log handoff attempt
    await logHandoffEvent(CallSid, 'handoff_requested', {
      caller: From,
      matter_type: callRecord.matter_type,
      timestamp: new Date().toISOString()
    });

    // Get available agents
    const agents = await getAvailableAgents(callRecord.org_id);

    if (agents.length === 0) {
      // No agents available - take message
      await logHandoffEvent(CallSid, 'no_agents_available', {
        attempted_at: new Date().toISOString()
      });

      return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    All representatives are currently busy. Please leave a detailed message after the tone, 
    including your name, contact information, and a brief description of your legal matter.
  </Say>
  <Record maxLength="300" action="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/tel-handoff/voicemail" method="POST" />
  <Say voice="alice">Thank you for your message. We will contact you within one business day.</Say>
  <Hangup/>
</Response>`, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Try to connect to available agent
    const primaryAgent = agents[0];
    const backupAgents = agents.slice(1);

    await logHandoffEvent(CallSid, 'agent_dial_attempt', {
      primary_agent: primaryAgent.display_name,
      backup_count: backupAgents.length
    });

    // Build dial TwiML with fallback agents
    let dialTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting you to a representative. Please hold.</Say>
  <Dial timeout="20" action="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/tel-handoff/status" method="POST">
    <Number>${primaryAgent.phone}</Number>`;

    // Add backup numbers
    for (const agent of backupAgents) {
      dialTwiML += `<Number>${agent.phone}</Number>`;
    }

    dialTwiML += `
  </Dial>
  <Say voice="alice">Unable to reach a representative. Please leave a message.</Say>
  <Record maxLength="300" action="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/tel-handoff/voicemail" method="POST" />
  <Hangup/>
</Response>`;

    return new Response(dialTwiML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error in tel-handoff:', error);
    
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Technical difficulties. Please call back or visit our website.</Say>
  <Hangup/>
</Response>`, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});