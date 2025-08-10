import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildDDPackage } from '../../../src/engines/private/ddPack.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DDPackageRequest {
  fundId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: DDPackageRequest = await req.json();
    const { fundId } = body;

    if (!fundId) {
      return new Response(
        JSON.stringify({ error: 'fundId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Building DD package for fund: ${fundId}`);

    // Build DD package using the engine
    const packageResult = await buildDDPackage({
      userId: user.id,
      fundId
    });

    console.log(`DD package created: ${packageResult.packageId}`);

    return new Response(
      JSON.stringify({
        success: true,
        packageId: packageResult.packageId,
        pdfUrl: packageResult.pdfUrl,
        zipUrl: packageResult.zipUrl,
        metadata: {
          fundId,
          userId: user.id,
          generatedAt: new Date().toISOString(),
          urls: {
            pdf: packageResult.pdfUrl,
            zip: packageResult.zipUrl
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('DD package generation failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'DD package generation failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});