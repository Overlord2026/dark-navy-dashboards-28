import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limiting - max 3 OTP requests per 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentOtps, error: rateLimitError } = await supabase
      .from('user_otp_codes')
      .select('id')
      .eq('user_id', user.id)
      .gt('created_at', fiveMinutesAgo);

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (recentOtps && recentOtps.length >= 3) {
      return new Response(JSON.stringify({ error: 'Too many OTP requests. Please wait 5 minutes.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP in database
    const { error: otpError } = await supabase
      .from('user_otp_codes')
      .insert({
        user_id: user.id,
        otp_code: otpCode,
        expires_at: expiresAt,
        is_used: false,
        attempts: 0
      });

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return new Response(JSON.stringify({ error: 'Failed to generate OTP' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, first_name, last_name')
      .eq('id', user.id)
      .single();

    const userName = profile?.display_name || 
                    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
                    'User';

    // Send OTP via EmailJS
    const emailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_9eb6z0x',
        template_id: 'template_0ttdq0e',
        user_id: 'rfbjUYJ8iPHEZaQvx',
        template_params: {
          to_email: user.email,
          from_name: 'Family Office Platform',
          from_email: 'namandevops44@gmail.com',
          subject: 'Your Verification Code',
          message: `Your verification code for Two-Factor Authentication is: ${otpCode}

This code will expire in 5 minutes for security purposes.

If you didn't request this code, please ignore this email.`,
          user_name: userName,
          user_email: user.email,
          otp_code: otpCode
        }
      })
    });

    if (!emailJSResponse.ok) {
      const emailError = await emailJSResponse.text();
      console.error('EmailJS error:', emailError);
      return new Response(JSON.stringify({ error: 'Failed to send OTP email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OTP sent successfully to:', user.email);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OTP sent successfully',
      expiresAt: expiresAt
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);