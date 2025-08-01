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

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    console.log('Zoom webhook payload:', JSON.stringify(payload, null, 2));

    // Verify webhook signature
    const signature = req.headers.get('x-zm-signature');
    if (!signature) {
      throw new Error('Missing signature header');
    }

    // Log webhook event
    await supabase.from('webhook_events').insert({
      webhook_type: 'meeting_recording',
      provider: 'zoom',
      event_type: payload.event,
      payload: payload,
      processed: false
    });

    // Handle recording completion
    if (payload.event === 'recording.completed') {
      await handleRecordingCompleted(supabase, payload);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});

async function handleRecordingCompleted(supabase: any, payload: any) {
  const meetingId = payload.object.id;
  const recording = payload.object;

  try {
    // Find the video meeting in our database
    const { data: videoMeeting, error: meetingError } = await supabase
      .from('video_meetings')
      .select('*')
      .eq('external_meeting_id', meetingId)
      .single();

    if (meetingError || !videoMeeting) {
      console.log('Meeting not found in database:', meetingId);
      return;
    }

    // Process each recording file
    for (const file of recording.recording_files) {
      if (file.file_type === 'MP4' || file.file_type === 'M4A') {
        await processRecordingFile(supabase, videoMeeting, file, recording);
      }
    }

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('payload->object->id', meetingId);

  } catch (error) {
    console.error('Error processing recording:', error);
    
    // Mark webhook as failed
    await supabase
      .from('webhook_events')
      .update({ 
        processed: false, 
        processing_error: error.message,
        processed_at: new Date().toISOString()
      })
      .eq('payload->object->id', meetingId);
  }
}

async function processRecordingFile(supabase: any, videoMeeting: any, file: any, recording: any) {
  try {
    // Download the recording file
    const response = await fetch(file.download_url);
    if (!response.ok) {
      throw new Error(`Failed to download recording: ${response.statusText}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Create file path in user's folder
    const fileName = `${recording.topic}_${file.recording_start}_${file.id}.${file.file_extension}`;
    const filePath = `${videoMeeting.user_id}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meeting-recordings')
      .upload(filePath, uint8Array, {
        contentType: file.file_type === 'MP4' ? 'video/mp4' : 'audio/mp4',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from('meeting-recordings')
      .getPublicUrl(filePath);

    // Create meeting recording record
    const recordingData = {
      meeting_id: videoMeeting.id,
      user_id: videoMeeting.user_id,
      client_id: videoMeeting.lead_id, // Assuming lead_id is the client
      recording_url: urlData.publicUrl,
      download_url: file.download_url,
      file_path: filePath,
      file_size: file.file_size,
      duration_seconds: Math.round(file.duration_in_seconds),
      recording_type: file.file_type === 'MP4' ? 'video' : 'audio',
      provider_recording_id: file.id,
      status: 'completed',
      metadata: {
        meeting_topic: recording.topic,
        meeting_start_time: recording.start_time,
        recording_start: file.recording_start,
        recording_end: file.recording_end,
        file_extension: file.file_extension,
        zoom_meeting_id: recording.id,
        zoom_meeting_uuid: recording.uuid
      }
    };

    const { error: insertError } = await supabase
      .from('meeting_recordings')
      .insert(recordingData);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log(`Successfully processed recording: ${fileName}`);

    // Send notification to user about new recording
    await sendRecordingNotification(supabase, videoMeeting, recordingData);

  } catch (error) {
    console.error('Error processing recording file:', error);
    throw error;
  }
}

async function sendRecordingNotification(supabase: any, videoMeeting: any, recordingData: any) {
  try {
    // Get user email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', videoMeeting.user_id)
      .single();

    if (!profile?.email) {
      console.log('No email found for user');
      return;
    }

    // Call email function to send notification
    await supabase.functions.invoke('send-recording-notification', {
      body: {
        to: profile.email,
        userName: profile.full_name || 'User',
        meetingTitle: videoMeeting.title,
        recordingUrl: recordingData.recording_url,
        meetingDate: videoMeeting.start_time
      }
    });

    console.log('Recording notification sent to:', profile.email);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}