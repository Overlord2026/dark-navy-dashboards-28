import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhoneProvisionRequest {
  advisorId: string;
  areaCode?: string;
  friendlyName?: string;
  forwardToNumber?: string;
}

interface TwilioNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
  };
}

serve(async (req) => {
  console.log('Phone manager request:', req.method);

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

    const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    if (req.method === 'POST') {
      const { advisorId, areaCode = '555', friendlyName, forwardToNumber }: PhoneProvisionRequest = await req.json();

      console.log('Provisioning phone for advisor:', advisorId);

      // Check if advisor already has a phone number
      const { data: existingPhone } = await supabase
        .from('twilio_phone_numbers')
        .select('*')
        .eq('advisor_id', advisorId)
        .eq('status', 'active')
        .single();

      if (existingPhone) {
        return new Response(JSON.stringify({ 
          error: 'Advisor already has an active phone number',
          phoneNumber: existingPhone.phone_number 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get advisor's tenant info
      const { data: advisor } = await supabase
        .from('advisor_profiles')
        .select('user_id')
        .eq('id', advisorId)
        .single();

      if (!advisor) {
        throw new Error('Advisor not found');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', advisor.user_id)
        .single();

      if (!profile) {
        throw new Error('Advisor profile not found');
      }

      // Search for available numbers
      const searchResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/AvailablePhoneNumbers/US/Local.json?AreaCode=${areaCode}&Limit=1`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
          },
        }
      );

      const searchData = await searchResponse.json();
      
      if (!searchData.available_phone_numbers || searchData.available_phone_numbers.length === 0) {
        throw new Error(`No available numbers in area code ${areaCode}`);
      }

      const availableNumber = searchData.available_phone_numbers[0];

      // Purchase the number
      const purchaseResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            PhoneNumber: availableNumber.phone_number,
            FriendlyName: friendlyName || `BFO - ${advisorId}`,
            VoiceUrl: 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook',
            VoiceMethod: 'POST',
            SmsUrl: 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook',
            SmsMethod: 'POST',
          }),
        }
      );

      const purchaseData = await purchaseResponse.json();
      
      if (!purchaseResponse.ok) {
        throw new Error(`Failed to purchase number: ${purchaseData.message}`);
      }

      // Store in database
      const { data: phoneRecord, error: dbError } = await supabase
        .from('twilio_phone_numbers')
        .insert({
          phone_number: purchaseData.phone_number,
          friendly_name: purchaseData.friendly_name,
          advisor_id: advisorId,
          tenant_id: profile.tenant_id,
          twilio_sid: purchaseData.sid,
          capabilities: {
            voice: purchaseData.capabilities.voice,
            sms: purchaseData.capabilities.sms
          }
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save phone number to database');
      }

      // Create call routing if forward number provided
      if (forwardToNumber) {
        await supabase.from('call_routing').insert({
          advisor_id: advisorId,
          twilio_number: purchaseData.phone_number,
          forward_to_number: forwardToNumber,
          tenant_id: profile.tenant_id
        });
      }

      console.log('Phone provisioned successfully:', purchaseData.phone_number);

      return new Response(JSON.stringify({
        success: true,
        phoneNumber: purchaseData.phone_number,
        sid: purchaseData.sid,
        capabilities: purchaseData.capabilities
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'GET') {
      // Get phone numbers for advisor
      const url = new URL(req.url);
      const advisorId = url.searchParams.get('advisorId');

      if (!advisorId) {
        throw new Error('advisorId parameter required');
      }

      const { data: phoneNumbers } = await supabase
        .from('twilio_phone_numbers')
        .select('*')
        .eq('advisor_id', advisorId);

      return new Response(JSON.stringify(phoneNumbers), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'DELETE') {
      // Release phone number
      const { phoneNumberSid } = await req.json();

      const releaseResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Basic ${authHeader}`,
          },
        }
      );

      if (!releaseResponse.ok) {
        throw new Error('Failed to release phone number from Twilio');
      }

      // Update database
      await supabase
        .from('twilio_phone_numbers')
        .update({ status: 'released' })
        .eq('twilio_sid', phoneNumberSid);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('Phone manager error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});