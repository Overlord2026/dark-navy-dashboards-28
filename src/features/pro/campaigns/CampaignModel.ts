import { Campaign, ProPersona } from '../types';

const STORAGE_KEY = 'pro_campaigns';

export class CampaignModel {
  static getAll(): Campaign[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getByPersona(persona: ProPersona): Campaign[] {
    return this.getAll().filter(campaign => campaign.persona === persona);
  }

  static create(campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Campaign {
    const campaign: Campaign = {
      ...campaignData,
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const campaigns = this.getAll();
    campaigns.unshift(campaign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    
    return campaign;
  }

  static update(id: string, updates: Partial<Campaign>): Campaign | null {
    const campaigns = this.getAll();
    const index = campaigns.findIndex(campaign => campaign.id === id);
    
    if (index === -1) return null;
    
    campaigns[index] = { 
      ...campaigns[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    
    return campaigns[index];
  }

  static delete(id: string): boolean {
    const campaigns = this.getAll();
    const filtered = campaigns.filter(campaign => campaign.id !== id);
    
    if (filtered.length === campaigns.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static updateMetrics(id: string, metrics: Partial<Campaign['metrics']>): Campaign | null {
    const campaigns = this.getAll();
    const index = campaigns.findIndex(campaign => campaign.id === id);
    
    if (index === -1) return null;
    
    campaigns[index].metrics = { ...campaigns[index].metrics, ...metrics };
    campaigns[index].updated_at = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    
    return campaigns[index];
  }

  static exportCSV(persona?: ProPersona): string {
    const campaigns = persona ? this.getByPersona(persona) : this.getAll();
    
    const headers = [
      'Name', 'Template', 'Status', 'Scheduled At', 'Sent', 'Opened', 
      'Clicked', 'Converted', 'Open Rate %', 'Click Rate %', 'Created At'
    ];
    
    const rows = campaigns.map(campaign => {
      const openRate = campaign.metrics.sent > 0 ? 
        ((campaign.metrics.opened / campaign.metrics.sent) * 100).toFixed(1) : '0.0';
      const clickRate = campaign.metrics.opened > 0 ? 
        ((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1) : '0.0';
      
      return [
        campaign.name,
        campaign.template_id,
        campaign.status,
        campaign.scheduled_at || '',
        campaign.metrics.sent.toString(),
        campaign.metrics.opened.toString(),
        campaign.metrics.clicked.toString(),
        campaign.metrics.converted.toString(),
        openRate,
        clickRate,
        new Date(campaign.created_at).toLocaleDateString()
      ];
    });

    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  static getMetrics(persona?: ProPersona) {
    const campaigns = persona ? this.getByPersona(persona) : this.getAll();
    
    const totalMetrics = campaigns.reduce(
      (acc, campaign) => ({
        sent: acc.sent + campaign.metrics.sent,
        opened: acc.opened + campaign.metrics.opened,
        clicked: acc.clicked + campaign.metrics.clicked,
        converted: acc.converted + campaign.metrics.converted,
      }),
      { sent: 0, opened: 0, clicked: 0, converted: 0 }
    );

    return {
      total_campaigns: campaigns.length,
      by_status: {
        draft: campaigns.filter(c => c.status === 'draft').length,
        scheduled: campaigns.filter(c => c.status === 'scheduled').length,
        active: campaigns.filter(c => c.status === 'active').length,
        paused: campaigns.filter(c => c.status === 'paused').length,
        completed: campaigns.filter(c => c.status === 'completed').length,
      },
      metrics: totalMetrics,
      performance: {
        avg_open_rate: totalMetrics.sent > 0 ? 
          ((totalMetrics.opened / totalMetrics.sent) * 100) : 0,
        avg_click_rate: totalMetrics.opened > 0 ? 
          ((totalMetrics.clicked / totalMetrics.opened) * 100) : 0,
        conversion_rate: totalMetrics.sent > 0 ? 
          ((totalMetrics.converted / totalMetrics.sent) * 100) : 0,
      }
    };
  }

  static getActiveCampaigns(persona?: ProPersona): Campaign[] {
    const campaigns = persona ? this.getByPersona(persona) : this.getAll();
    return campaigns.filter(c => c.status === 'active' || c.status === 'scheduled');
  }

  static pauseCampaign(id: string): boolean {
    const updated = this.update(id, { status: 'paused' });
    return !!updated;
  }

  static resumeCampaign(id: string): boolean {
    const updated = this.update(id, { status: 'active' });
    return !!updated;
  }
}