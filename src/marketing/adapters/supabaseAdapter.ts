// Supabase Marketing Store Adapter - Real implementation (currently stubbed)

import { MarketingStoreAdapter } from './MarketingStore';
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

// NOTE: This will be implemented once Supabase migrations are applied
export class SupabaseMarketingAdapter implements MarketingStoreAdapter {
  constructor() {
    console.warn('SupabaseMarketingAdapter is stubbed - migrations need to be applied first');
  }

  async listCampaigns(filters?: {
    persona?: MarketingPersona;
    status?: CampaignStatus;
    dateRange?: { start: string; end: string };
  }): Promise<MarketingCampaign[]> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async getCampaign(id: string): Promise<MarketingCampaign | null> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async createDraft(payload: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt' | 'versionHash'>): Promise<MarketingCampaign> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async updateDraft(id: string, patch: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async requestApproval(id: string): Promise<void> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async recordApproval(campaignId: string, payload: Omit<MarketingApproval, 'id'>): Promise<MarketingApproval> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async lockVersion(id: string): Promise<MarketingCampaign> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async launchCampaign(id: string): Promise<void> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async pauseCampaign(id: string): Promise<void> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async completeCampaign(id: string): Promise<void> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async getCreatives(campaignId: string): Promise<MarketingCreative[]> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async saveCreative(creative: Omit<MarketingCreative, 'id'>): Promise<MarketingCreative> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async updateCreative(id: string, patch: Partial<MarketingCreative>): Promise<MarketingCreative> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async recordSpendSnapshot(snapshot: Omit<SpendSnapshot, 'id'>): Promise<SpendSnapshot> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async getSpendSnapshots(campaignId: string, dateRange?: { start: string; end: string }): Promise<SpendSnapshot[]> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async exportAuditBundle(campaignId: string): Promise<{
    campaign: MarketingCampaign;
    creatives: MarketingCreative[];
    approvals: MarketingApproval[];
    auditLog: AuditLogEntry[];
    spendData: SpendSnapshot[];
  }> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async getAuditLog(campaignId: string): Promise<AuditLogEntry[]> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async getSettings(): Promise<MarketingSettings> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async updateSettings(patch: Partial<MarketingSettings>): Promise<MarketingSettings> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async listDisclaimers(state?: string, persona?: MarketingPersona, channel?: MarketingChannel): Promise<Array<{
    id: string;
    text: string;
    rules: string[];
    required: boolean;
  }>> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }

  async listApprovers(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>> {
    throw new Error('Supabase adapter not yet implemented - apply migrations first');
  }
}