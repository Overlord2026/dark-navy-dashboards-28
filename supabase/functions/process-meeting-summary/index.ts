import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { recording_id, user_id, client_id } = await req.json();
    console.log('Processing meeting summary for recording:', recording_id);

    if (!recording_id) {
      throw new Error('Recording ID is required');
    }

    // Get recording details
    const { data: recording, error: recordingError } = await supabase
      .from('meeting_recordings')
      .select('*')
      .eq('id', recording_id)
      .single();

    if (recordingError || !recording) {
      throw new Error(`Recording not found: ${recordingError?.message}`);
    }

    // Create initial summary record
    const { data: summaryRecord, error: summaryError } = await supabase
      .from('meeting_summaries')
      .insert({
        meeting_recording_id: recording_id,
        user_id: user_id || recording.user_id,
        client_id: client_id || recording.client_id,
        processing_status: 'processing'
      })
      .select()
      .single();

    if (summaryError) {
      throw new Error(`Failed to create summary record: ${summaryError.message}`);
    }

    console.log('Created summary record:', summaryRecord.id);

    // Download audio file from storage
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('meeting-recordings')
      .download(recording.file_path);

    if (downloadError) {
      throw new Error(`Failed to download recording: ${downloadError.message}`);
    }

    console.log('Downloaded audio file, size:', audioData.size);

    // Transcribe audio using OpenAI Whisper
    const transcription = await transcribeAudio(audioData);
    console.log('Transcription completed, length:', transcription.length);

    // Update summary with transcription
    await supabase
      .from('meeting_summaries')
      .update({
        transcription: transcription,
        transcription_completed_at: new Date().toISOString()
      })
      .eq('id', summaryRecord.id);

    // Generate AI summary and analysis
    const analysis = await generateMeetingAnalysis(transcription, recording);
    console.log('AI analysis completed');

    // Update summary with analysis
    const { error: updateError } = await supabase
      .from('meeting_summaries')
      .update({
        summary: analysis.summary,
        action_items: analysis.actionItems,
        key_decisions: analysis.keyDecisions,
        next_steps: analysis.nextSteps,
        participants: analysis.participants,
        confidence_score: analysis.confidenceScore,
        processing_status: 'completed',
        summary_completed_at: new Date().toISOString()
      })
      .eq('id', summaryRecord.id);

    if (updateError) {
      throw new Error(`Failed to update summary: ${updateError.message}`);
    }

    // Send follow-up email with summary
    await sendSummaryEmail(supabase, summaryRecord.id, recording, analysis);

    console.log('Meeting summary processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        summaryId: summaryRecord.id,
        transcriptionLength: transcription.length,
        summary: analysis.summary
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error processing meeting summary:', error);
    
    // Update summary record with error status if we have the ID
    try {
      const { recording_id } = await req.json();
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase
        .from('meeting_summaries')
        .update({
          processing_status: 'failed',
          error_message: error.message
        })
        .eq('meeting_recording_id', recording_id);
    } catch (updateError) {
      console.error('Failed to update summary with error:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.mp4');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'verbose_json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Transcription failed: ${error}`);
  }

  const result = await response.json();
  return result.text;
}

async function generateMeetingAnalysis(transcription: string, recording: any) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `
Please analyze the following meeting transcription and extract key information. Format your response as a JSON object with the following structure:

{
  "summary": "A concise 2-3 paragraph summary of the meeting",
  "actionItems": [
    {
      "item": "Action item description",
      "assignee": "Person responsible (if mentioned)",
      "dueDate": "Due date (if mentioned)",
      "priority": "high|medium|low"
    }
  ],
  "keyDecisions": [
    {
      "decision": "Decision made",
      "rationale": "Reasoning behind the decision",
      "impact": "Expected impact or consequences"
    }
  ],
  "nextSteps": [
    {
      "step": "Next step description",
      "timeline": "Timeline (if mentioned)",
      "owner": "Person responsible (if mentioned)"
    }
  ],
  "participants": [
    {
      "name": "Participant name (if mentioned)",
      "role": "Their role or title (if mentioned)"
    }
  ],
  "confidenceScore": 0.95
}

Meeting Title: ${recording.metadata?.meeting_title || recording.metadata?.meeting_topic || 'Meeting'}
Duration: ${recording.duration_seconds ? Math.round(recording.duration_seconds / 60) + ' minutes' : 'Unknown'}

Transcription:
${transcription}

Please provide a thorough analysis focusing on actionable items and key outcomes. If certain information is not available in the transcription, include empty arrays or indicate "Not specified" appropriately.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting analyst. Analyze meeting transcriptions and extract key information in a structured format. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI analysis failed: ${error}`);
  }

  const result = await response.json();
  
  try {
    return JSON.parse(result.choices[0].message.content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', result.choices[0].message.content);
    throw new Error('Failed to parse AI analysis response');
  }
}

async function sendSummaryEmail(supabase: any, summaryId: string, recording: any, analysis: any) {
  try {
    // Get user details
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', recording.user_id)
      .single();

    if (!profile?.email) {
      console.log('No email found for user, skipping email notification');
      return;
    }

    // Send summary email
    await supabase.functions.invoke('send-meeting-summary-email', {
      body: {
        to: profile.email,
        userName: profile.full_name || 'User',
        meetingTitle: recording.metadata?.meeting_title || recording.metadata?.meeting_topic || 'Meeting',
        summary: analysis.summary,
        actionItems: analysis.actionItems,
        keyDecisions: analysis.keyDecisions,
        nextSteps: analysis.nextSteps,
        meetingDate: recording.created_at
      }
    });

    console.log('Summary email sent to:', profile.email);
  } catch (error) {
    console.error('Error sending summary email:', error);
    // Don't throw - email failure shouldn't fail the entire process
  }
}