import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotarySessionRequest {
  requestId: string;
  sessionType: 'notary' | 'witness';
  scheduledAt?: string;
}

interface WitnessInviteRequest {
  requestId: string;
  witnesses: Array<{
    fullName: string;
    email: string;
    phone?: string;
  }>;
}

interface AttachRecordingRequest {
  sessionId: string;
  recordingUrl: string;
  notes?: string;
}

interface StateFileRequest {
  requestId: string;
  filingType: 'deed_recording' | 'trust_registration' | 'poa_registration' | 'other';
  method: 'api' | 'efile' | 'mail' | 'in_person';
  stateCode: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function logAudit(requestId: string, userId: string, actorRole: string, action: string, details: any = {}) {
  const { error } = await supabase
    .from('estate_audit_log')
    .insert({
      request_id: requestId,
      user_id: userId,
      actor_role: actorRole,
      action,
      details,
      ip: null
    });
  
  if (error) {
    console.error('Audit log error:', error);
  }
}

async function createNotarySession(req: Request) {
  const { requestId, sessionType, scheduledAt }: NotarySessionRequest = await req.json();
  
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verify user has access to this request
  const { data: request, error: requestError } = await supabase
    .from('estate_requests')
    .select('*')
    .eq('id', requestId)
    .or(`user_id.eq.${user.id},advisor_id.eq.${user.id},attorney_id.eq.${user.id}`)
    .single();

  if (requestError || !request) {
    return new Response(JSON.stringify({ error: 'Request not found or access denied' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const notaryProvider = Deno.env.get('NOTARY_PROVIDER') || 'docusign-notary';
  const videoProvider = Deno.env.get('VIDEO_PROVIDER') || 'twilio';
  
  // Create session record
  const { data: session, error: sessionError } = await supabase
    .from('estate_sessions')
    .insert({
      request_id: requestId,
      session_type: sessionType,
      provider: sessionType === 'notary' ? notaryProvider : videoProvider,
      provider_session_id: `mock_session_${Date.now()}`,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null
    })
    .select()
    .single();

  if (sessionError) {
    return new Response(JSON.stringify({ error: 'Failed to create session' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create notary record if it's a notary session
  if (sessionType === 'notary') {
    const { error: notaryError } = await supabase
      .from('estate_notaries')
      .insert({
        request_id: requestId,
        provider: notaryProvider,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null
      });

    if (notaryError) {
      console.error('Failed to create notary record:', notaryError);
    }
  }

  await logAudit(requestId, user.id, 'client', `${sessionType}_session_created`, { sessionId: session.id });

  // Mock join URL based on provider
  const joinUrl = sessionType === 'notary' 
    ? `https://mock-notary.example.com/session/${session.provider_session_id}`
    : `https://mock-video.example.com/session/${session.provider_session_id}`;

  return new Response(JSON.stringify({
    sessionId: session.id,
    joinUrl,
    provider: session.provider,
    scheduledAt: session.scheduled_at
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function inviteWitness(req: Request) {
  const { requestId, witnesses }: WitnessInviteRequest = await req.json();
  
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verify user has access to this request
  const { data: request, error: requestError } = await supabase
    .from('estate_requests')
    .select('*')
    .eq('id', requestId)
    .or(`user_id.eq.${user.id},advisor_id.eq.${user.id},attorney_id.eq.${user.id}`)
    .single();

  if (requestError || !request) {
    return new Response(JSON.stringify({ error: 'Request not found or access denied' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const witnessRecords = [];
  
  for (const witness of witnesses) {
    const { data: witnessRecord, error: witnessError } = await supabase
      .from('estate_witnesses')
      .insert({
        request_id: requestId,
        full_name: witness.fullName,
        email: witness.email,
        phone: witness.phone,
        invited_at: new Date().toISOString()
      })
      .select()
      .single();

    if (witnessError) {
      console.error('Failed to create witness record:', witnessError);
      continue;
    }

    witnessRecords.push(witnessRecord);

    // Mock sending invitation email (would use Resend in production)
    console.log(`Mock: Sending witness invitation to ${witness.email} for request ${requestId}`);
  }

  await logAudit(requestId, user.id, 'client', 'witnesses_invited', { witnessCount: witnesses.length });

  return new Response(JSON.stringify({
    witnesses: witnessRecords,
    invitationsSent: witnessRecords.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function attachRecording(req: Request) {
  const { sessionId, recordingUrl, notes }: AttachRecordingRequest = await req.json();
  
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { data: session, error: sessionError } = await supabase
    .from('estate_sessions')
    .update({
      recording_url: recordingUrl,
      notes,
      ended_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (sessionError) {
    return new Response(JSON.stringify({ error: 'Failed to update session' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  await logAudit(session.request_id, user.id, 'system', 'recording_attached', { sessionId, recordingUrl });

  return new Response(JSON.stringify({
    sessionId,
    recordingUrl,
    status: 'completed'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function stateFile(req: Request) {
  const { requestId, filingType, method, stateCode }: StateFileRequest = await req.json();
  
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verify user has access to this request
  const { data: request, error: requestError } = await supabase
    .from('estate_requests')
    .select('*')
    .eq('id', requestId)
    .or(`user_id.eq.${user.id},advisor_id.eq.${user.id},attorney_id.eq.${user.id}`)
    .single();

  if (requestError || !request) {
    return new Response(JSON.stringify({ error: 'Request not found or access denied' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { data: filing, error: filingError } = await supabase
    .from('estate_filings')
    .insert({
      request_id: requestId,
      state_code: stateCode,
      filing_type: filingType,
      method,
      submitted_at: new Date().toISOString(),
      status: 'pending',
      receipt_url: `https://mock-filing.example.com/receipt/${Date.now()}`
    })
    .select()
    .single();

  if (filingError) {
    return new Response(JSON.stringify({ error: 'Failed to create filing' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Mock filing result (would integrate with real state APIs)
  setTimeout(async () => {
    const mockResult = Math.random() > 0.2 ? 'accepted' : 'rejected';
    await supabase
      .from('estate_filings')
      .update({
        status: mockResult,
        rejection_reason: mockResult === 'rejected' ? 'Document format not compliant' : null
      })
      .eq('id', filing.id);
  }, 5000);

  await logAudit(requestId, user.id, 'system', 'filing_submitted', { filingId: filing.id, filingType, method });

  return new Response(JSON.stringify({
    filingId: filing.id,
    status: 'submitted',
    receiptUrl: filing.receipt_url,
    estimatedProcessingTime: '2-5 business days'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'create-notary-session':
        return await createNotarySession(req);
      case 'invite-witness':
        return await inviteWitness(req);
      case 'attach-recording':
        return await attachRecording(req);
      case 'state-file':
        return await stateFile(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Estate notary function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);