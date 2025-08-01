import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    console.log('Syncing video meetings for user:', user.id);

    // Get all active integrations for the user
    const { data: integrations, error: integrationsError } = await supabaseClient
      .from('video_meeting_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (integrationsError) {
      console.error('Error fetching integrations:', integrationsError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { userMessage: 'Failed to fetch integrations' } 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!integrations || integrations.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { message: 'No active integrations found' } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const syncResults = [];

    // Sync meetings for each integration
    for (const integration of integrations) {
      console.log(`Syncing ${integration.provider} meetings`);
      
      try {
        let meetings;
        
        switch (integration.provider) {
          case 'zoom':
            meetings = await syncZoomMeetings(integration.access_token);
            break;
          case 'google_meet':
            meetings = await syncGoogleMeetMeetings(integration.access_token);
            break;
          case 'teams':
            meetings = await syncTeamsMeetings(integration.access_token);
            break;
          default:
            console.log(`Unsupported provider: ${integration.provider}`);
            continue;
        }

        if (meetings.success && meetings.data) {
          // Store/update meetings in database
          for (const meeting of meetings.data) {
            await upsertMeeting(supabaseClient, user.id, integration.id, meeting);
          }
          
          syncResults.push({
            provider: integration.provider,
            success: true,
            count: meetings.data.length
          });
        } else {
          syncResults.push({
            provider: integration.provider,
            success: false,
            error: meetings.error
          });
        }
      } catch (error) {
        console.error(`Error syncing ${integration.provider}:`, error);
        syncResults.push({
          provider: integration.provider,
          success: false,
          error: error.message
        });
      }
    }

    console.log('Sync completed:', syncResults);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { syncResults } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in sync-video-meetings function:', error);
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

async function syncZoomMeetings(accessToken: string) {
  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings?type=scheduled', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Zoom API error:', data);
      return { success: false, error: data };
    }

    const meetings = data.meetings?.map((meeting: any) => ({
      external_meeting_id: meeting.id.toString(),
      title: meeting.topic,
      start_time: meeting.start_time,
      duration: meeting.duration,
      join_url: meeting.join_url,
      password: meeting.password,
      provider: 'zoom'
    })) || [];

    return { success: true, data: meetings };
  } catch (error) {
    console.error('Error syncing Zoom meetings:', error);
    return { success: false, error };
  }
}

async function syncGoogleMeetMeetings(accessToken: string) {
  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Next 30 days

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Calendar API error:', data);
      return { success: false, error: data };
    }

    const meetings = data.items?.filter((event: any) => event.hangoutLink).map((event: any) => ({
      external_meeting_id: event.id,
      title: event.summary,
      start_time: event.start.dateTime,
      end_time: event.end.dateTime,
      join_url: event.hangoutLink,
      provider: 'google_meet'
    })) || [];

    return { success: true, data: meetings };
  } catch (error) {
    console.error('Error syncing Google Meet meetings:', error);
    return { success: false, error };
  }
}

async function syncTeamsMeetings(accessToken: string) {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Teams API error:', data);
      return { success: false, error: data };
    }

    const meetings = data.value?.map((meeting: any) => ({
      external_meeting_id: meeting.id,
      title: meeting.subject,
      start_time: meeting.startDateTime,
      end_time: meeting.endDateTime,
      join_url: meeting.joinWebUrl,
      phone_dial_in: meeting.audioConferencing?.tollNumber,
      provider: 'teams'
    })) || [];

    return { success: true, data: meetings };
  } catch (error) {
    console.error('Error syncing Teams meetings:', error);
    return { success: false, error };
  }
}

async function upsertMeeting(supabaseClient: any, userId: string, integrationId: string, meetingData: any) {
  try {
    const { error } = await supabaseClient
      .from('video_meetings')
      .upsert({
        user_id: userId,
        integration_id: integrationId,
        external_meeting_id: meetingData.external_meeting_id,
        title: meetingData.title,
        start_time: meetingData.start_time,
        end_time: meetingData.end_time,
        join_url: meetingData.join_url,
        phone_dial_in: meetingData.phone_dial_in,
        passcode: meetingData.password || meetingData.passcode,
        provider: meetingData.provider
      }, {
        onConflict: 'integration_id,external_meeting_id'
      });

    if (error) {
      console.error('Error upserting meeting:', error);
    }
  } catch (error) {
    console.error('Error in upsertMeeting:', error);
  }
}