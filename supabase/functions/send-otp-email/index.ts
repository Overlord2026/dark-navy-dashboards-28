
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  email: string;
  userId?: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, userId, userName }: SendOTPRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Sending OTP email to: ${email}`);

    // First, generate the OTP
    const generateResponse = await supabase.functions.invoke('generate-otp', {
      body: { email, userId }
    });

    if (generateResponse.error) {
      console.error('Error generating OTP:', generateResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Get the OTP code from the database
    const { data: otpRecord } = await supabase
      .from('user_otp_codes')
      .select('otp_code')
      .eq('user_id', userId || null)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve OTP' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Send OTP via EmailJS with server-side authentication
    try {
      const emailPayload = {
        service_id: 'service_cew8n8b',
        template_id: 'template_xts37ho',
        user_id: 'chtAi9WR2OnpWeUXo',
        accessToken: Deno.env.get('EMAILJS_PRIVATE_KEY'), // Use the private key for server-side auth
        template_params: {
          to_email: email,
          to_name: userName || 'User',
          otp_code: otpRecord.otp_code,
          from_name: 'Family Office Security',
          subject: 'Your Two-Factor Authentication Code',
          message: `Your verification code is: ${otpRecord.otp_code}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`
        }
      };

      console.log('EmailJS payload:', JSON.stringify(emailPayload, null, 2));

      const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      });

      const responseText = await emailResponse.text();
      console.log('EmailJS response status:', emailResponse.status);
      console.log('EmailJS response:', responseText);

      if (!emailResponse.ok) {
        throw new Error(`EmailJS API error: ${emailResponse.status} ${emailResponse.statusText} - ${responseText}`);
      }

      console.log(`OTP email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Log the OTP for testing if email fails
      console.log(`OTP Code for ${email}: ${otpRecord.otp_code} (email failed)`);
      
      // Re-throw the error to ensure proper error handling
      throw emailError;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // In development, include the OTP for testing
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { 
          otpCode: otpRecord.otp_code 
        })
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in send-otp-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);
