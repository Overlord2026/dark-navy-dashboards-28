export interface VipInvite {
  id: string;
  name: string;
  firm?: string;
  persona_type: 'family_office' | 'advisor' | 'attorney' | 'cpa' | 'healthcare' | 'insurance' | 'consultant' | 'coach' | 'other';
  email: string;
  linkedin_url?: string;
  phone?: string;
  invite_status: 'pending' | 'sent' | 'viewed' | 'activated' | 'expired' | 'error';
  activation_link?: string;
  persona_group?: string;
  batch_name?: string;
  slug: string;
  specialty?: string;
  region?: string;
  source?: string;
  is_vip: boolean;
  is_public_directory: boolean;
  activated_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  tenant_id?: string;
}

export interface VipInvitationTracking {
  id: string;
  invite_id: string;
  channel: 'email' | 'sms' | 'linkedin' | 'direct';
  sent_at?: string;
  viewed_at?: string;
  clicked_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface VipAdminActivityLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_invite_id?: string;
  details?: Record<string, any>;
  created_at: string;
  tenant_id?: string;
}

export interface VipLandingPageView {
  id: string;
  invite_id: string;
  viewed_at: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export const PERSONA_DISPLAY_NAMES = {
  family_office: 'Family Office',
  advisor: 'Advisor',
  attorney: 'Attorney',
  cpa: 'CPA',
  healthcare: 'Healthcare',
  insurance: 'Insurance',
  consultant: 'Consultant',
  coach: 'Coach',
  other: 'Other'
} as const;

export const INVITE_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  activated: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  error: 'bg-red-100 text-red-800'
} as const;