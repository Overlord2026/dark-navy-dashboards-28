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

    // Note: In a real implementation, you would send the email here
    // For now, we'll simulate it and log the OTP for testing
    console.log(`OTP Code for ${email}: ${otpRecord.otp_code}`);

    // You would replace this with actual email sending logic
    // For example, using a service like Resend, SendGrid, etc.
    
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