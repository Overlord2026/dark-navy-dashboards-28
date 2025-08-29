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
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-meeting-summary`;

  const jwt = await supabase.auth
    .getSession()
    .then(r => r.data.session?.access_token)
    .catch(() => undefined);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
    },
    body: JSON.stringify({ notes })
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Summary error (${res.status}): ${err}`);
  }
  return res.json();
}