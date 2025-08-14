import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { document_id, user_id, state_jurisdiction, preferred_provider } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check state policies
    const { data: policy } = await supabase
      .from('notary_state_policies')
      .select('*')
      .eq('state_code', state_jurisdiction)
      .eq('is_active', true)
      .single();

    if (!policy) {
      throw new Error(`Notarization not available in ${state_jurisdiction}`);
    }

    // Select provider based on availability and preference
    let provider = 'docusign';
    if (preferred_provider === 'notarycam' && policy.notarycam_enabled) {
      provider = 'notarycam';
    } else if (!policy.docusign_enabled) {
      throw new Error(`No notary providers available in ${state_jurisdiction}`);
    }

    // Create notarization session
    const sessionId = crypto.randomUUID();
    const { data: notarization, error } = await supabase
      .from('connector_notarizations')
      .insert({
        document_id,
        user_id,
        notary_provider: provider,
        notary_session_id: sessionId,
        state_jurisdiction,
        tenant_id: req.headers.get('x-tenant-id')
      })
      .select()
      .single();

    if (error) throw error;

    // Initialize with provider
    const providerResult = await initializeNotarySession(provider, notarization, policy);

    return new Response(JSON.stringify({
      notarization_id: notarization.id,
      session_url: providerResult.session_url,
      provider
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Notarization error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function initializeNotarySession(provider: string, notarization: any, policy: any) {
  switch (provider) {
    case 'docusign':
      return await initializeDocuSign(notarization, policy);
    case 'notarycam':
      return await initializeNotaryCam(notarization, policy);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function initializeDocuSign(notarization: any, policy: any) {
  // DocuSign Notary API integration
  return { session_url: `https://demo.docusign.net/notary/${notarization.notary_session_id}` };
}

async function initializeNotaryCam(notarization: any, policy: any) {
  // NotaryCam API integration
  return { session_url: `https://app.notarycam.com/session/${notarization.notary_session_id}` };
}