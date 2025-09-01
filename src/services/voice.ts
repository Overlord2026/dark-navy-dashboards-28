// src/services/voice.ts
import { supabase } from '@/integrations/supabase/client';

// --- Transcription (Edge function: speech-to-text) ---------------------------
export async function transcribeAudio(audio: Blob): Promise<{ text: string }> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/speech-to-text`;

  // Use logged-in JWT if present (fine if missing and your function is public)
  const jwt = await supabase.auth
    .getSession()
    .then(r => r.data.session?.access_token)
    .catch(() => undefined);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
      // NOTE: no Content-Type; let the browser set multipart boundary if using FormData
    },
    body: (() => {
      const fd = new FormData();
      // Pick a filename + type the Edge function accepts (webm/ogg/mp4 are common)
      const file = new File([audio], 'recording.webm', { type: audio.type || 'audio/webm' });
      fd.append('audio', file);
      return fd;
    })()
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Transcription error (${res.status}): ${err}`);
  }
  return res.json(); // { text: "..." }
}

// --- Meeting summary (Edge function: generate-meeting-summary) ---------------
export async function summarizeMeeting(notes: string): Promise<any> {
  const { callEdgeJSON } = await import('@/services/aiEdge');
  return await callEdgeJSON('meeting-summary', { notes });
}

// --- Save meeting note to database ----------------------------------------
export interface SaveMeetingNoteParams {
  persona: string;
  context_ref?: string;
  transcript: string;
  summary?: any;
  saveToVault: boolean;
}

export async function saveMeetingNote(params: SaveMeetingNoteParams): Promise<void> {
  const { persona, context_ref, transcript, summary, saveToVault } = params;
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('meeting_notes' as any)
    .insert({
      user_id: user.id,
      persona,
      context_ref,
      transcript,
      summary,
      save_to_vault: saveToVault
    });

  if (error) {
    throw new Error(`Failed to save meeting note: ${error.message}`);
  }
}