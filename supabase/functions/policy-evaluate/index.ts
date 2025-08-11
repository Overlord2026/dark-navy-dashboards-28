import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, action, resource } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get policies for tenant
    const { data: policies } = await supabase
      .from('policies')
      .select('*')
      .eq('tenant_id', context.tenant_id)
      .eq('is_active', true);

    // Evaluate policies
    const decision = await evaluatePolicies(policies || [], context, action, resource);
    
    // Generate policy token if allowed
    let token = null;
    if (decision.effect === 'ALLOW') {
      token = await generatePolicyToken(context, decision.scopes);
    }

    return new Response(
      JSON.stringify({
        effect: decision.effect,
        scopes: decision.scopes,
        reason: decision.reason,
        token: token
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Policy evaluation error:', error);
    return new Response(
      JSON.stringify({ error: 'Policy evaluation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function evaluatePolicies(policies: any[], context: any, action: string, resource: string) {
  // Simplified policy evaluation
  if (context.persona === 'advisor' && action === 'read' && resource.startsWith('portfolio')) {
    return {
      effect: 'ALLOW',
      scopes: [`${action}:${resource}`, `persona:${context.persona}`],
      reason: 'Advisor can read portfolio data'
    };
  }
  
  return {
    effect: 'DENY',
    scopes: [],
    reason: 'No matching policy found'
  };
}

async function generatePolicyToken(context: any, scopes: string[]) {
  // Simplified token generation
  const payload = {
    user_id: context.user_id,
    tenant_id: context.tenant_id,
    persona: context.persona,
    scopes: scopes,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  
  return btoa(JSON.stringify(payload));
}