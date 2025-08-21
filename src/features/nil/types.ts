export interface NILTrainingModule {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  required: boolean;
  completed: boolean;
  completion_date?: string;
}

export interface NILConsentPassport {
  id: string;
  athlete_id: string;
  scope: string[];
  ttl_days: number;
  expires_at: string;
  co_signer_id?: string; // For minors
  status: 'active' | 'expired' | 'revoked';
  freshness_score: number;
}

export interface NILBrandOffer {
  id: string;
  brand_name: string;
  campaign_title: string;
  offer_amount: number;
  exclusivity_type: 'exclusive' | 'non_exclusive';
  channels: string[];
  duration_days: number;
  assets: {
    type: 'image' | 'video' | 'text';
    url?: string;
    content?: string;
  }[];
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';
}

export interface NILPost {
  id: string;
  athlete_id: string;
  brand_offer_id: string;
  content: {
    text?: string;
    media_urls: string[];
    hashtags: string[];
    mentions: string[];
  };
  channel: 'instagram' | 'tiktok' | 'twitter' | 'youtube';
  disclosure_pack: string;
  exclusivity_check_result: 'pass' | 'fail' | 'warning';
  published_at?: string;
  anchor_ref?: string;
  decision_rds_id?: string;
}

export interface NILDispute {
  id: string;
  post_id: string;
  reason: 'attribution_mismatch' | 'disclosure_missing' | 'exclusivity_violation' | 'content_mismatch';
  description: string;
  resolution_path: 'brand_review' | 'athlete_correction' | 'school_mediation' | 'compliance_review';
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  created_at: string;
  resolved_at?: string;
}

export interface NILDecisionRDS {
  id: string;
  type: 'Decision-RDS';
  post_id: string;
  reasons: string[];
  disclosure_pack: string;
  exclusivity_check: 'pass' | 'fail' | 'warning';
  policy_version: string;
  timestamp: string;
  inputs_hash: string;
}

export interface NILConsentRDS {
  id: string;
  type: 'Consent-RDS';
  athlete_id: string;
  scope: string[];
  training_completed: boolean;
  freshness_score: number;
  co_signer_required: boolean;
  ttl_days: number;
  policy_version: string;
  timestamp: string;
  inputs_hash: string;
}

export interface NILDeltaRDS {
  id: string;
  type: 'Delta-RDS';
  dispute_id: string;
  reason: string;
  fix_path: string;
  original_decision_id: string;
  corrective_actions: string[];
  policy_version: string;
  timestamp: string;
  inputs_hash: string;
}