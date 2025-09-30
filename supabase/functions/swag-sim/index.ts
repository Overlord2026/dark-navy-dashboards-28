import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MonteCarloResult {
  success_probability: number;
  terminal_p10: number;
  terminal_p50: number;
  terminal_p90: number;
  breach_rate: number;
  etay_value?: number;
  seay_value?: number;
  full_results: any;
}

/**
 * Mock Monte Carlo simulation
 * In production, this would call the actual @swag/analyzer package
 */
function runMonteCarloSimulation(
  inputs: any,
  policy: any,
  nPaths: number
): MonteCarloResult {
  console.log(`Running MC simulation with ${nPaths} paths`);
  
  // Mock calculation based on inputs
  const baseSuccessProb = Math.random() * 0.3 + 0.65; // 65-95%
  const portfolioValue = inputs.accounts?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 1000000;
  
  return {
    success_probability: baseSuccessProb,
    terminal_p10: portfolioValue * (0.3 + Math.random() * 0.2),
    terminal_p50: portfolioValue * (0.7 + Math.random() * 0.3),
    terminal_p90: portfolioValue * (1.2 + Math.random() * 0.5),
    breach_rate: (1 - baseSuccessProb) * (0.8 + Math.random() * 0.2),
    etay_value: policy.metrics?.etayFormula ? 0.045 + Math.random() * 0.02 : undefined,
    seay_value: policy.metrics?.seayFormula ? 0.038 + Math.random() * 0.015 : undefined,
    full_results: {
      paths_simulated: nPaths,
      simulation_date: new Date().toISOString(),
      convergence: true,
      path_sample: [] // Could include sample paths for charts
    }
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    
    if (!record || !record.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: record with id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const runId = record.id;

    // Create service role client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing SWAG simulation run: ${runId}`);

    // Fetch the run and version data
    const { data: run, error: runError } = await supabase
      .from('retirement_runs')
      .select('*, retirement_versions!inner(inputs, policy)')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      console.error('Failed to fetch run:', runError);
      return new Response(
        JSON.stringify({ error: 'Run not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to running
    await supabase
      .from('retirement_runs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', runId);

    // Run the simulation
    const version = run.retirement_versions as any;
    const results = runMonteCarloSimulation(
      version.inputs,
      version.policy,
      run.n_paths
    );

    console.log('Simulation complete, success_prob:', results.success_probability);

    // Insert results
    const { error: resultsError } = await supabase
      .from('retirement_results')
      .insert({
        run_id: runId,
        ...results
      });

    if (resultsError) {
      console.error('Failed to insert results:', resultsError);
      
      // Update run status to failed
      await supabase
        .from('retirement_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: resultsError.message
        })
        .eq('id', runId);

      return new Response(
        JSON.stringify({ error: 'Failed to save results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update run status to completed
    await supabase
      .from('retirement_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', runId);

    return new Response(
      JSON.stringify({ success: true, runId, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in swag-sim:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
