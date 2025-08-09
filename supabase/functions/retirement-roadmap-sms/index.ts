import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSSequenceData {
  user_id: string;
  client_name: string;
  phone_number: string;
  retirement_plan_id: string;
  confidence_score: number;
  sequence_step: number;
  persona_type?: string;
  portal_link?: string;
  booking_link?: string;
  advisor_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const smsData: SMSSequenceData = await req.json();

    // Check if user has opted in to SMS
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('sms_opt_in, user_settings')
      .eq('id', smsData.user_id)
      .single();

    if (userError || !user?.sms_opt_in) {
      console.log('User not opted in for SMS:', smsData.user_id);
      return new Response(JSON.stringify({ 
        success: false, 
        reason: 'User not opted in for SMS' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Generate SMS content
    const smsContent = generateSMSContent(smsData);

    // Send SMS via Twilio
    const smsResponse = await sendTwilioSMS(smsData.phone_number, smsContent);

    // Log SMS automation event
    await supabaseClient
      .from('sms_automation_logs')
      .insert([{
        user_id: smsData.user_id,
        phone_number: smsData.phone_number,
        message_type: 'retirement_roadmap_sequence',
        sequence_step: smsData.sequence_step,
        message_content: smsContent,
        status: smsResponse.success ? 'sent' : 'failed',
        twilio_sid: smsResponse.sid,
        metadata: {
          retirement_plan_id: smsData.retirement_plan_id,
          persona_type: smsData.persona_type,
          confidence_score: smsData.confidence_score
        }
      }]);

    // Track analytics event
    await supabaseClient
      .from('analytics_events')
      .insert([{
        user_id: smsData.user_id,
        event_type: 'sms_sent',
        event_category: 'retirement_roadmap_automation',
        event_data: {
          sequence_step: smsData.sequence_step,
          persona_type: smsData.persona_type,
          message_type: 'retirement_roadmap_sequence'
        }
      }]);

    console.log('Retirement roadmap SMS sent successfully:', smsResponse);

    return new Response(JSON.stringify({
      success: true,
      sms_sid: smsResponse.sid,
      sequence_step: smsData.sequence_step
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in retirement-roadmap-sms function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

async function sendTwilioSMS(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Missing Twilio configuration');
  }

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, sid: result.sid };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function generateSMSContent(data: SMSSequenceData): string {
  const { sequence_step, persona_type, client_name, confidence_score, portal_link, booking_link, advisor_name } = data;

  // Create shortened links (in production, use a link shortener service)
  const shortPortalLink = shortenLink(portal_link || '');
  const shortBookingLink = shortenLink(booking_link || '');

  const firstName = client_name.split(' ')[0];

  switch (sequence_step) {
    case 1:
      return `Hi ${firstName}, your SWAG™ Retirement Roadmap is ready! Your confidence score: ${confidence_score}%. View it here: ${shortPortalLink} Reply STOP to unsubscribe.`;
    
    case 2:
      if (persona_type === 'advisor') {
        return `${firstName}, your clients love the ${confidence_score}% confidence score feature! See how to boost engagement: ${shortPortalLink} Reply STOP to opt out.`;
      } else if (persona_type === 'cpa' || persona_type === 'attorney') {
        return `${firstName}, your roadmap includes tax & estate integration. Review the compliance-ready analysis: ${shortPortalLink} Reply STOP to unsubscribe.`;
      } else {
        return `Your Retirement Confidence Score is ${confidence_score}%! See what this means for your future: ${shortPortalLink} Reply STOP to unsubscribe.`;
      }
    
    case 3:
      if (persona_type === 'advisor') {
        return `Ready to convert more leads? Book your growth strategy call: ${shortBookingLink} Reply STOP to opt out.`;
      } else {
        return `Turn your roadmap into action — book your strategy call with ${advisor_name?.split(' ')[0] || 'your advisor'}: ${shortBookingLink} Reply STOP to unsubscribe.`;
      }
    
    default:
      return `Hi ${firstName}, thanks for using SWAG™ Retirement GPS! Questions? Contact us anytime. Reply STOP to unsubscribe.`;
  }
}

function shortenLink(url: string): string {
  if (!url) return '#';
  
  // In production, integrate with Bitly, TinyURL, or your own link shortener
  // For now, return a placeholder short link with UTM parameters
  const baseUrl = url.split('?')[0];
  const utmParams = '?utm_source=sms&utm_campaign=swag_roadmap';
  
  // Simple mock shortener - in production use real service
  const shortCode = btoa(baseUrl).slice(0, 8);
  return `${Deno.env.get('SITE_URL') || 'https://app.darknavy.com'}/s/${shortCode}${utmParams}`;
}