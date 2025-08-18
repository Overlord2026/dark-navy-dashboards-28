export interface Offering {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  capacity: number;
  is_published: boolean;
  offering_type: string;
  location_type: string;
  slug: string;
}

export interface Window {
  id: string;
  offering_id: string;
  starts_at: string;
  ends_at: string;
  seats_total: number;
  seats_booked: number;
}

export interface Booking {
  id: string;
  window_id: string;
  contact_name: string;
  contact_email: string;
  status: 'reserved' | 'confirmed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

export interface SchedulerAdapter {
  getOfferings(userId: string): Promise<Offering[]>;
  createOffering(data: Partial<Offering>): Promise<Offering>;
  updateOffering(id: string, data: Partial<Offering>): Promise<Offering>;
  getWindows(offeringId: string): Promise<Window[]>;
  createWindow(data: Partial<Window>): Promise<Window>;
  getBookings(userId: string): Promise<Booking[]>;
}