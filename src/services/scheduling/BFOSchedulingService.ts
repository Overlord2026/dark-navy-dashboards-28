import { supabase } from '@/integrations/supabase/client';
import { MeetingProvider, SchedulingConfig } from '@/types/integrations';
import { googleIntegrationService, GoogleCalendarEvent } from '@/services/integrations/GoogleIntegrationService';

interface MeetingType {
  id: string;
  name: string;
  duration: number;
}

export interface SchedulingSlot {
  id: string;
  start: string;
  end: string;
  duration: number;
  available: boolean;
  meetingType: MeetingProvider;
  googleEventId?: string;
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
  googleEventId?: string;
  googleMeetLink?: string;
  driveRecordingId?: string;
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

  getAvailableMeetingTypes(): MeetingType[] {
    return [
      { id: 'consultation', name: '30-min Consultation', duration: 30 },
      { id: 'planning', name: '60-min Planning Session', duration: 60 },
      { id: 'review', name: '45-min Portfolio Review', duration: 45 }
    ];
  }

  async getAvailableSlots(advisorId: string, date: string): Promise<SchedulingSlot[]> {
    try {
      // First check if Google is connected
      const isGoogleConnected = await googleIntegrationService.isGoogleConnected();
      
      if (isGoogleConnected) {
        // Get real availability from Google Calendar
        const startOfDay = `${date}T00:00:00Z`;
        const endOfDay = `${date}T23:59:59Z`;
        
        const availability = await googleIntegrationService.getAvailability(
          startOfDay,
          endOfDay
        );
        
        return this.generateSlotsFromAvailability(date, availability);
      } else {
        // Fallback to BFO scheduling logic
        return this.getMockSlots(date);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return this.getMockSlots(date);
    }
  }

  async scheduleMeeting(request: MeetingRequest): Promise<ScheduledMeeting> {
    try {
      // Create Google Calendar event first (always default to Google)
      const googleEvent: Partial<GoogleCalendarEvent> = {
        summary: `Meeting with ${request.clientName}`,
        description: request.agenda || `Meeting scheduled through BFO`,
        start: {
          dateTime: request.selectedSlot.start,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: request.selectedSlot.end,
          timeZone: 'America/New_York'
        },
        attendees: [
          { email: request.clientEmail, displayName: request.clientName }
        ]
      };

      const createdEvent = await googleIntegrationService.createCalendarEvent(googleEvent);
      
      // Create BFO meeting record
      const meeting: ScheduledMeeting = {
        id: crypto.randomUUID(),
        title: googleEvent.summary!,
        clientName: request.clientName,
        clientEmail: request.clientEmail,
        advisorId: request.advisorId,
        scheduledAt: request.selectedSlot.start,
        duration: request.selectedSlot.duration,
        meetingType: 'google_meet', // Always default to Google Meet
        meetingUrl: createdEvent.meetLink,
        googleEventId: createdEvent.id,
        googleMeetLink: createdEvent.meetLink,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // Store in BFO database
      await this.storeMeetingRecord(meeting);

      // Send confirmations via Gmail
      await this.sendMeetingConfirmations(meeting);

      return meeting;
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

  private async sendMeetingConfirmations(meeting: ScheduledMeeting): Promise<void> {
    try {
      // Send email confirmation via Gmail
      const emailSubject = `Meeting Confirmed: ${meeting.title}`;
      const emailContent = this.generateConfirmationEmail(meeting);
      
      await googleIntegrationService.sendGmailNotification(
        meeting.clientEmail,
        emailSubject,
        emailContent,
        { meeting }
      );

      // TODO: Send SMS confirmation when SMS integration is implemented
    } catch (error) {
      console.error('Error sending meeting confirmations:', error);
      // Don't throw - meeting is already scheduled
    }
  }

  private generateSlotsFromAvailability(
    date: string, 
    availability: { busy: Array<{ start: string; end: string }> }
  ): SchedulingSlot[] {
    const slots: SchedulingSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

        // Check if slot conflicts with busy periods
        const isAvailable = !availability.busy.some(busy => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        slots.push({
          id: `${date}-${hour}-${minute}`,
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          duration: slotDuration,
          available: isAvailable,
          meetingType: 'google_meet'
        });
      }
    }

    return slots.filter(slot => slot.available);
  }

  private async storeMeetingRecord(meeting: ScheduledMeeting): Promise<void> {
    const { error } = await supabase
      .from('scheduled_meetings')
      .insert({
        id: meeting.id,
        title: meeting.title,
        client_name: meeting.clientName,
        client_email: meeting.clientEmail,
        advisor_id: meeting.advisorId,
        scheduled_at: meeting.scheduledAt,
        duration: meeting.duration,
        meeting_type: meeting.meetingType,
        meeting_url: meeting.meetingUrl,
        google_event_id: meeting.googleEventId,
        google_meet_link: meeting.googleMeetLink,
        status: meeting.status,
        created_at: meeting.createdAt
      });

    if (error) throw error;
  }

  private generateConfirmationEmail(meeting: ScheduledMeeting): string {
    const meetingDate = new Date(meeting.scheduledAt).toLocaleDateString();
    const meetingTime = new Date(meeting.scheduledAt).toLocaleTimeString();

    return `
      <h2>Meeting Confirmed ✅</h2>
      <p>Hi ${meeting.clientName},</p>
      <p>Your meeting has been confirmed for <strong>${meetingDate} at ${meetingTime}</strong>.</p>
      
      <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <h3>${meeting.title}</h3>
        <p><strong>When:</strong> ${meetingDate} at ${meetingTime}</p>
        <p><strong>Duration:</strong> ${meeting.duration} minutes</p>
        ${meeting.googleMeetLink ? `<p><strong>Join via Google Meet:</strong> <a href="${meeting.googleMeetLink}">Click to join</a></p>` : ''}
      </div>
      
      <p>This meeting will automatically be added to your Google Calendar. You'll receive a reminder 15 minutes before the meeting starts.</p>
      
      <p>Best regards,<br>The BFO Team</p>
    `;
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
    
    return slots.filter(slot => slot.available);
  }
}

export const bfoSchedulingService = new BFOSchedulingService();