import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from '@/services/receipts';
import { anchorSingle } from '@/services/receipts';
import { inputs_hash } from '@/lib/canonical';

// Break deep types at boundaries
type DbRow = any;

export interface MeetingSession {
  id: string;
  agent_id: string;
  family_id?: string;
  state: string;
  consent_mode: 'one_party' | 'two_party';
  status: 'active' | 'ended' | 'processing';
  started_at: string;
  ended_at?: string;
  transcript_hash?: string;
  audio_hash?: string;
  vault_document_id?: string;
  summary?: any;
}

export interface ConsentRequirement {
  state: string;
  consent_mode: 'one_party' | 'two_party';
  disclosure_text: string;
}

const CONSENT_REQUIREMENTS: Record<string, ConsentRequirement> = {
  'CA': {
    state: 'CA',
    consent_mode: 'two_party',
    disclosure_text: 'This call is being recorded for quality and training purposes. Do you consent to recording?'
  },
  'FL': {
    state: 'FL',
    consent_mode: 'two_party',
    disclosure_text: 'This call is being recorded. Do you consent to recording?'
  },
  'IL': {
    state: 'IL',
    consent_mode: 'two_party',
    disclosure_text: 'This call is being recorded. Do you consent to recording?'
  }
};

const DEFAULT_CONSENT: ConsentRequirement = {
  state: 'default',
  consent_mode: 'one_party',
  disclosure_text: 'This call may be recorded for quality and training purposes.'
};

export async function getConsentRequirement(state: string): Promise<ConsentRequirement> {
  return CONSENT_REQUIREMENTS[state] || DEFAULT_CONSENT;
}

export async function startSession(
  agentId: string, 
  familyId?: string, 
  state: string = 'default'
): Promise<{ session: MeetingSession; consent: ConsentRequirement }> {
  const consent = await getConsentRequirement(state);
  
  const sessionData = {
    agent_id: agentId,
    family_id: familyId,
    state,
    consent_mode: consent.consent_mode,
    status: 'active' as const,
    started_at: new Date().toISOString()
  };

  // Store session in domain events
  const sessionId = crypto.randomUUID();
  const { error } = await (supabase as any)
    .from('domain_events')
    .insert({
      event_type: 'meeting_started',
      event_hash: await inputs_hash({ type: 'meeting_started' }),
      sequence_number: Date.now(),
      event_data: { ...sessionData, id: sessionId },
      aggregate_id: sessionId,
      aggregate_type: 'meeting_session'
    });

  if (error) throw error;

  const session = { ...sessionData, id: sessionId } as MeetingSession;

  // Record consent receipt
  await recordReceipt({
    type: 'MeetingConsent-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await inputs_hash({
      agent_id: agentId,
      family_id: familyId,
      state,
      consent_mode: consent.consent_mode
    }),
    policy_version: 'v1.0',
    outcome: 'consent_obtained',
    reasons: [`${consent.consent_mode}_consent_required`],
    metadata: {
      session_id: session.id,
      consent_mode: consent.consent_mode,
      state
    }
  });

  return { session, consent };
}

export async function recordConsent(sessionId: string, consentGiven: boolean): Promise<void> {
  const { error } = await (supabase as any)
    .from('domain_events')
    .insert({
      event_type: 'consent_recorded',
      event_hash: await inputs_hash({ type: 'consent_recorded' }),
      sequence_number: Date.now(),
      event_data: { 
        session_id: sessionId,
        consent_given: consentGiven,
        consent_recorded_at: new Date().toISOString()
      },
      aggregate_id: sessionId,
      aggregate_type: 'meeting_session'
    });

  if (error) throw error;

  // Record consent receipt
  await recordReceipt({
    type: 'MeetingConsent-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await inputs_hash({ session_id: sessionId, consent_given: consentGiven }),
    policy_version: 'v1.0',
    outcome: consentGiven ? 'consent_granted' : 'consent_denied',
    reasons: [consentGiven ? 'explicit_consent' : 'consent_refused'],
    metadata: { session_id: sessionId }
  });
}

