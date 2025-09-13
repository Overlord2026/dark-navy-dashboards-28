import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== LISTING SUPABASE-RELATED SECRETS ===');
    
    // Common Supabase secret names to check
    const supabaseSecrets = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_PROJECT_ID',
      'SUPABASE_JWT_SECRET'
    ];

    const secretsStatus: Record<string, any> = {};

    // Check each secret
    for (const secretName of supabaseSecrets) {
      const secretValue = Deno.env.get(secretName);
      const exists = secretValue !== undefined && secretValue !== null && secretValue !== '';
      
      secretsStatus[secretName] = {
        exists,
        hasValue: exists,
        preview: exists && secretValue ? secretValue.substring(0, 20) + '...' : null
      };
      
      console.log(`${secretName}: ${exists ? 'EXISTS' : 'MISSING'}`);
    }

    // Also check for any environment variables that contain 'SUPABASE'
    const allSupabaseEnvVars: Record<string, any> = {};
    
    // Get all environment variables (this is limited in edge functions for security)
    try {
      // We can only check the ones we know about, as env iteration is restricted
      for (const [key, value] of Object.entries(Deno.env.toObject())) {
        if (key.toUpperCase().includes('SUPABASE')) {
          allSupabaseEnvVars[key] = {
            exists: true,
            hasValue: !!value,
            preview: value ? value.substring(0, 20) + '...' : null
          };
        }
      }
    } catch (error) {
      console.log('Note: Cannot iterate all env vars in edge function context');
    }

    const result = {
      timestamp: new Date().toISOString(),
      commonSupabaseSecrets: secretsStatus,
      detectedSupabaseEnvVars: allSupabaseEnvVars,
      notes: [
        'These are secrets stored in Supabase Edge Functions secrets manager',
        'Client-side variables (VITE_*, NEXT_PUBLIC_*) should be in your project .env file',
        'Server-side secrets (SERVICE_ROLE_KEY) should be in edge function secrets'
      ],
      recommendations: {
        clientSetup: 'Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY',
        serverSetup: 'Ensure SUPABASE_SERVICE_ROLE_KEY is added to edge function secrets for server operations'
      }
    };

    console.log('Secrets check result:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error listing Supabase secrets:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);