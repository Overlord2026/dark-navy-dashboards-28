import { supabase } from '@/integrations/supabase/client';

interface ZoomMeetingData {
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  agenda?: string;
  settings?: {
    host_video: boolean;
    participant_video: boolean;
    waiting_room: boolean;
    mute_upon_entry: boolean;
  };
}

interface ZoomMeeting {
  id: string;
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  agenda: string;
  created_at: string;
  start_url: string;
  join_url: string;
  password: string;
}

export class ZoomIntegration {
  private baseUrl = 'https://api.zoom.us/v2';
  
  async createMeeting(leadId: string, advisorId: string, meetingData: ZoomMeetingData): Promise<ZoomMeeting> {
    try {
      // Call Zoom API through our edge function to avoid CORS issues
      const { data, error } = await supabase.functions.invoke('zoom-integration', {
        body: {
          action: 'create_meeting',
          leadId,
          advisorId,
          meetingData
        }
      });

      if (error) throw error;
      
      // Store meeting reference (using existing analytics table for now)
      const { error: dbError } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'zoom_meeting_created',
          event_category: 'lead_management',
          event_data: {
            lead_id: leadId,
            advisor_id: advisorId,
            zoom_meeting_id: data.id,
            meeting_data: data,
            scheduled_for: meetingData.start_time
          }
        });

      if (dbError) throw dbError;
      
      return data;
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      throw new Error('Failed to schedule meeting. Please try again.');
    }
  }

  async getMeetings(advisorId: string): Promise<ZoomMeeting[]> {
    try {
      const { data, error } = await supabase.functions.invoke('zoom-integration', {
        body: {
          action: 'list_meetings',
          advisorId
        }
      });

      if (error) throw error;
      return data.meetings || [];
    } catch (error) {
      console.error('Failed to fetch Zoom meetings:', error);
      throw new Error('Failed to fetch meetings');
    }
  }

  async updateMeeting(meetingId: string, updates: Partial<ZoomMeetingData>): Promise<ZoomMeeting> {
    try {
      const { data, error } = await supabase.functions.invoke('zoom-integration', {
        body: {
          action: 'update_meeting',
          meetingId,
          updates
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update Zoom meeting:', error);
      throw new Error('Failed to update meeting');
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('zoom-integration', {
        body: {
          action: 'delete_meeting',
          meetingId
        }
      });

      if (error) throw error;

      // Log cancellation event
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'zoom_meeting_cancelled',
          event_category: 'lead_management',
          event_data: { zoom_meeting_id: meetingId }
        });
        
    } catch (error) {
      console.error('Failed to delete Zoom meeting:', error);
      throw new Error('Failed to cancel meeting');
    }
  }
}

export const zoomIntegration = new ZoomIntegration();