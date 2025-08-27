import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STTRequest {
  audio: string; // base64 encoded audio
  provider?: 'assemblyai' | 'gcp' | 'openai';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, provider = 'openai' }: STTRequest = await req.json();
    
    if (!audio) {
      throw new Error('Audio data is required');
    }

    let result: string;
    
    switch (provider) {
      case 'openai':
        result = await processWithOpenAI(audio);
        break;
      case 'assemblyai':
        result = await processWithAssemblyAI(audio);
        break;
      case 'gcp':
        result = await processWithGCP(audio);
        break;
      default:
        throw new Error(`Unsupported STT provider: ${provider}`);
    }

    return new Response(JSON.stringify({ text: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in speech-to-text function:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to process speech-to-text'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

async function processWithOpenAI(audio: string): Promise<string> {
  const apiKey = Deno.env.get('STT_API_KEY') || Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Convert base64 to blob
  const binaryString = atob(audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const formData = new FormData();
  const blob = new Blob([bytes], { type: 'audio/wav' });
  formData.append('file', blob, 'audio.wav');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const result = await response.json();
  return result.text || '';
}

async function processWithAssemblyAI(audio: string): Promise<string> {
  const apiKey = Deno.env.get('STT_API_KEY');
  if (!apiKey) {
    throw new Error('AssemblyAI API key not configured');
  }

  // First, upload audio
  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'content-type': 'application/octet-stream',
    },
    body: Uint8Array.from(atob(audio), c => c.charCodeAt(0)),
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload audio to AssemblyAI');
  }

  const { upload_url } = await uploadResponse.json();

  // Then, transcribe
  const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ audio_url: upload_url }),
  });

  if (!transcriptResponse.ok) {
    throw new Error('Failed to start AssemblyAI transcription');
  }

  const { id } = await transcriptResponse.json();

  // Poll for completion
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max
  
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { 'authorization': apiKey },
    });

    const status = await statusResponse.json();
    
    if (status.status === 'completed') {
      return status.text || '';
    } else if (status.status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${status.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    attempts++;
  }

  throw new Error('AssemblyAI transcription timed out');
}

async function processWithGCP(audio: string): Promise<string> {
  const apiKey = Deno.env.get('STT_API_KEY');
  if (!apiKey) {
    throw new Error('Google Cloud API key not configured');
  }

  const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      audio: {
        content: audio,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Cloud STT error: ${error}`);
  }

  const result = await response.json();
  return result.results?.[0]?.alternatives?.[0]?.transcript || '';
}

serve(handler);