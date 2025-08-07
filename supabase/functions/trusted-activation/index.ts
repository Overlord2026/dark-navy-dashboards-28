import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MFARequest {
  userId: string;
  action: 'send' | 'verify';
  phoneNumber?: string;
  code?: string;
  actionType: 'wire_transfer' | 'account_opening' | 'password_reset' | 'sensitive_document';
}

interface MFAResponse {
  success: boolean;
  challengeId?: string;
  verified?: boolean;
  error?: string;
}

serve(async (req) => {
  console.log('Trusted Activation MFA request:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured');
    }

    const { userId, action, phoneNumber, code, actionType }: MFARequest = await req.json();

    if (action === 'send') {
      // Generate and send MFA code
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      const challengeId = crypto.randomUUID();

      // Store challenge in database
      await supabase.from('mfa_challenges').insert({
        challenge_id: challengeId,
        user_id: userId,
        phone_number: phoneNumber,
        code: mfaCode,
        action_type: actionType,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        attempts: 0,
        status: 'pending'
      });

      // Send SMS via Twilio
      const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
      
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: '+1234567890', // Your Twilio number
            To: phoneNumber!,
            Body: `Your BFO security code is: ${mfaCode}. This code expires in 10 minutes. Do not share this code with anyone.`
          }),
        }
      );

      if (!twilioResponse.ok) {
        throw new Error('Failed to send MFA code');
      }

      console.log('MFA code sent for challenge:', challengeId);

      return new Response(JSON.stringify({
        success: true,
        challengeId,
        message: 'MFA code sent successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'verify') {
      // Verify MFA code
      const { data: challenge } = await supabase
        .from('mfa_challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (!challenge) {
        // Increment failed attempts
        await supabase
          .from('mfa_challenges')
          .update({ 
            attempts: challenge?.attempts + 1 || 1,
            status: 'failed'
          })
          .eq('user_id', userId)
          .eq('status', 'pending');

        return new Response(JSON.stringify({
          success: false,
          verified: false,
          error: 'Invalid or expired code'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Mark challenge as completed
      await supabase
        .from('mfa_challenges')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('challenge_id', challenge.challenge_id);

      // Log the successful MFA event
      await supabase.from('security_audit_logs').insert({
        user_id: userId,
        event_type: 'mfa_success',
        severity: 'low',
        action_performed: actionType,
        outcome: 'success',
        metadata: {
          challenge_id: challenge.challenge_id,
          action_type: actionType
        }
      });

      console.log('MFA verification successful for user:', userId);

      return new Response(JSON.stringify({
        success: true,
        verified: true,
        challengeId: challenge.challenge_id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action type');

  } catch (error) {
    console.error('Trusted Activation error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});