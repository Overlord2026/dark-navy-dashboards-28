import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  areaCode: string;
  limit?: number;
}

serve(async (req) => {
  console.log('Number search request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Twilio credentials
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured');
    }

    const { areaCode, limit = 10 }: SearchRequest = await req.json();

    if (!areaCode || areaCode.length !== 3) {
      throw new Error('Valid 3-digit area code is required');
    }

    const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    // Search for available numbers
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/AvailablePhoneNumbers/US/Local.json?AreaCode=${areaCode}&Limit=${limit}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to search numbers: ${data.message}`);
    }

    const numbers = data.available_phone_numbers?.map((number: any) => number.phone_number) || [];

    console.log(`Found ${numbers.length} numbers for area code ${areaCode}`);

    return new Response(JSON.stringify({
      success: true,
      numbers,
      areaCode
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Number search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});