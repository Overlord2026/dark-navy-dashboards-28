import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotaryRequest {
  document_class: string;
  signer_state: string;
  co_signer_states?: string[];
  requires_witnesses?: boolean;
  preferred_window?: string;
  entity_id: string;
  document_hash: string;
}

interface StatePolicy {
  state_code: string;
  allows_ron: boolean;
  allows_ipen: boolean;
  witness_rules: any;
  doc_overrides: any;
  updated_at: string;
}

interface RoutingDecision {
  routing_method: 'ron' | 'ipen' | 'in_person_required' | 'cross_state_ron';
  selected_vendor: 'docusign' | 'notarycam' | null;
  notary_state?: string;
  reasoning: string;
  policy_constraints: any;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: NotaryRequest = await req.json();
    console.log('Notary orchestration request:', request);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Step 1: Query state policies
    const decision = await analyzeNotaryRouting(supabase, request);
    
    // Step 2: Route based on decision
    const result = await executeNotaryRouting(supabase, request, decision);

    // Step 3: Create evidence package for the decision
    await createDecisionEvidence(supabase, request, decision, result);

    return new Response(JSON.stringify({
      session_id: result.session_id,
      vendor: result.vendor,
      status_url: result.status_url,
      routing_method: decision.routing_method,
      evidence_hash: result.evidence_hash
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Notary orchestration error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function analyzeNotaryRouting(supabase: any, request: NotaryRequest): Promise<RoutingDecision> {
  // Get primary signer state policy
  const { data: primaryPolicy, error: policyError } = await supabase
    .from('ron_policies')
    .select('*')
    .eq('state_code', request.signer_state)
    .single();

  if (policyError) {
    throw new Error(`Unable to retrieve policy for state ${request.signer_state}: ${policyError.message}`);
  }

  // Check document class overrides
  const docOverride = primaryPolicy.doc_overrides?.[request.document_class];
  const allowsRon = docOverride?.allows_ron ?? primaryPolicy.allows_ron;
  const allowsIpen = docOverride?.allows_ipen ?? primaryPolicy.allows_ipen;

  // Step 1: Check if primary state allows RON
  if (allowsRon) {
    return {
      routing_method: 'ron',
      selected_vendor: selectPreferredVendor('ron'),
      reasoning: `Primary state ${request.signer_state} allows RON for document class ${request.document_class}`,
      policy_constraints: {
        witness_requirements: primaryPolicy.witness_rules,
        document_overrides: docOverride
      },
      timestamp: new Date().toISOString()
    };
  }

  // Step 2: Check cross-state RON eligibility
  if (!allowsRon && request.document_class) {
    const crossStateResult = await checkCrossStateRon(supabase, request);
    if (crossStateResult.eligible) {
      return {
        routing_method: 'cross_state_ron',
        selected_vendor: selectPreferredVendor('ron'),
        notary_state: crossStateResult.notary_state,
        reasoning: `Cross-state RON available using notary from ${crossStateResult.notary_state}`,
        policy_constraints: {
          cross_state_rules: crossStateResult.rules,
          witness_requirements: primaryPolicy.witness_rules
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Step 3: Check IPEN availability
  if (allowsIpen) {
    return {
      routing_method: 'ipen',
      selected_vendor: selectPreferredVendor('ipen'),
      reasoning: `Primary state ${request.signer_state} allows IPEN for document class ${request.document_class}`,
      policy_constraints: {
        witness_requirements: primaryPolicy.witness_rules,
        ipen_requirements: docOverride?.ipen_requirements
      },
      timestamp: new Date().toISOString()
    };
  }

  // Step 4: In-person required
  return {
    routing_method: 'in_person_required',
    selected_vendor: null,
    reasoning: `State ${request.signer_state} requires in-person notarization for document class ${request.document_class}`,
    policy_constraints: {
      witness_requirements: primaryPolicy.witness_rules,
      in_person_requirements: docOverride?.in_person_requirements
    },
    timestamp: new Date().toISOString()
  };
}

async function checkCrossStateRon(supabase: any, request: NotaryRequest): Promise<{
  eligible: boolean;
  notary_state?: string;
  rules?: any;
}> {
  // Query for states that allow RON for this document class
  const { data: ronStates, error } = await supabase
    .from('ron_policies')
    .select('*')
    .eq('allows_ron', true);

  if (error) {
    console.error('Error querying RON states:', error);
    return { eligible: false };
  }

  // Find a suitable RON state (prioritize by proximity, volume, etc.)
  for (const state of ronStates) {
    const docOverride = state.doc_overrides?.[request.document_class];
    const allowsCrossState = docOverride?.allows_cross_state_ron ?? state.allows_cross_state_ron;
    
    if (allowsCrossState) {
      return {
        eligible: true,
        notary_state: state.state_code,
        rules: {
          cross_state_allowed: true,
          document_restrictions: docOverride?.cross_state_restrictions,
          witness_rules: state.witness_rules
        }
      };
    }
  }

  return { eligible: false };
}

function selectPreferredVendor(method: 'ron' | 'ipen'): 'docusign' | 'notarycam' {
  // Default vendor selection logic
  if (method === 'ron') {
    return 'docusign'; // DocuSign Notary preferred for RON
  }
  return 'notarycam'; // NotaryCam for IPEN
}

async function executeNotaryRouting(supabase: any, request: NotaryRequest, decision: RoutingDecision) {
  if (decision.routing_method === 'in_person_required') {
    throw new Error(`In-person notarization required. ${decision.reasoning}`);
  }

  const sessionId = crypto.randomUUID();
  
  // Create session record
  const { data: session, error: sessionError } = await supabase
    .from('notary_sessions')
    .insert({
      session_id: sessionId,
      entity_id: request.entity_id,
      document_class: request.document_class,
      signer_state: request.signer_state,
      co_signer_states: request.co_signer_states || [],
      routing_method: decision.routing_method,
      vendor: decision.selected_vendor,
      notary_state: decision.notary_state || request.signer_state,
      status: 'initializing',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (sessionError) {
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  // Initialize with selected vendor
  const vendorResult = await initializeVendorSession(
    decision.selected_vendor!,
    session,
    decision,
    request
  );

  // Update session with vendor details
  await supabase
    .from('notary_sessions')
    .update({
      vendor_session_id: vendorResult.vendor_session_id,
      status_url: vendorResult.status_url,
      status: 'active'
    })
    .eq('session_id', sessionId);

  return {
    session_id: sessionId,
    vendor: decision.selected_vendor,
    status_url: vendorResult.status_url,
    evidence_hash: vendorResult.evidence_hash
  };
}

async function initializeVendorSession(
  vendor: string,
  session: any,
  decision: RoutingDecision,
  request: NotaryRequest
) {
  switch (vendor) {
    case 'docusign':
      return await initializeDocuSignNotary(session, decision, request);
    case 'notarycam':
      return await initializeNotaryCam(session, decision, request);
    default:
      throw new Error(`Unsupported vendor: ${vendor}`);
  }
}

async function initializeDocuSignNotary(session: any, decision: RoutingDecision, request: NotaryRequest) {
  const docusignApiKey = Deno.env.get('DOCUSIGN_API_KEY');
  const docusignAccountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');
  
  const vendorSessionId = `ds_${session.session_id}`;
  
  if (docusignApiKey && docusignAccountId) {
    // Real DocuSign Notary API integration
    console.log('Creating DocuSign Notary envelope');
    
    const envelopeData = {
      documents: [{
        documentId: "1",
        name: `${request.document_class}_document`,
        documentBase64: request.document_hash // Would be actual document
      }],
      recipients: {
        signers: [{
          email: "signer@example.com", // Would come from request
          name: "Document Signer",
          recipientId: "1",
          routingOrder: "1",
          deliveryMethod: "email"
        }]
      },
      status: "sent",
      notaryHost: {
        name: "Remote Notary",
        email: "notary@docusign.com"
      }
    };

    // This would be actual DocuSign API call
    const envelope = await createDocuSignEnvelope(docusignApiKey, docusignAccountId, envelopeData);
    
    return {
      vendor_session_id: envelope.envelopeId,
      status_url: envelope.uri,
      evidence_hash: await hashObject(envelope)
    };
  } else {
    // Mock for development
    console.log('Creating mock DocuSign Notary envelope');
    return {
      vendor_session_id: vendorSessionId,
      status_url: `https://demo.docusign.net/notary/${vendorSessionId}`,
      evidence_hash: await hashObject({ mockEnvelope: vendorSessionId, timestamp: Date.now() })
    };
  }
}

async function initializeNotaryCam(session: any, decision: RoutingDecision, request: NotaryRequest) {
  const notaryCamApiKey = Deno.env.get('NOTARYCAM_API_KEY');
  const vendorSessionId = `nc_${session.session_id}`;
  
  if (notaryCamApiKey) {
    // Real NotaryCam API integration
    console.log('Creating NotaryCam session');
    
    const sessionData = {
      documentClass: request.document_class,
      signerState: request.signer_state,
      requiresWitnesses: request.requires_witnesses || false,
      preferredWindow: request.preferred_window,
      documents: [request.document_hash]
    };

    // This would be actual NotaryCam API call
    const sessionResult = await createNotaryCamSession(notaryCamApiKey, sessionData);
    
    return {
      vendor_session_id: sessionResult.sessionId,
      status_url: sessionResult.sessionUrl,
      evidence_hash: await hashObject(sessionResult)
    };
  } else {
    // Mock for development
    console.log('Creating mock NotaryCam session');
    return {
      vendor_session_id: vendorSessionId,
      status_url: `https://app.notarycam.com/session/${vendorSessionId}`,
      evidence_hash: await hashObject({ mockSession: vendorSessionId, timestamp: Date.now() })
    };
  }
}

async function createDecisionEvidence(
  supabase: any,
  request: NotaryRequest,
  decision: RoutingDecision,
  result: any
) {
  const evidenceData = {
    notary_orchestration: {
      request,
      decision,
      result: {
        session_id: result.session_id,
        vendor: result.vendor,
        routing_method: decision.routing_method
      },
      timestamp: new Date().toISOString()
    }
  };

  const evidenceHash = await hashObject(evidenceData);

  await supabase
    .from('evidence_packages')
    .insert({
      evidence_id: crypto.randomUUID(),
      source_id: result.session_id,
      vendor: 'orchestrator',
      institution: 'notary_routing',
      sha256: evidenceHash,
      captured_at: new Date().toISOString(),
      metadata: evidenceData
    });

  return evidenceHash;
}

// Utility functions
async function hashObject(obj: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(obj));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createDocuSignEnvelope(apiKey: string, accountId: string, envelopeData: any) {
  // Mock implementation - would be actual DocuSign API call
  return {
    envelopeId: `env_${Date.now()}`,
    uri: `https://demo.docusign.net/signing/${Date.now()}`,
    status: 'sent',
    statusDateTime: new Date().toISOString()
  };
}

async function createNotaryCamSession(apiKey: string, sessionData: any) {
  // Mock implementation - would be actual NotaryCam API call
  return {
    sessionId: `session_${Date.now()}`,
    sessionUrl: `https://app.notarycam.com/join/${Date.now()}`,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
}