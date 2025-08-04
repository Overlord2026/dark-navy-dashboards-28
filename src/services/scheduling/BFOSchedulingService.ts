import { supabase } from '@/integrations/supabase/client';
import { MeetingProvider, SchedulingConfig } from '@/types/integrations';

export interface SchedulingSlot {
  id: string;
  start: string;
  end: string;
  duration: number;
  available: boolean;
  meetingType: MeetingProvider;
}

export interface MeetingRequest {
  clientName: string;
  clientEmail: string;
  advisorId: string;
  selectedSlot: SchedulingSlot;
  meetingType: MeetingProvider;
  agenda?: string;
  phoneNumber?: string;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  advisorId: string;
  scheduledAt: string;
  duration: number;
  meetingType: MeetingProvider;
  meetingUrl?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  calendarEventId?: string;
  createdAt: string;
}

class BFOSchedulingService {
  private defaultConfig: SchedulingConfig = {
    provider: 'bfo',
    defaultMeetingType: 'google_meet',
    bufferTime: 15,
    workingHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York'
    },
    availableDurations: [15, 30, 45, 60, 90]
  };

  async getAvailableSlots(advisorId: string, date: string): Promise<SchedulingSlot[]> {
    try {
      // Call BFO scheduling engine
      const { data, error } = await supabase.functions.invoke('bfo-scheduling', {
        body: {
          action: 'get_available_slots',
          advisorId,
          date,
          config: this.defaultConfig
        }
      });

      if (error) throw error;
      return data.slots || [];
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return this.getMockSlots(date);
    }
  }

  async scheduleMeeting(request: MeetingRequest): Promise<ScheduledMeeting> {
    try {
      const { data, error } = await supabase.functions.invoke('bfo-scheduling', {
        body: {
          action: 'schedule_meeting',
          request,
          config: this.defaultConfig
        }
      });

      if (error) throw error;

      // Create Google Calendar event if Google is selected
      if (request.meetingType === 'google_meet') {
        await this.createGoogleCalendarEvent(data.meeting);
      }

      return data.meeting;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw new Error('Failed to schedule meeting. Please try again.');
    }
  }

  async cancelMeeting(meetingId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('bfo-scheduling', {
        body: {
          action: 'cancel_meeting',
          meetingId
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      throw new Error('Failed to cancel meeting.');
    }
  }

  async rescheduleMeeting(meetingId: string, newSlot: SchedulingSlot): Promise<ScheduledMeeting> {
    try {
      const { data, error } = await supabase.functions.invoke('bfo-scheduling', {
        body: {
          action: 'reschedule_meeting',
          meetingId,
          newSlot
        }
      });

      if (error) throw error;
      return data.meeting;
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
      throw new Error('Failed to reschedule meeting.');
    }
  }

  private async createGoogleCalendarEvent(meeting: ScheduledMeeting): Promise<void> {
    try {
      await supabase.functions.invoke('google-calendar-integration', {
        body: {
          action: 'create_event',
          meeting
        }
      });
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      // Don't throw - meeting is already scheduled
    }
  }

  private getMockSlots(date: string): SchedulingSlot[] {
    const slots: SchedulingSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStart = `${date}T${timeString}:00`;
        const slotEnd = new Date(new Date(slotStart).getTime() + 30 * 60000).toISOString();
        
        slots.push({
          id: `${date}-${timeString}`,
          start: slotStart,
          end: slotEnd,
          duration: 30,
          available: Math.random() > 0.3, // 70% availability
          meetingType: 'google_meet'
        });
      }
    }
    
    return slots;
  }

  getDefaultMeetingProvider(): MeetingProvider {
    return this.defaultConfig.defaultMeetingType;
  }

  getAvailableMeetingTypes(): { type: MeetingProvider; name: string; description: string; recommended?: boolean }[] {
    return [
      {
        type: 'google_meet',
        name: 'Google Meet',
        description: 'BFO Default - Integrated with Google Calendar',
        recommended: true
      },
      {
        type: 'zoom',
        name: 'Zoom',
        description: 'Optional - Alternative video platform'
      },
      {
        type: 'teams',
        name: 'Microsoft Teams',
        description: 'Optional - Alternative video platform'
      }
    ];
  }
}

export const bfoSchedulingService = new BFOSchedulingService();