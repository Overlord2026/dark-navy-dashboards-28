// Fallback Marketing Store Adapter - Uses IndexedDB/localStorage for demo mode

import { get, set, del, keys } from 'idb-keyval';
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

// Storage keys
const KEYS = {
  CAMPAIGNS: 'marketing.campaigns',
  CREATIVES: 'marketing.creatives',
  APPROVALS: 'marketing.approvals',
  SPEND_SNAPSHOTS: 'marketing.spend_snapshots',
  AUDIT_LOGS: 'marketing.audit_logs',
  SETTINGS: 'marketing.settings',
  DISCLAIMERS: 'marketing.disclaimers',
  APPROVERS: 'marketing.approvers',
} as const;

export class FallbackMarketingAdapter implements MarketingStoreAdapter {
  private async getFromStore<T>(key: string): Promise<T[]> {
    try {
      const data = await get(key);
      return data || [];
    } catch (error) {
      console.warn(`Failed to get ${key} from IndexedDB, falling back to localStorage:`, error);
      const fallback = localStorage.getItem(key);
      return fallback ? JSON.parse(fallback) : [];
    }
  }

  private async saveToStore<T>(key: string, data: T[]): Promise<void> {
    try {
      await set(key, data);
      // Also save to localStorage as backup
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key} to IndexedDB, using localStorage:`, error);
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVersionHash(): string {
    return Math.random().toString(36).substr(2, 12);
  }

  // Campaign Operations
  async listCampaigns(filters?: {
    persona?: MarketingPersona;
    status?: CampaignStatus;
    dateRange?: { start: string; end: string };
  }): Promise<MarketingCampaign[]> {
    const campaigns = await this.getFromStore<MarketingCampaign>(KEYS.CAMPAIGNS);
    
    if (!filters) return campaigns;
    
    return campaigns.filter(campaign => {
      if (filters.persona && campaign.persona !== filters.persona) return false;
      if (filters.status && campaign.status !== filters.status) return false;
      if (filters.dateRange) {
        const campaignDate = new Date(campaign.createdAt);
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        if (campaignDate < start || campaignDate > end) return false;
      }
      return true;
    });
  }

  async getCampaign(id: string): Promise<MarketingCampaign | null> {
    const campaigns = await this.getFromStore<MarketingCampaign>(KEYS.CAMPAIGNS);
    return campaigns.find(c => c.id === id) || null;
  }

  async createDraft(payload: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt' | 'versionHash'>): Promise<MarketingCampaign> {
    const campaigns = await this.getFromStore<MarketingCampaign>(KEYS.CAMPAIGNS);
    
    const newCampaign: MarketingCampaign = {
      ...payload,
      id: this.generateId(),
      versionHash: this.generateVersionHash(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    campaigns.push(newCampaign);
    await this.saveToStore(KEYS.CAMPAIGNS, campaigns);
    
    // Log the creation
    await this.logAuditEvent({
      campaignId: newCampaign.id,
      event: 'campaign_created',
      payload: { name: newCampaign.name, persona: newCampaign.persona },
      userId: newCampaign.createdBy,
      userRole: 'marketing_manager',
    });

    return newCampaign;
  }

  async updateDraft(id: string, patch: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const campaigns = await this.getFromStore<MarketingCampaign>(KEYS.CAMPAIGNS);
    const index = campaigns.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Campaign ${id} not found`);
    }

    const updated = {
      ...campaigns[index],
      ...patch,
      updatedAt: new Date().toISOString(),
      versionHash: this.generateVersionHash(),
    };

    campaigns[index] = updated;
    await this.saveToStore(KEYS.CAMPAIGNS, campaigns);

    await this.logAuditEvent({
      campaignId: id,
      event: 'campaign_updated',
      payload: patch,
      userId: updated.createdBy,
      userRole: 'marketing_manager',
    });

    return updated;
  }

  // Approval Workflow
  async requestApproval(id: string): Promise<void> {
    await this.updateDraft(id, { status: 'awaiting_compliance' });
    
    await this.logAuditEvent({
      campaignId: id,
      event: 'approval_requested',
      payload: { status: 'awaiting_compliance' },
      userId: 'current-user',
      userRole: 'marketing_manager',
    });
  }

  async recordApproval(campaignId: string, payload: Omit<MarketingApproval, 'id'>): Promise<MarketingApproval> {
    const approvals = await this.getFromStore<MarketingApproval>(KEYS.APPROVALS);
    
    const approval: MarketingApproval = {
      ...payload,
      id: this.generateId(),
    };

    approvals.push(approval);
    await this.saveToStore(KEYS.APPROVALS, approvals);

    // Update campaign status based on approval
    if (approval.decision === 'approved') {
      const nextStatus = approval.role === 'compliance_officer' ? 'awaiting_approval' : 'approved_locked';
      await this.updateDraft(campaignId, { status: nextStatus });
    }

    await this.logAuditEvent({
      campaignId,
      event: 'approval_recorded',
      payload: { decision: approval.decision, role: approval.role },
      userId: approval.approverId,
      userRole: approval.role,
    });

    return approval;
  }

  async lockVersion(id: string): Promise<MarketingCampaign> {
    return this.updateDraft(id, { status: 'approved_locked' });
  }

  // Campaign Lifecycle
  async launchCampaign(id: string): Promise<void> {
    await this.updateDraft(id, { status: 'live' });
    
    await this.logAuditEvent({
      campaignId: id,
      event: 'campaign_launched',
      payload: { status: 'live' },
      userId: 'current-user',
      userRole: 'marketing_manager',
    });
  }

  async pauseCampaign(id: string): Promise<void> {
    await this.updateDraft(id, { status: 'paused' });
    
    await this.logAuditEvent({
      campaignId: id,
      event: 'campaign_paused',
      payload: { status: 'paused' },
      userId: 'current-user',
      userRole: 'marketing_manager',
    });
  }

  async completeCampaign(id: string): Promise<void> {
    await this.updateDraft(id, { status: 'completed' });
    
    await this.logAuditEvent({
      campaignId: id,
      event: 'campaign_completed',
      payload: { status: 'completed' },
      userId: 'current-user',
      userRole: 'marketing_manager',
    });
  }

  // Creatives
  async getCreatives(campaignId: string): Promise<MarketingCreative[]> {
    const creatives = await this.getFromStore<MarketingCreative>(KEYS.CREATIVES);
    return creatives.filter(c => c.campaignId === campaignId);
  }

  async saveCreative(creative: Omit<MarketingCreative, 'id'>): Promise<MarketingCreative> {
    const creatives = await this.getFromStore<MarketingCreative>(KEYS.CREATIVES);
    
    const newCreative: MarketingCreative = {
      ...creative,
      id: this.generateId(),
    };

    creatives.push(newCreative);
    await this.saveToStore(KEYS.CREATIVES, creatives);

    return newCreative;
  }

  async updateCreative(id: string, patch: Partial<MarketingCreative>): Promise<MarketingCreative> {
    const creatives = await this.getFromStore<MarketingCreative>(KEYS.CREATIVES);
    const index = creatives.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Creative ${id} not found`);
    }

    const updated = { ...creatives[index], ...patch };
    creatives[index] = updated;
    await this.saveToStore(KEYS.CREATIVES, creatives);

    return updated;
  }

  // Analytics & Spend
  async recordSpendSnapshot(snapshot: Omit<SpendSnapshot, 'id'>): Promise<SpendSnapshot> {
    const snapshots = await this.getFromStore<SpendSnapshot>(KEYS.SPEND_SNAPSHOTS);
    
    const newSnapshot: SpendSnapshot = {
      ...snapshot,
      id: this.generateId(),
    };

    snapshots.push(newSnapshot);
    await this.saveToStore(KEYS.SPEND_SNAPSHOTS, snapshots);

    return newSnapshot;
  }

  async getSpendSnapshots(campaignId: string, dateRange?: { start: string; end: string }): Promise<SpendSnapshot[]> {
    const snapshots = await this.getFromStore<SpendSnapshot>(KEYS.SPEND_SNAPSHOTS);
    let filtered = snapshots.filter(s => s.campaignId === campaignId);

    if (dateRange) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      filtered = filtered.filter(s => {
        const date = new Date(s.date);
        return date >= start && date <= end;
      });
    }

    return filtered;
  }

  // Audit & Export
  async exportAuditBundle(campaignId: string) {
    const [campaign, creatives, approvals, auditLog, spendData] = await Promise.all([
      this.getCampaign(campaignId),
      this.getCreatives(campaignId),
      this.getFromStore<MarketingApproval>(KEYS.APPROVALS).then(apps => apps.filter(a => a.campaignId === campaignId)),
      this.getAuditLog(campaignId),
      this.getSpendSnapshots(campaignId),
    ]);

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    return {
      campaign,
      creatives,
      approvals,
      auditLog,
      spendData,
    };
  }

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logs = await this.getFromStore<AuditLogEntry>(KEYS.AUDIT_LOGS);
    
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    logs.push(logEntry);
    await this.saveToStore(KEYS.AUDIT_LOGS, logs);
  }

  async getAuditLog(campaignId: string): Promise<AuditLogEntry[]> {
    const logs = await this.getFromStore<AuditLogEntry>(KEYS.AUDIT_LOGS);
    return logs.filter(l => l.campaignId === campaignId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Configuration
  async getSettings(): Promise<MarketingSettings> {
    const settingsArray = await this.getFromStore<MarketingSettings>(KEYS.SETTINGS);
    
    if (settingsArray.length === 0) {
      // Return default settings
      const defaultSettings: MarketingSettings = {
        id: this.generateId(),
        guardrails: {
          dailySpendCap: {
            facebook: 1000,
            linkedin: 500,
            google: 1500,
            youtube: 800,
            email: 100,
            sms: 200,
          },
          maxActiveCampaigns: 10,
          quietHours: { start: '18:00', end: '08:00', timezone: 'America/New_York' },
          approvalRoles: {
            draft_to_compliance: ['compliance_officer'],
            compliance_to_approval: ['marketing_manager', 'admin'],
          },
        },
        policies: {
          autoInjectDisclaimers: true,
          requireComplianceReview: true,
          retentionYears: 7,
        },
        attribution: {
          model: 'multi_touch',
          lookbackDays: 30,
        },
        outboundLimits: {
          emailDailyLimit: 10000,
          smsDailyLimit: 1000,
          enforceCanSpam: true,
        },
        updatedBy: 'system',
        updatedAt: new Date().toISOString(),
      };

      await this.saveToStore(KEYS.SETTINGS, [defaultSettings]);
      return defaultSettings;
    }

    return settingsArray[0];
  }

  async updateSettings(patch: Partial<MarketingSettings>): Promise<MarketingSettings> {
    const current = await this.getSettings();
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToStore(KEYS.SETTINGS, [updated]);
    return updated;
  }

  // Compliance Data
  async listDisclaimers(state?: string, persona?: MarketingPersona, channel?: MarketingChannel) {
    // Return mock disclaimers for demo
    return [
      {
        id: 'sec-general',
        text: 'Securities offered through licensed broker-dealers. Past performance does not guarantee future results.',
        rules: ['SEC Rule 206(4)-1', 'FINRA Rule 2210'],
        required: true,
      },
      {
        id: 'finra-investment',
        text: 'Investment advisory services offered through registered investment advisors.',
        rules: ['FINRA Rule 2210'],
        required: true,
      },
      {
        id: 'state-specific',
        text: state ? `Additional disclosures required for ${state} residents.` : 'State-specific disclosures may apply.',
        rules: [`${state || 'STATE'}-REG-001`],
        required: !!state,
      },
    ];
  }

  async listApprovers() {
    return [
      {
        id: 'approver-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'compliance_officer',
      },
      {
        id: 'approver-2',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'marketing_manager',
      },
      {
        id: 'approver-3',
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@company.com',
        role: 'admin',
      },
    ];
  }
}