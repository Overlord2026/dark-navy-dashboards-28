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
    console.log('Google Meet webhook payload:', JSON.stringify(payload, null, 2));

    // Log webhook event
    await supabase.from('webhook_events').insert({
      webhook_type: 'meeting_recording',
      provider: 'google_meet',
      event_type: payload.eventType || 'recording.completed',
      payload: payload,
      processed: false
    });

    // Handle recording completion
    if (payload.eventType === 'recording.completed' || payload.recording) {
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
  const meetingId = payload.meetingId || payload.id;
  const recording = payload.recording || payload;

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

    // Get Google Meet integration for access token
    const { data: integration } = await supabase
      .from('video_meeting_integrations')
      .select('access_token')
      .eq('user_id', videoMeeting.user_id)
      .eq('provider', 'google_meet')
      .eq('is_active', true)
      .single();

    if (!integration) {
      throw new Error('No active Google Meet integration found');
    }

    await processGoogleRecording(supabase, videoMeeting, recording, integration.access_token);

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('payload->meetingId', meetingId);

  } catch (error) {
    console.error('Error processing Google recording:', error);
    
    // Mark webhook as failed
    await supabase
      .from('webhook_events')
      .update({ 
        processed: false, 
        processing_error: error.message,
        processed_at: new Date().toISOString()
      })
      .eq('payload->meetingId', meetingId);
  }
}

async function processGoogleRecording(supabase: any, videoMeeting: any, recording: any, accessToken: string) {
  try {
    // Google Meet recordings are typically stored in Google Drive
    const driveFileId = recording.driveFileId || recording.id;
    
    if (!driveFileId) {
      throw new Error('No Drive file ID found in recording data');
    }

    // Download recording from Google Drive
    const downloadResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!downloadResponse.ok) {
      throw new Error(`Failed to download recording: ${downloadResponse.statusText}`);
    }

    const blob = await downloadResponse.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Get file metadata from Google Drive
    const metadataResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=name,size,mimeType,createdTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const metadata = await metadataResponse.json();

    // Create file path in user's folder
    const fileName = `${videoMeeting.title}_${new Date().toISOString()}_${driveFileId}.mp4`;
    const filePath = `${videoMeeting.user_id}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meeting-recordings')
      .upload(filePath, uint8Array, {
        contentType: metadata.mimeType || 'video/mp4',
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
      client_id: videoMeeting.lead_id,
      recording_url: urlData.publicUrl,
      download_url: `https://drive.google.com/file/d/${driveFileId}/view`,
      file_path: filePath,
      file_size: parseInt(metadata.size) || null,
      recording_type: 'video',
      provider_recording_id: driveFileId,
      status: 'completed',
      metadata: {
        meeting_title: videoMeeting.title,
        meeting_start_time: videoMeeting.start_time,
        google_drive_file_id: driveFileId,
        google_file_name: metadata.name,
        created_time: metadata.createdTime,
        mime_type: metadata.mimeType
      }
    };

    const { error: insertError } = await supabase
      .from('meeting_recordings')
      .insert(recordingData);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log(`Successfully processed Google recording: ${fileName}`);

    // Send notification to user about new recording
    await sendRecordingNotification(supabase, videoMeeting, recordingData);

  } catch (error) {
    console.error('Error processing Google recording:', error);
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