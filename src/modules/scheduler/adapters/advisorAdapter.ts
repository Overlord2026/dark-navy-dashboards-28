/**
 * Adapter for existing advisor scheduling system
 * Maintains compatibility with existing advisor meetings
 */

import { supabase } from "@/integrations/supabase/client";
import type { OfferingFormData, WindowFormData, BookingFormData } from '../schedulerApi';

export const advisorAdapter = {
  // Legacy advisor meeting functions
  async getAdvisorMeetings(advisorId: string) {
    // This would integrate with existing advisor meeting tables
    // For now, return empty array to maintain compatibility
    return [];
  },

  async createAdvisorMeeting(advisorId: string, meetingData: any) {
    // This would create meetings in the existing advisor system
    // Implementation depends on existing advisor meeting structure
    console.log('Creating advisor meeting:', { advisorId, meetingData });
    return null;
  },

  // Convert between advisor meeting format and generic scheduler format
  toGenericOffering(advisorMeeting: any): OfferingFormData {
    return {
      title: advisorMeeting.title || 'Advisory Session',
      description: advisorMeeting.description,
      duration_minutes: advisorMeeting.duration || 60,
      price: advisorMeeting.fee,
      capacity: 1, // Advisor meetings are typically 1-on-1
      visibility: 'private', // Advisor meetings are usually private
      is_published: advisorMeeting.is_active || false,
      offering_type: 'one_on_one',
      location_type: advisorMeeting.is_virtual ? 'virtual' : 'in_person',
      location_details: advisorMeeting.meeting_link || advisorMeeting.location
    };
  },

  toGenericWindow(advisorSlot: any): WindowFormData {
    return {
      start_time: advisorSlot.start_time,
      end_time: advisorSlot.end_time,
      timezone: advisorSlot.timezone || 'America/New_York',
      max_bookings: 1,
      is_available: advisorSlot.is_available
    };
  },

  toGenericBooking(advisorBooking: any): BookingFormData {
    return {
      window_id: advisorBooking.slot_id,
      contact_info: {
        name: advisorBooking.client_name,
        email: advisorBooking.client_email,
        phone: advisorBooking.client_phone
      },
      notes: advisorBooking.notes,
      confirmed_adult: true, // Assume advisor clients are adults
      agreed_to_terms: true // Assume advisor clients have agreed to terms
    };
  }
};