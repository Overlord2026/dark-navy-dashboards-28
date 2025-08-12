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
    const { 
      consent_id, 
      event,
      persona_session_id 
    } = await req.json();
    
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

    // Validate the consent token
    const { data: consent, error: consentError } = await supabase
      .from('consent_tokens')
      .select('*')
      .eq('id', consent_id)
      .eq('status', 'active')
      .single();

    if (consentError || !consent) {
      throw new Error('Invalid or inactive consent token');
    }

    // Verify user has permission to attest under this consent
    if (consent.subject_user !== user.id && consent.issuer_user !== user.id) {
      throw new Error('User not authorized for this consent');
    }

    // Validate consent covers the XR event
    const scopes = consent.scopes as any;
    const validationResult = validateXREvent(event, scopes);
    
    if (!validationResult.valid) {
      // Create blocking receipt
      const { data: blockingReceipt } = await supabase
        .from('reason_receipts')
        .insert({
          user_id: user.id,
          persona_id: persona_session_id,
          action_key: 'XR_ATTESTATION',
          reason_code: 'SCOPE_VIOLATION',
          explanation: validationResult.reason,
          hash: generateEventHash(event, 'BLOCKED')
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({
          decision: 'BLOCKED',
          reason: validationResult.reason,
          receipt_id: blockingReceipt?.id
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create XR attestation
    const { data: attestation, error: attestationError } = await supabase
      .from('xr_attestations')
      .insert({
        consent_id,
        event: enrichEvent(event, user.id)
      })
      .select()
      .single();

    if (attestationError) {
      throw attestationError;
    }

    // Create success receipt
    const { data: receipt } = await supabase
      .from('reason_receipts')
      .insert({
        user_id: user.id,
        persona_id: persona_session_id,
        action_key: 'XR_ATTESTATION',
        reason_code: 'OK_POLICY',
        explanation: `XR event attested: ${event.event_type} at ${event.venue}`,
        hash: generateEventHash(event, 'ALLOWED')
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        attestation_id: attestation.id,
        receipt_id: receipt?.id,
        decision: 'ALLOWED',
        event_hash: generateEventHash(event, 'ALLOWED'),
        timestamp: attestation.created_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('XR attest error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function validateXREvent(event: any, scopes: any) {
  // Required fields for XR events
  const requiredFields = ['event_type', 'venue', 'timestamp', 'device_id'];
  
  for (const field of requiredFields) {
    if (!event[field]) {
      return {
        valid: false,
        reason: `Missing required field: ${field}`
      };
    }
  }

  // Check if event type is covered by consent
  const allowedEventTypes = scopes.xr_events || ['presence', 'interaction', 'performance'];
  
  if (!allowedEventTypes.includes(event.event_type)) {
    return {
      valid: false,
      reason: `Event type '${event.event_type}' not permitted by consent`
    };
  }

  // Check venue restrictions
  if (scopes.venue_restrictions && scopes.venue_restrictions.length > 0) {
    if (!scopes.venue_restrictions.includes(event.venue)) {
      return {
        valid: false,
        reason: `Venue '${event.venue}' not permitted by consent`
      };
    }
  }

  // Check time restrictions
  if (scopes.time_restrictions) {
    const eventTime = new Date(event.timestamp);
    const now = new Date();
    
    if (scopes.time_restrictions.start_time) {
      const startTime = new Date(scopes.time_restrictions.start_time);
      if (eventTime < startTime) {
        return {
          valid: false,
          reason: 'Event timestamp before allowed start time'
        };
      }
    }
    
    if (scopes.time_restrictions.end_time) {
      const endTime = new Date(scopes.time_restrictions.end_time);
      if (eventTime > endTime) {
        return {
          valid: false,
          reason: 'Event timestamp after allowed end time'
        };
      }
    }
  }

  return { valid: true };
}

function enrichEvent(event: any, userId: string) {
  return {
    ...event,
    attested_by: userId,
    attestation_timestamp: new Date().toISOString(),
    device_fingerprint: generateDeviceFingerprint(event.device_id),
    integrity_hash: generateEventHash(event, 'ENRICHED')
  };
}

function generateDeviceFingerprint(deviceId: string): string {
  // Simple device fingerprinting - in production would be more sophisticated
  const data = {
    device_id: deviceId,
    timestamp: Math.floor(Date.now() / 3600000) * 3600000 // Round to hour
  };
  
  return btoa(JSON.stringify(data)).slice(0, 16);
}

function generateEventHash(event: any, status: string): string {
  const data = {
    event_type: event.event_type,
    venue: event.venue,
    timestamp: event.timestamp,
    device_id: event.device_id,
    status,
    // Round to minute for consistent hashing
    hash_timestamp: Math.floor(Date.now() / 60000) * 60000
  };
  
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return btoa(normalized).slice(0, 32);
}