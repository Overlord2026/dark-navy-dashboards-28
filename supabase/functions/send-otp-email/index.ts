
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { email, userId }: SendOTPRequest = await req.json();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Check rate limiting - max 3 OTP requests per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentCodes, error: countError } = await supabaseClient
      .from('user_otp_codes')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', tenMinutesAgo);

    if (countError) {
      throw new Error('Failed to check rate limit');
    }

    if (recentCodes && recentCodes.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many OTP requests. Please wait 10 minutes before requesting again.' }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Store OTP in database
    const { error: insertError } = await supabaseClient
      .from('user_otp_codes')
      .insert({
        user_id: userId,
        otp_code: otpCode,
        expires_at: expiresAt
      });

    if (insertError) {
      throw new Error(`Failed to store OTP: ${insertError.message}`);
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Boutique Family Office <onboarding@resend.dev>",
      to: [email],
      subject: "Your Login Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1B1B32; margin: 0;">Boutique Family Office</h1>
          </div>
          
          <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
          
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #1B1B32; letter-spacing: 8px; font-family: monospace;">
              ${otpCode}
            </div>
          </div>
          
          <p style="color: #666; text-align: center; margin: 20px 0;">
            Enter this code to complete your login. This code will expire in <strong>5 minutes</strong>.
          </p>
          
          <p style="color: #666; text-align: center; font-size: 14px;">
            If you didn't request this code, please ignore this email or contact support if you have concerns.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Boutique Family Office. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
