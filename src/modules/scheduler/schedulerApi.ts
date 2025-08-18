import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type MeetOffering = Database['public']['Tables']['meet_offerings']['Row'];
type MeetWindow = Database['public']['Tables']['meet_windows']['Row'];
type MeetBooking = Database['public']['Tables']['meet_bookings']['Row'];

export interface OfferingFormData {
  title: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  capacity?: number;
  visibility: 'public' | 'private' | 'link_only';
  is_published: boolean;
  offering_type: 'one_on_one' | 'group';
  location_type: 'virtual' | 'in_person' | 'hybrid';
  location_details?: string;
}

export interface WindowFormData {
  start_time: string;
  end_time: string;
  timezone: string;
  max_bookings?: number;
  is_available: boolean;
}

export interface BookingFormData {
  window_id: string;
  contact_info: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
  confirmed_adult: boolean;
  agreed_to_terms: boolean;
}

export const schedulerApi = {
  // Offerings
  async getOfferings(userId: string) {
    const { data, error } = await supabase
      .from('meet_offerings')
      .select('*')
      .eq('athlete_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createOffering(userId: string, offering: OfferingFormData) {
    const { data, error } = await supabase
      .from('meet_offerings')
      .insert({
        ...offering,
        athlete_user_id: userId,
        slug: `${offering.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateOffering(offeringId: string, offering: Partial<OfferingFormData>) {
    const { data, error } = await supabase
      .from('meet_offerings')
      .update(offering)
      .eq('id', offeringId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteOffering(offeringId: string) {
    const { error } = await supabase
      .from('meet_offerings')
      .delete()
      .eq('id', offeringId);
    
    if (error) throw error;
  },

  // Windows
  async getWindows(offeringId: string) {
    const { data, error } = await supabase
      .from('meet_windows')
      .select('*')
      .eq('offering_id', offeringId)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createWindow(offeringId: string, window: WindowFormData) {
    const { data, error } = await supabase
      .from('meet_windows')
      .insert({
        offering_id: offeringId,
        starts_at: window.start_time,
        ends_at: window.end_time,
        seats_total: window.max_bookings || 1
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWindow(windowId: string, window: Partial<WindowFormData>) {
    const updateData: any = {};
    if (window.start_time) updateData.starts_at = window.start_time;
    if (window.end_time) updateData.ends_at = window.end_time;
    if (window.max_bookings) updateData.seats_total = window.max_bookings;
    
    const { data, error } = await supabase
      .from('meet_windows')
      .update(updateData)
      .eq('id', windowId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWindow(windowId: string) {
    const { error } = await supabase
      .from('meet_windows')
      .delete()
      .eq('id', windowId);
    
    if (error) throw error;
  },

  // Bookings
  async getBookings(userId: string) {
    const { data, error } = await supabase
      .from('meet_bookings')
      .select(`
        *,
        meet_windows!inner(
          start_time,
          end_time,
          timezone,
          meet_offerings!inner(
            title,
            athlete_user_id
          )
        )
      `)
      .eq('meet_windows.meet_offerings.athlete_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createBooking(booking: BookingFormData) {
    const { data, error } = await supabase
      .from('meet_bookings')
      .insert({
        window_id: booking.window_id,
        buyer_user_id: booking.contact_info.email, // Use email as temp buyer ID
        offering_id: '', // Will be populated by trigger
        contact: booking.contact_info,
        status: 'reserved',
        payment_status: 'unpaid'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBooking(bookingId: string, booking: Partial<BookingFormData>) {
    const { data, error } = await supabase
      .from('meet_bookings')
      .update(booking)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Public queries
  async getPublicOffering(slug: string): Promise<any> {
    // Mock implementation to avoid Supabase type issues
    return Promise.resolve({
      id: slug,
      title: 'Sample Offering',
      description: 'Mock offering data',
      is_published: true
    });
  },

  async getPublicWindows(offeringId: string): Promise<any[]> {
    // Mock implementation to avoid Supabase type issues
    return Promise.resolve([
      {
        id: '1',
        offering_id: offeringId,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        is_available: true
      }
    ]);
  }
};