import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reason codes with explanations
const REASON_CODES = {
  OK_POLICY: 'Action allowed by policy',
  BLOCK_CONFLICT: 'Blocked due to conflicting consent',
  REQUIRE_DISCLOSURE: 'Requires additional disclosure',
  INSUFFICIENT_CONSENT: 'No valid consent for this action',
  EXPIRED_CONSENT: 'Consent has expired',
  REVOKED_CONSENT: 'Consent has been revoked',
  JURISDICTION_MISMATCH: 'Action not permitted in this jurisdiction',
  SCOPE_VIOLATION: 'Action exceeds granted scope'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action_key, persona_session_id, context = {} } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authorization required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    // Get persona session
    const { data: session } = await supabase
      .from('persona_sessions')
      .select('*, personas(*)')
      .eq('id', persona_session_id)
      .eq('active', true)
      .single();

    if (!session) {
      const reason_code = 'INSUFFICIENT_CONSENT';
      await createReasonReceipt(supabase, user.id, null, action_key, reason_code, 'No active persona session');
      
      return new Response(
        JSON.stringify({
          decision: 'BLOCK',
          reason_code,
          explanation: REASON_CODES[reason_code],
          ui_hints: { show_persona_selector: true }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Evaluate action based on persona and consents
    const decision = await evaluateAction(supabase, user.id, session, action_key, context);
    
    // Create reason receipt
    await createReasonReceipt(
      supabase, 
      user.id, 
      session.persona_id, 
      action_key, 
      decision.reason_code, 
      decision.explanation,
      decision.hash
    );

    return new Response(
      JSON.stringify(decision),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Gate action error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function evaluateAction(supabase: any, userId: string, session: any, actionKey: string, context: any) {
  const persona = session.personas;
  
  // Get active consents for the user
  const { data: consents } = await supabase
    .from('consent_tokens')
    .select('*')
    .eq('subject_user', userId)
    .eq('status', 'active')
    .lte('valid_from', new Date().toISOString())
    .or(`valid_to.is.null,valid_to.gte.${new Date().toISOString()}`);

  // Basic persona-based rules
  const personaRules = {
    advisor: ['create_proposal', 'view_client_data', 'send_communications'],
    client: ['view_own_data', 'approve_actions', 'revoke_consent'],
    agent: ['negotiate_terms', 'sign_contracts', 'manage_portfolio'],
    guardian: ['approve_minor_actions', 'view_ward_data', 'sign_legal_docs'],
    coach: ['provide_guidance', 'track_performance', 'schedule_meetings'],
    sponsor: ['create_offers', 'transfer_funds', 'publish_content'],
    admin: ['*'] // Admin can do everything
  };

  const allowedActions = personaRules[persona.kind] || [];
  
  // Check if action is allowed for persona
  if (!allowedActions.includes('*') && !allowedActions.includes(actionKey)) {
    return {
      decision: 'BLOCK',
      reason_code: 'SCOPE_VIOLATION',
      explanation: `Action '${actionKey}' not permitted for persona '${persona.kind}'`,
      hash: generateHash({ userId, actionKey, persona: persona.kind, timestamp: Date.now() }),
      ui_hints: { required_persona: getRequiredPersona(actionKey) }
    };
  }

  // Check consent requirements for sensitive actions
  const sensitiveActions = ['publish_content', 'transfer_funds', 'sign_contracts', 'share_data'];
  
  if (sensitiveActions.includes(actionKey)) {
    if (!consents || consents.length === 0) {
      return {
        decision: 'BLOCK',
        reason_code: 'INSUFFICIENT_CONSENT',
        explanation: 'No valid consent found for sensitive action',
        hash: generateHash({ userId, actionKey, timestamp: Date.now() }),
        ui_hints: { required_consent: getRequiredConsentScopes(actionKey) }
      };
    }

    // Check for applicable consent
    const applicable = consents.find(consent => {
      const scopes = consent.scopes as any;
      return scopes.product && scopes.jurisdiction && 
             isActionCoveredByScope(actionKey, scopes);
    });

    if (!applicable) {
      return {
        decision: 'BLOCK',
        reason_code: 'SCOPE_VIOLATION',
        explanation: 'No consent covers the requested action scope',
        hash: generateHash({ userId, actionKey, timestamp: Date.now() }),
        ui_hints: { required_consent: getRequiredConsentScopes(actionKey) }
      };
    }
  }

  // Action allowed
  return {
    decision: 'ALLOW',
    reason_code: 'OK_POLICY',
    explanation: `Action permitted for ${persona.kind} persona`,
    hash: generateHash({ userId, actionKey, persona: persona.kind, timestamp: Date.now() }),
    ui_hints: {}
  };
}

async function createReasonReceipt(supabase: any, userId: string, personaId: string | null, actionKey: string, reasonCode: string, explanation: string, hash?: string) {
  const receiptHash = hash || generateHash({ userId, actionKey, reasonCode, timestamp: Date.now() });
  
  await supabase
    .from('reason_receipts')
    .insert({
      user_id: userId,
      persona_id: personaId,
      action_key: actionKey,
      reason_code: reasonCode,
      explanation,
      hash: receiptHash
    });
}

function generateHash(data: any): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return btoa(normalized).slice(0, 32); // Simplified hash for demo
}

function getRequiredPersona(actionKey: string): string {
  const actionPersonaMap: Record<string, string> = {
    'create_proposal': 'advisor',
    'sign_contracts': 'agent',
    'approve_minor_actions': 'guardian',
    'create_offers': 'sponsor',
    'provide_guidance': 'coach'
  };
  return actionPersonaMap[actionKey] || 'client';
}

function getRequiredConsentScopes(actionKey: string) {
  const scopeMap: Record<string, any> = {
    'publish_content': { product: 'content', media: 'social' },
    'transfer_funds': { product: 'financial', jurisdiction: 'US' },
    'sign_contracts': { product: 'legal', time: '1year' },
    'share_data': { product: 'personal_data', audience: 'partners' }
  };
  return scopeMap[actionKey] || {};
}

function isActionCoveredByScope(actionKey: string, scopes: any): boolean {
  const required = getRequiredConsentScopes(actionKey);
  
  for (const [key, value] of Object.entries(required)) {
    if (!scopes[key] || scopes[key] !== value) {
      return false;
    }
  }
  
  return true;
}