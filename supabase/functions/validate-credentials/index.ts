import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateCredentialsRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password }: ValidateCredentialsRequest = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Email and password are required' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Validating credentials for: ${email}`);

    // Create a new Supabase client for this validation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Try to sign in with the credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Invalid credentials for ${email}: ${error.message}`);
      return new Response(
        JSON.stringify({ valid: false, error: error.message }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // If successful, immediately sign out to clean up the session
    if (data.session) {
      await supabase.auth.signOut();
      console.log(`Credentials validated successfully for ${email}, session cleaned up`);
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in validate-credentials function:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Validation failed' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);