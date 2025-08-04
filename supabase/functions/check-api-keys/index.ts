import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckRequest {
  secretName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretName }: CheckRequest = await req.json();

    if (!secretName) {
      return new Response(
        JSON.stringify({ error: 'Secret name is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Checking for secret: ${secretName}`);

    // Check if the environment variable exists
    const secretValue = Deno.env.get(secretName);
    const exists = secretValue !== undefined && secretValue !== null && secretValue !== '';

    console.log(`Secret ${secretName} ${exists ? 'exists' : 'is missing'}`);

    return new Response(
      JSON.stringify({ 
        exists,
        secretName,
        message: exists ? 'Secret is configured' : 'Secret is missing or empty'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in check-api-keys function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        exists: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);