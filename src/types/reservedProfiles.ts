export interface ReservedProfile {
  id: string;
  email: string;
  name: string;
  organization?: string;
  role_title?: string;
  persona_type: string;
  linkedin_url?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  claimed_at?: string;
  claimed_by?: string;
  invitation_token: string;
  invitation_sent_at?: string;
  invitation_method?: string | null;
  referral_source?: string;
  priority_level: 'high' | 'normal' | 'low';
  segment?: string;
  custodian_partners?: string[];
  urgency_deadline?: string;
  is_active: boolean;
  notes?: string;
  created_by?: string;
  tenant_id?: string;
}

export interface ReservedProfileInvitation {
  id: string;
  reserved_profile_id: string;
  invitation_method: 'email' | 'sms' | 'linkedin' | 'heygen';
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  template_used?: string;
  message_content?: string;
  response_received: boolean;
  response_text?: string;
  response_at?: string;
  sent_by?: string;
  metadata?: Record<string, any>;
}

export interface ReservedProfileAnalytics {
  id: string;
  date: string;
  persona_type: string;
  segment?: string;
  total_reserved: number;
  total_claimed: number;
  total_invited: number;
  claim_rate?: number;
  response_rate?: number;
  avg_time_to_claim_hours?: number;
  top_referral_sources?: any;
  custodian_preferences?: any;
  calculated_at: string;
}

export interface CreateReservedProfileRequest {
  email: string;
  name: string;
  organization?: string;
  role_title?: string;
  persona_type: string;
  linkedin_url?: string;
  photo_url?: string;
  referral_source?: string;
  priority_level?: 'high' | 'normal' | 'low';
  segment?: string;
  custodian_partners?: string[];
  urgency_deadline?: string;
  notes?: string;
}

export interface ClaimProfileRequest {
  token: string;
  user_id: string;
}

export const CUSTODIAN_PARTNERS = [
  { id: 'schwab', name: 'Charles Schwab', logo: '/custodians/schwab.png' },
  { id: 'fidelity', name: 'Fidelity', logo: '/custodians/fidelity.png' },
  { id: 'altruist', name: 'Altruist', logo: '/custodians/altruist.png' },
  { id: 'pershing', name: 'Pershing', logo: '/custodians/pershing.png' },
  { id: 'apex', name: 'Apex Clearing', logo: '/custodians/apex.png' },
  { id: 'ibkr', name: 'Interactive Brokers', logo: '/custodians/ibkr.png' },
] as const;

export const INVITATION_TEMPLATES = {
  email: {
    subject: "Your Reserved Profile on the Family Office Marketplace™",
    body: `Hi {{name}},

As a {{role_title}} who has inspired so much in our industry, I wanted to personally invite you to be one of the founding members of the Family Office Marketplace™.

We've already reserved your premium profile. No forms, no friction—just click, review, and join our network of the industry's most respected professionals.

{{claim_link}}

We're limiting this to just 25 leaders per segment to ensure a high-trust, high-value community for families, professionals, and strategic partners.

Thank you for all you've done for the industry—hope you'll join us in shaping its next chapter.

Warm regards,
Tony Gomes
Founder & CEO, Boutique Family Office™`
  },
  sms: {
    body: `Hi {{name}}, it's Tony Gomes (Boutique Family Office). Reserved your profile on the Family Office Marketplace—first 25 only. Click here to activate: {{claim_link}}`
  },
  linkedin: {
    subject: "Exclusive Invitation: Family Office Marketplace™",
    body: `Hi {{name}},

I've been inspired by your leadership in our industry—your work at {{organization}} has set the bar for advisors and families alike.

We're launching the Family Office Marketplace™—a next-generation platform bringing together advisors, accountants, attorneys, and elite partners to transform wealth and health for the next generation.

We've reserved a premium profile for you as one of the first 25 industry leaders in our {{segment}} community. Click below to activate it, tour the experience, and help shape the future.

{{claim_link}}

Seats are filling fast—hope to see you on the inside!
Best,
Tony Gomes, Co-Founder, Boutique Family Office™`
  }
} as const;