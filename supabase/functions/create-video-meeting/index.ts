import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateMeetingRequest {
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  provider: 'zoom' | 'google_meet' | 'teams';
  description?: string;
  leadId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { userMessage: 'Authentication required' } 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestData: CreateMeetingRequest = await req.json();
    console.log('Creating video meeting:', requestData);

    // Get the user's integration for the specified provider
    const { data: integration, error: integrationError } = await supabaseClient
      .from('video_meeting_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', requestData.provider)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.error('Integration not found:', integrationError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { userMessage: `${requestData.provider} integration not found or inactive` } 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let meetingResponse;
    let joinUrl = '';
    let externalMeetingId = '';
    let phoneDialIn = '';
    let passcode = '';

    // Create meeting based on provider
    switch (requestData.provider) {
      case 'zoom':
        meetingResponse = await createZoomMeeting(integration.access_token, requestData);
        if (meetingResponse.success) {
          joinUrl = meetingResponse.data.join_url;
          externalMeetingId = meetingResponse.data.id.toString();
          phoneDialIn = meetingResponse.data.settings?.dial_in_number || '';
          passcode = meetingResponse.data.password || '';
        }
        break;

      case 'google_meet':
        meetingResponse = await createGoogleMeetMeeting(integration.access_token, requestData);
        if (meetingResponse.success) {
          joinUrl = meetingResponse.data.hangoutLink;
          externalMeetingId = meetingResponse.data.id;
        }
        break;

      case 'teams':
        meetingResponse = await createTeamsMeeting(integration.access_token, requestData);
        if (meetingResponse.success) {
          joinUrl = meetingResponse.data.joinWebUrl;
          externalMeetingId = meetingResponse.data.id;
          phoneDialIn = meetingResponse.data.audioConferencing?.tollNumber || '';
        }
        break;

      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { userMessage: 'Unsupported provider' } 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    if (!meetingResponse.success) {
      console.error('Failed to create meeting:', meetingResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { userMessage: 'Failed to create meeting with provider' } 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store meeting in database
    const { data: videoMeeting, error: meetingError } = await supabaseClient
      .from('video_meetings')
      .insert({
        user_id: user.id,
        integration_id: integration.id,
        external_meeting_id: externalMeetingId,
        title: requestData.title,
        description: requestData.description,
        start_time: requestData.startTime,
        end_time: requestData.endTime,
        join_url: joinUrl,
        phone_dial_in: phoneDialIn,
        passcode: passcode,
        attendees: requestData.attendees,
        lead_id: requestData.leadId
      })
      .select()
      .single();

    if (meetingError) {
      console.error('Error storing meeting:', meetingError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { userMessage: 'Failed to store meeting details' } 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Meeting created successfully:', videoMeeting.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          meeting: videoMeeting,
          joinUrl,
          externalMeetingId 
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-video-meeting function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: { userMessage: 'Internal server error' } 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createZoomMeeting(accessToken: string, meetingData: CreateMeetingRequest) {
  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: meetingData.title,
        type: 2, // Scheduled meeting
        start_time: meetingData.startTime,
        duration: Math.ceil((new Date(meetingData.endTime).getTime() - new Date(meetingData.startTime).getTime()) / (1000 * 60)),
        agenda: meetingData.description,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          auto_recording: 'none'
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Zoom API error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    return { success: false, error };
  }
}

async function createGoogleMeetMeeting(accessToken: string, meetingData: CreateMeetingRequest) {
  try {
    // Create calendar event with Google Meet
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: meetingData.title,
        description: meetingData.description,
        start: {
          dateTime: meetingData.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: meetingData.endTime,
          timeZone: 'UTC',
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        attendees: meetingData.attendees.map(email => ({ email })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Calendar API error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating Google Meet meeting:', error);
    return { success: false, error };
  }
}

async function createTeamsMeeting(accessToken: string, meetingData: CreateMeetingRequest) {
  try {
    // Create Teams meeting via Graph API
    const response = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDateTime: meetingData.startTime,
        endDateTime: meetingData.endTime,
        subject: meetingData.title,
        participants: {
          attendees: meetingData.attendees.map(email => ({
            identity: {
              user: {
                displayName: email,
                id: email
              }
            }
          }))
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Teams API error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating Teams meeting:', error);
    return { success: false, error };
  }
}