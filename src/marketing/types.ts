// Core types for AI Marketing Engine

export type MarketingPersona = 
  | 'young_professional' 
  | 'independent_woman' 
  | 'corporate_executive' 
  | 'pre_retiree_retiree' 
  | 'high_net_worth'
  | 'small_business_owner';

export type MarketingChannel = 
  | 'facebook' 
  | 'linkedin' 
  | 'google' 
  | 'youtube' 
  | 'email' 
  | 'sms';

export type CampaignStatus = 
  | 'draft' 
  | 'awaiting_compliance' 
  | 'awaiting_approval' 
  | 'approved_locked' 
  | 'scheduled' 
  | 'live' 
  | 'paused' 
  | 'completed' 
  | 'archived';

export type ApprovalStatus = 
  | 'requested' 
  | 'manager_ok' 
  | 'compliance_ok' 
  | 'locked_version' 
  | 'rejected';

export type ComplianceRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type MarketingRole = 'marketing_manager' | 'compliance_officer' | 'admin';

export interface MarketingCampaign {
  id: string;
  name: string;
  persona: MarketingPersona;
  objective: string;
  geoTargeting: string[];
  status: CampaignStatus;
  versionHash: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalBudget: number;
  dailyBudget: number;
  startDate?: string;
  endDate?: string;
  metadata: Record<string, any>;
}

export interface MarketingCreative {
  id: string;
  campaignId: string;
  channel: MarketingChannel;
  headline: string;
  description: string;
  callToAction: string;
  assets: {
    images?: string[];
    videos?: string[];
    documents?: string[];
  };
  copy: {
    primary: string;
    secondary?: string;
    disclaimer?: string;
  };
  approvedVersion: boolean;
  complianceFindings: ComplianceFinding[];
}

export interface ComplianceFinding {
  id: string;
  ruleId: string;
  severity: ComplianceRiskLevel;
  message: string;
  suggestion?: string;
  autoFixed: boolean;
  requiresDisclaimer: boolean;
  disclaimerText?: string;
}

export interface MarketingApproval {
  id: string;
  campaignId: string;
  role: MarketingRole;
  approverId: string;
  decision: 'approved' | 'rejected' | 'changes_requested';
  comment: string;
  decidedAt: string;
}

export interface SpendSnapshot {
  id: string;
  campaignId: string;
  channel: MarketingChannel;
  date: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpl: number;
    cpa: number;
    roas: number;
  };
}

export interface MarketingSettings {
  id: string;
  guardrails: {
    dailySpendCap: Record<MarketingChannel, number>;
    maxActiveCampaigns: number;
    quietHours: { start: string; end: string; timezone: string };
    approvalRoles: Record<string, MarketingRole[]>;
  };
  policies: {
    autoInjectDisclaimers: boolean;
    requireComplianceReview: boolean;
    retentionYears: number;
  };
  attribution: {
    model: 'first_touch' | 'last_touch' | 'multi_touch';
    lookbackDays: number;
  };
  outboundLimits: {
    emailDailyLimit: number;
    smsDailyLimit: number;
    enforceCanSpam: boolean;
  };
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  campaignId: string;
  event: string;
  payload: Record<string, any>;
  timestamp: string;
  userId: string;
  userRole: string;
}