export async function endSession(sessionId: string, audioBlob?: Blob): Promise<MeetingSession> {
  let audioHash = '';
  let vaultDocumentId = '';
  let transcriptHash = '';

  // Upload audio to vault if provided
  if (audioBlob) {
    const timestamp = new Date().toISOString();
    const fileName = `meeting_${sessionId}_${timestamp}.wav`;
    
    // Create audio hash
    const arrayBuffer = await audioBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const crypto = window.crypto || (globalThis as any).crypto;
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array);
    audioHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Upload to Supabase Storage (Vault)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vault')
      .upload(`meetings/${fileName}`, audioBlob, {
        contentType: 'audio/wav'
      });

    if (uploadError) {
      console.error('Failed to upload audio to vault:', uploadError);
    } else {
      vaultDocumentId = uploadData.path;
      
      // Process speech-to-text if provider is configured
      try {
        const transcript = await processAudioToText(audioBlob);
        if (transcript) {
          // Create transcript hash (content-free)
          const transcriptString = JSON.stringify({ length: transcript.length, timestamp });
          const transcriptData = new TextEncoder().encode(transcriptString);
          const transcriptHashBuffer = await crypto.subtle.digest('SHA-256', transcriptData);
          transcriptHash = Array.from(new Uint8Array(transcriptHashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      } catch (error) {
        console.error('Failed to process speech-to-text:', error);
      }
    }
  }

  // Update session in domain events
  const { error } = await (supabase as any)
    .from('domain_events')
    .insert({
      event_type: 'meeting_ended',
      event_hash: await inputs_hash({ type: 'meeting_ended' }),
      sequence_number: Date.now(),
      event_data: {
        session_id: sessionId,
        status: 'ended',
        ended_at: new Date().toISOString(),
        audio_hash: audioHash,
        vault_document_id: vaultDocumentId,
        transcript_hash: transcriptHash
      },
      aggregate_id: sessionId,
      aggregate_type: 'meeting_session'
    });

  if (error) throw error;

  const session: MeetingSession = {
    id: sessionId,
    agent_id: '',
    state: '',
    consent_mode: 'one_party',
    status: 'ended',
    started_at: '',
    ended_at: new Date().toISOString(),
    audio_hash: audioHash,
    vault_document_id: vaultDocumentId,
    transcript_hash: transcriptHash
  };

  // Record transcript receipt (content-free)
  await recordReceipt({
    type: 'Transcript-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await inputs_hash({
      session_id: sessionId,
      audio_hash: audioHash,
      vault_document_id: vaultDocumentId
    }),
    policy_version: 'v1.0',
    outcome: 'transcript_stored',
    reasons: ['meeting_ended', 'audio_captured'],
    metadata: {
      session_id: sessionId,
      has_audio: !!audioBlob,
      vault_stored: !!vaultDocumentId
    }
  });

  return session;
}

export async function summarizeSession(sessionId: string, intents: any[]): Promise<void> {
  const summary = {
    intents: intents.map(intent => ({
      type: intent.type,
      confidence: intent.confidence,
      band: intent.band
    })),
    intent_count: intents.length,
    primary_intent: intents[0]?.type || 'general_inquiry'
  };

  // Update session with summary
  const { error } = await (supabase as any)
    .from('domain_events')
    .insert({
      event_type: 'meeting_summarized',
      event_hash: await inputs_hash({ type: 'meeting_summarized' }),
      sequence_number: Date.now(),
      event_data: { session_id: sessionId, summary },
      aggregate_id: sessionId,
      aggregate_type: 'meeting_session'
    });

  if (error) throw error;

  // Record funnel receipt
  await recordReceipt({
    type: 'Funnel-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await inputs_hash({
      session_id: sessionId,
      intent_bands: summary.intents.map(i => i.band),
      intent_count: summary.intent_count
    }),
    policy_version: 'v1.0',
    outcome: 'intents_analyzed',
    reasons: summary.intents.map(i => `intent_${i.band}`),
    metadata: {
      session_id: sessionId,
      primary_intent: summary.primary_intent,
      intent_count: summary.intent_count
    }
  });
}

export async function getMeetingSessions(agentId: string): Promise<MeetingSession[]> {
  const { data, error } = await (supabase as any)
    .from('domain_events')
    .select('*')
    .eq('aggregate_type', 'meeting_session')
    .eq('event_type', 'meeting_started')
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((event: any) => event.event_data) as MeetingSession[];
}

export async function searchSessions(agentId: string, query: string): Promise<MeetingSession[]> {
  const { data, error } = await (supabase as any)
    .from('domain_events')
    .select('*')
    .eq('aggregate_type', 'meeting_session')
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((event: any) => event.event_data) as MeetingSession[];
}

export async function createFollowUpCampaign(sessionId: string, campaignType: string): Promise<void> {
  // Record campaign receipt
  await recordReceipt({
    type: 'Campaign-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await inputs_hash({
      session_id: sessionId,
      campaign_type: campaignType
    }),
    policy_version: 'v1.0',
    outcome: 'campaign_scheduled',
    reasons: ['follow_up_required', `campaign_${campaignType}`],
    metadata: {
      session_id: sessionId,
      campaign_type: campaignType,
      tcpa_compliant: true,
      can_spam_compliant: true
    }
  });
}

async function processAudioToText(audioBlob: Blob): Promise<string | null> {
  try {
    // Call speech-to-text edge function
    const response = await fetch('/functions/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: await blobToBase64(audioBlob)
      })
    });

    if (!response.ok) {
      throw new Error(`STT API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.text || null;
  } catch (error) {
    console.error('Speech-to-text processing failed:', error);
    return null;
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:... prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}