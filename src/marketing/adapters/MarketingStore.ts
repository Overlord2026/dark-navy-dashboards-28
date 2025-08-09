// Marketing Store Interface - Adapter pattern for Supabase vs Fallback storage

import { 
  MarketingCampaign, 
  MarketingCreative, 
  MarketingApproval, 
  SpendSnapshot, 
  MarketingSettings,
  AuditLogEntry,
  MarketingPersona,
  MarketingChannel,
  CampaignStatus
} from '../types';

export interface MarketingStoreAdapter {
  // Campaign Operations
  listCampaigns(filters?: {
    persona?: MarketingPersona;
    status?: CampaignStatus;
    dateRange?: { start: string; end: string };
  }): Promise<MarketingCampaign[]>;
  
  getCampaign(id: string): Promise<MarketingCampaign | null>;
  
  createDraft(payload: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt' | 'versionHash'>): Promise<MarketingCampaign>;
  
  updateDraft(id: string, patch: Partial<MarketingCampaign>): Promise<MarketingCampaign>;
  
  // Approval Workflow
  requestApproval(id: string): Promise<void>;
  
  recordApproval(campaignId: string, payload: Omit<MarketingApproval, 'id'>): Promise<MarketingApproval>;
  
  lockVersion(id: string): Promise<MarketingCampaign>;
  
  // Campaign Lifecycle
  launchCampaign(id: string): Promise<void>;
  
  pauseCampaign(id: string): Promise<void>;
  
  completeCampaign(id: string): Promise<void>;
  
  // Creatives
  getCreatives(campaignId: string): Promise<MarketingCreative[]>;
  
  saveCreative(creative: Omit<MarketingCreative, 'id'>): Promise<MarketingCreative>;
  
  updateCreative(id: string, patch: Partial<MarketingCreative>): Promise<MarketingCreative>;
  
  // Analytics & Spend
  recordSpendSnapshot(snapshot: Omit<SpendSnapshot, 'id'>): Promise<SpendSnapshot>;
  
  getSpendSnapshots(campaignId: string, dateRange?: { start: string; end: string }): Promise<SpendSnapshot[]>;
  
  // Audit & Export
  exportAuditBundle(campaignId: string): Promise<{
    campaign: MarketingCampaign;
    creatives: MarketingCreative[];
    approvals: MarketingApproval[];
    auditLog: AuditLogEntry[];
    spendData: SpendSnapshot[];
  }>;
  
  logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void>;
  
  getAuditLog(campaignId: string): Promise<AuditLogEntry[]>;
  
  // Configuration
  getSettings(): Promise<MarketingSettings>;
  
  updateSettings(patch: Partial<MarketingSettings>): Promise<MarketingSettings>;
  
  // Compliance Data
  listDisclaimers(state?: string, persona?: MarketingPersona, channel?: MarketingChannel): Promise<Array<{
    id: string;
    text: string;
    rules: string[];
    required: boolean;
  }>>;
  
  listApprovers(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>>;
}