// Centralized user types for the Family Office Marketplace
import { UserRole } from '@/utils/roleHierarchy';

export interface UserProfile {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // Database field aliases for backward compatibility
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  avatarUrl?: string;
  user_id?: string;
  
  middleName?: string;
  title?: string;
  suffix?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: Date;
  phone?: string;
  investorType?: string;
  role: UserRole;
  permissions?: string[];
  twoFactorEnabled?: boolean;
  client_segment?: string;
  client_tier?: 'basic' | 'premium';
  tenant_id?: string;
  segments?: string[];
  advisor_role?: string;
  
  // Marketing and CRM fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ghl_contact_id?: string;
  lead_stage?: string;
  advisor_id?: string;
  email_opt_in?: boolean;
  sms_opt_in?: boolean;
  last_login_at?: Date;
  last_active_at?: Date;
}

// Professional profile interface for marketplace
export interface Professional {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  rating?: number;
  isBookmarked?: boolean;
  image?: string;
  user_id?: string;
}