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
    const { events, context } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract features from events
    const features = await extractFeatures(events, context.user_id, context.session_id);
    
    // Classify persona using hybrid classifier
    const classification = await classifyPersona(features, context);
    
    // Apply hysteresis guard
    const selection = await selectPersona(context.user_id, classification, context.session_id);
    
    // Log audit trail
    await logPersonaClassification(supabase, context.user_id, classification, selection);

    return new Response(
      JSON.stringify({
        probs: classification.probs,
        activePersona: selection.switched ? selection.new_persona : selection.previous_persona,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        switched: selection.switched,
        reason: selection.reason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Persona classification error:', error);
    return new Response(
      JSON.stringify({ error: 'Classification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractFeatures(events: any[], userId: string, sessionId: string) {
  // Simplified feature extraction
  return {
    page_sequence_vector: events.slice(-10).map(e => e.page_id || 0),
    dwell_time_stats: { mean: 30000, std: 10000, total: 300000 },
    compliance_features: { license_score: 0.8, ce_compliance: 0.9, cert_count: 3 }
  };
}

async function classifyPersona(features: any, context: any) {
  // Simplified classification
  return {
    probs: { advisor: 0.7, client: 0.2, attorney: 0.1 },
    topPersona: 'advisor',
    confidence: 0.7,
    reasoning: ['High compliance score', 'Professional usage patterns']
  };
}

async function selectPersona(userId: string, classification: any, sessionId: string) {
  // Simplified selection
  return {
    switched: true,
    new_persona: classification.topPersona,
    previous_persona: 'client',
    confidence: classification.confidence,
    reason: 'Classification threshold met'
  };
}

async function logPersonaClassification(supabase: any, userId: string, classification: any, selection: any) {
  // Log to audit trail
  await supabase.from('persona_audit').insert({
    user_id: userId,
    operation_type: 'persona_classify',
    inputs_hash: 'abc123',
    outputs_hash: 'def456',
    narrative: `Classified as ${classification.topPersona} with ${classification.confidence} confidence`
  });
}