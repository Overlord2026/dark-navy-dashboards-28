import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateOTPRequest {
  email: string;
  userId?: string;
}

// Input validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5322 limit
};

const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnecting = req.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0]?.trim() || 
         realIP || 
         cfConnecting || 
         'unknown';
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  const startTime = Date.now();
  const clientIP = getClientIP(req);

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse and validate request body
    let requestBody: GenerateOTPRequest;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.warn(`Invalid JSON from IP ${clientIP}:`, error);
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const { email, userId } = requestBody;

    // Enhanced input validation
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (!validateEmail(email)) {
      console.warn(`Invalid email format from IP ${clientIP}: ${email}`);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Rate limiting check
    const rateLimitResult = await supabase.rpc('check_rate_limit', {
      p_identifier: clientIP,
      p_limit_type: 'otp_request',
      p_max_attempts: 5,
      p_window_minutes: 15,
      p_block_minutes: 30
    });

    if (rateLimitResult.error) {
      console.error('Rate limit check failed:', rateLimitResult.error);
    } else if (rateLimitResult.data && !rateLimitResult.data.allowed) {
      const reason = rateLimitResult.data.reason;
      const blockedUntil = rateLimitResult.data.blocked_until;
      
      console.warn(`Rate limit exceeded for IP ${clientIP}: ${reason}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          blockedUntil: blockedUntil
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15 minutes
            ...corsHeaders 
          }
        }
      );
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    console.log(`Generating OTP for email: ${email.substring(0, 3)}***@*** from IP: ${clientIP}`);

    // Clean up any existing OTP codes for this user
    if (userId) {
      const { error: deleteError } = await supabase
        .from('user_otp_codes')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('Error cleaning up existing OTPs:', deleteError);
      }
    }

    // Store the OTP in the database
    const { data: otpData, error: otpError } = await supabase
      .from('user_otp_codes')
      .insert({
        user_id: userId || null,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false,
        attempts: 0
      })
      .select()
      .single();

    if (otpError) {
      console.error('Error storing OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`OTP generated and stored: ${otpData.id} for IP: ${clientIP}`);

    // Log security event
    await supabase.rpc('log_security_event', {
      p_event_type: 'otp_generated',
      p_severity: 'low',
      p_resource_type: 'authentication',
      p_action_performed: 'otp_request',
      p_outcome: 'success',
      p_metadata: {
        email_domain: email.split('@')[1],
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent'),
        execution_time_ms: Date.now() - startTime
      }
    });

    // Return success (don't include the actual OTP code in the response for security)
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP generated successfully',
        otpId: otpData.id,
        expiresAt: expiresAt.toISOString()
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          ...corsHeaders 
        }
      }
    );

  } catch (error: any) {
    console.error('Error in generate-otp function:', error);
    
    // Log error event
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: 'otp_generation_error',
        p_severity: 'high',
        p_resource_type: 'authentication',
        p_action_performed: 'otp_request',
        p_outcome: 'error',
        p_metadata: {
          error_message: error.message,
          ip_address: clientIP,
          execution_time_ms: Date.now() - startTime
        }
      });
    } catch (logError) {
      console.error('Failed to log error event:', logError);
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }), // Don't expose internal error details
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          ...corsHeaders 
        }
      }
    );
  }
};

serve(handler);