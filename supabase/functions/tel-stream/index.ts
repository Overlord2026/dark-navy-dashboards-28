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

interface TwilioGatherRequest {
  CallSid: string;
  From: string;
  Digits?: string;
  SpeechResult?: string;
  Confidence?: string;
}

const handleDTMFFlow = async (callSid: string, digits: string) => {
  const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '');
  
  switch (digits) {
    case '1':
      // Continue with intake - start media stream
      await supabase
        .from('aies_voice_calls')
        .update({ consent_obtained: true })
        .eq('call_id', callSid);

      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for your consent. I'll now collect some basic information about your legal matter.</Say>
  <Connect>
    <Stream url="wss://${new URL(baseUrl!).hostname}/functions/v1/tel-stream/ws" />
  </Connect>
  <Say voice="alice">Please describe your legal matter in a few sentences.</Say>
  <Record maxLength="120" action="${baseUrl}/functions/v1/tel-stream/record" method="POST" />
</Response>`;

    case '2':
      // Transfer to human
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting you to a representative. Please hold.</Say>
  <Redirect>${baseUrl}/functions/v1/tel-handoff</Redirect>
</Response>`;

    default:
      // Invalid input
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Invalid selection. Please try again.</Say>
  <Gather numDigits="1" action="${baseUrl}/functions/v1/tel-stream" method="POST" timeout="10">
    <Say voice="alice">Press 1 to continue with intake, or 2 for human assistance.</Say>
  </Gather>
  <Redirect>${baseUrl}/functions/v1/tel-handoff</Redirect>
</Response>`;
  }
};

const handleMediaStream = async (req: Request) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log('WebSocket connection established for media streaming');

  socket.onopen = () => {
    console.log("Media stream WebSocket opened");
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      
      switch (message.event) {
        case 'connected':
          console.log('Twilio connected:', message);
          break;
          
        case 'start':
          console.log('Media stream started:', message);
          // Initialize AI processing here
          break;
          
        case 'media':
          // Process real-time audio data
          const audioPayload = message.media.payload;
          console.log('Received audio chunk, size:', audioPayload.length);
          
          // TODO: Send to OpenAI Realtime API or speech processing service
          // For now, just acknowledge receipt
          socket.send(JSON.stringify({
            event: 'mark',
            streamSid: message.streamSid,
            mark: {
              name: 'audio-processed'
            }
          }));
          break;
          
        case 'stop':
          console.log('Media stream stopped:', message);
          socket.close();
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  socket.onclose = () => {
    console.log("Media stream WebSocket closed");
  };

  socket.onerror = (error) => {
    console.error("Media stream WebSocket error:", error);
  };

  return response;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  // Handle WebSocket upgrade for media streaming
  if (url.pathname.endsWith('/ws')) {
    return handleMediaStream(req);
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let formData: TwilioGatherRequest;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const body = await req.text();
      const urlParams = new URLSearchParams(body);
      formData = Object.fromEntries(urlParams.entries()) as any;
    } else {
      formData = await req.json();
    }

    const { CallSid, From, Digits, SpeechResult } = formData;

    console.log('Stream request:', { CallSid, From, Digits, SpeechResult });

    // Handle recording completion
    if (url.pathname.endsWith('/record')) {
      const recordingUrl = formData.RecordingUrl || '';
      
      // Update call record with transcript
      await supabase
        .from('aies_voice_calls')
        .update({ 
          audio_hash: recordingUrl,
          transcript_hash: SpeechResult || 'audio-only'
        })
        .eq('call_id', CallSid);

      return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you. We're processing your information and will be in touch shortly.</Say>
  <Hangup/>
</Response>`, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Handle DTMF input
    if (Digits) {
      const twiml = await handleDTMFFlow(CallSid, Digits);
      return new Response(twiml, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Default response
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Processing your request...</Say>
</Response>`, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error in tel-stream:', error);
    
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Technical error occurred. Transferring to representative.</Say>
  <Redirect>${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/tel-handoff</Redirect>
</Response>`, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});