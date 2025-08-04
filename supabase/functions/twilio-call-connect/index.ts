import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Call connect TwiML request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse form data from Twilio
    const formData = await req.formData();
    const callData: any = {};
    
    for (const [key, value] of formData.entries()) {
      callData[key] = value;
    }

    console.log('Call connect data:', callData);

    // Simple TwiML to connect the advisor to the client
    const twimlResponse = `
      <Response>
        <Say voice="alice">Connecting you now.</Say>
        <Dial timeout="30">
          <Number>${callData.To}</Number>
        </Dial>
      </Response>
    `;

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error('Call connect error:', error);
    
    const errorTwiml = `
      <Response>
        <Say voice="alice">Sorry, we're unable to complete your call at this time. Please try again later.</Say>
        <Hangup/>
      </Response>
    `;

    return new Response(errorTwiml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });
  }
});