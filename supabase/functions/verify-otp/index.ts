import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
  userId?: string;
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

    const { email, otpCode, userId }: VerifyOTPRequest = await req.json();

    if (!email || !otpCode) {
      return new Response(
        JSON.stringify({ error: 'Email and OTP code are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Verifying OTP for email: ${email}`);

    // Use the existing validate_otp_code function if userId is provided
    if (userId) {
      const { data: isValid, error: validationError } = await supabase
        .rpc('validate_otp_code', {
          p_user_id: userId,
          p_otp_code: otpCode
        });

      if (validationError) {
        console.error('Error validating OTP:', validationError);
        return new Response(
          JSON.stringify({ error: 'Failed to validate OTP' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      if (!isValid) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid or expired OTP code' 
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Enable 2FA for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return new Response(
          JSON.stringify({ error: 'Failed to enable 2FA' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      console.log(`2FA enabled for user: ${userId}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: '2FA enabled successfully' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Fallback verification for cases without userId
    const { data: otpRecord, error: fetchError } = await supabase
      .from('user_otp_codes')
      .select('*')
      .eq('otp_code', otpCode)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .lt('attempts', 3)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired OTP code' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Mark OTP as used
    await supabase
      .from('user_otp_codes')
      .update({ is_used: true })
      .eq('id', otpRecord.id);

    console.log(`OTP verified successfully: ${otpRecord.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
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