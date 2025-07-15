import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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

    // Send OTP via Resend
    try {
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const emailResponse = await resend.emails.send({
        from: 'Family Office Security <noreply@your-domain.com>',
        to: [email],
        subject: 'Your Two-Factor Authentication Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Two-Factor Authentication Code</h2>
            <p>Hello ${userName || 'User'},</p>
            <p>Your verification code is:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otpRecord.otp_code}</span>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Best regards,<br>Family Office Security Team</p>
          </div>
        `
      });

      console.log('Email sent successfully:', emailResponse);
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