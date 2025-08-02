import { supabase } from '@/integrations/supabase/client';

interface AdCampaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

interface FacebookAdAccount {
  id: string;
  name: string;
  account_status: string;
  timezone_name: string;
}

export class GoogleAdsIntegration {
  async getCampaigns(dateRange?: { start_date: string; end_date: string }): Promise<AdCampaign[]> {
    try {
      const { data, error } = await supabase.functions.invoke('google-ads-integration', {
        body: {
          action: 'get_campaigns',
          date_range: dateRange
        }
      });

      if (error) throw error;
      return data.campaigns || [];
    } catch (error) {
      console.error('Failed to fetch Google Ads campaigns:', error);
      throw new Error('Failed to fetch campaign data. Please check your API credentials.');
    }
  }

  async getCampaignMetrics(campaignId: string, dateRange: { start_date: string; end_date: string }): Promise<AdCampaign> {
    try {
      const { data, error } = await supabase.functions.invoke('google-ads-integration', {
        body: {
          action: 'get_campaign_metrics',
          campaign_id: campaignId,
          date_range: dateRange
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch campaign metrics:', error);
      throw new Error('Failed to fetch campaign metrics');
    }
  }

  async importAdSpendData(startDate: string, endDate: string): Promise<void> {
    try {
      const campaigns = await this.getCampaigns({ start_date: startDate, end_date: endDate });
      
      // Store in our ad_spend_tracking table
      const adSpendData = campaigns.map(campaign => ({
        campaign_name: campaign.name,
        source: 'google_ads',
        spend_date: endDate,
        amount: campaign.cost,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        ctr: campaign.ctr,
        cpc: campaign.cpc,
        advisor_id: null, // Will be set by the calling function
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('ad_spend_tracking')
        .insert(adSpendData);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to import ad spend data:', error);
      throw new Error('Failed to import Google Ads data');
    }
  }
}

export class FacebookAdsIntegration {
  async getAdAccounts(): Promise<FacebookAdAccount[]> {
    try {
      const { data, error } = await supabase.functions.invoke('facebook-ads-integration', {
        body: {
          action: 'get_ad_accounts'
        }
      });

      if (error) throw error;
      return data.ad_accounts || [];
    } catch (error) {
      console.error('Failed to fetch Facebook ad accounts:', error);
      throw new Error('Failed to fetch Facebook ad accounts');
    }
  }

  async getCampaigns(adAccountId: string, dateRange?: { start_date: string; end_date: string }): Promise<AdCampaign[]> {
    try {
      const { data, error } = await supabase.functions.invoke('facebook-ads-integration', {
        body: {
          action: 'get_campaigns',
          ad_account_id: adAccountId,
          date_range: dateRange
        }
      });

      if (error) throw error;
      return data.campaigns || [];
    } catch (error) {
      console.error('Failed to fetch Facebook campaigns:', error);
      throw new Error('Failed to fetch Facebook campaign data');
    }
  }

  async importAdSpendData(adAccountId: string, startDate: string, endDate: string): Promise<void> {
    try {
      const campaigns = await this.getCampaigns(adAccountId, { start_date: startDate, end_date: endDate });
      
      const adSpendData = campaigns.map(campaign => ({
        campaign_name: campaign.name,
        source: 'facebook',
        spend_date: endDate,
        amount: campaign.cost,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        ctr: campaign.ctr,
        cpc: campaign.cpc,
        advisor_id: null,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('ad_spend_tracking')
        .insert(adSpendData);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to import Facebook ad spend data:', error);
      throw new Error('Failed to import Facebook Ads data');
    }
  }
}

export const googleAdsIntegration = new GoogleAdsIntegration();
export const facebookAdsIntegration = new FacebookAdsIntegration();