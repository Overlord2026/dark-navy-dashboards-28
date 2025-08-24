export type ProPersona = 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'healthcare' | 'realtor' | 'medicare';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  persona: ProPersona;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  consent_given: boolean;
  consent_receipt_id?: string;
  primaryConcern?: string;
  referralSource?: string;
  dnc_verified?: boolean;
}

export interface Meeting {
  id: string;
  persona: ProPersona;
  title: string;
  source: 'zocks' | 'jump' | 'plain' | 'upload' | 'recorded';
  summary: string;
  bullets: string[];
  action_items: string[];
  risks: string[];
  inputs_hash: string;
  decision_receipt_id?: string;
  vault_grants: string[];
  anchor_ref?: any;
  created_at: string;
  meeting_date?: string;
  participants?: string[];
}

export interface Campaign {
  id: string;
  persona: ProPersona;
  name: string;
  template_id: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  scheduled_at?: string;
  target_audience: string[];
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  persona: ProPersona;
  name: string;
  subject: string;
  content: string; // Markdown with tokens
  category: 'onboarding' | 'follow-up' | 'newsletter' | 'promotion';
  tokens: string[]; // Available template tokens
  compliance_reviewed: boolean;
  policy_version: string;
}

export interface ConsentScope {
  contact: boolean;
  marketing: boolean;
  analytics: boolean;
  third_party_sharing: boolean;
}

export interface PolicyGate {
  consent_required: boolean;
  consent_ttl_days: number;
  allowed_templates: string[];
  minimum_necessary: boolean;
}