import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { computeOverlap, persistOverlapResults } from '../../../src/engines/private/overlap.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OverlapRequest {
  fundIds: string[];
  asOfDate?: string;
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

    const body: OverlapRequest = await req.json();
    const { fundIds, asOfDate } = body;

    if (!fundIds || !Array.isArray(fundIds) || fundIds.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 fundIds required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Computing overlap for funds: ${fundIds.join(', ')}`);

    // Compute overlap using the engine
    const overlapResults = await computeOverlap({ fundIds, asOfDate });

    // Persist results to database
    const overlapId = await persistOverlapResults(
      user.id,
      null, // portfolioId - could be extracted from request if needed
      { fundIds, asOfDate },
      overlapResults
    );

    console.log(`Overlap analysis completed, saved as ${overlapId}`);

    return new Response(
      JSON.stringify({
        success: true,
        overlapId,
        results: overlapResults,
        metadata: {
          fundCount: fundIds.length,
          pairwiseComparisons: Object.keys(overlapResults.pairwise).length,
          topContributors: overlapResults.topContributors.length,
          sectors: Object.keys(overlapResults.sectorHeatmap).length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Overlap analysis failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Overlap analysis failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});