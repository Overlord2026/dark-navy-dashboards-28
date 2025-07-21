export interface Firm {
  id: string;
  name: string;
  logo_url?: string;
  type: string;
  seats_purchased: number;
  seats_in_use: number;
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  billing_email: string;
  marketplace_visibility: boolean;
  branding_enabled: boolean;
  custom_domain?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalUser {
  id: string;
  firm_id: string;
  user_id?: string;
  name: string;
  email: string;
  role: string;
  status: 'invited' | 'active' | 'suspended';
  assigned_clients: number;
  profile_url?: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  certifications?: string[];
  onboarded_at?: string;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SeatAssignment {
  id: string;
  firm_id: string;
  professional_user_id: string;
  status: 'active' | 'pending' | 'suspended' | 'expired';
  assigned_by?: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  firm_id: string;
  plan_name: string;
  price_per_seat: number;
  seats: number;
  billing_cycle: 'monthly' | 'annual';
  start_date: string;
  end_date?: string;
  next_billing_date: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientAssignment {
  id: string;
  firm_id: string;
  professional_user_id: string;
  client_user_id: string;
  relationship_type: 'primary' | 'secondary' | 'service_rep' | 'specialist';
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FirmInvitation {
  id: string;
  firm_name: string;
  admin_email: string;
  admin_name: string;
  firm_type: string;
  seats_requested: number;
  status: 'sent' | 'accepted' | 'expired';
  invite_token: string;
  invited_by?: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export const FIRM_TYPES = [
  'RIA',
  'CPA', 
  'Law',
  'Health',
  'Property',
  'Insurance',
  'Family Office',
  'Wealth Management',
  'Financial Planning'
] as const;

export const PROFESSIONAL_ROLES = [
  'owner',
  'admin', 
  'advisor',
  'cpa',
  'attorney',
  'health',
  'concierge',
  'assistant',
  'service_rep'
] as const;

export const SUBSCRIPTION_PLANS = [
  { name: 'starter', seats: 1, price_monthly: 99, price_annual: 990 },
  { name: 'professional', seats: 5, price_monthly: 79, price_annual: 790 },
  { name: 'team', seats: 15, price_monthly: 69, price_annual: 690 },
  { name: 'enterprise', seats: 50, price_monthly: 59, price_annual: 590 }
] as const;