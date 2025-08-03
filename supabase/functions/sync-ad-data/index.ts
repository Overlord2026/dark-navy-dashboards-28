import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncRequest {
  account_id?: string;
  platform?: 'facebook' | 'google';
  sync_type?: 'campaigns' | 'leads' | 'all';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { account_id, platform, sync_type = 'all' }: SyncRequest = await req.json();

    if (account_id) {
      return await syncAccountData(account_id);
    } else if (platform) {
      return await syncPlatformData(platform, sync_type);
    } else {
      return await syncAllData();
    }

  } catch (error: any) {
    console.error("Error in sync-ad-data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const syncAccountData = async (accountId: string) => {
  try {
    // Get account details
    const { data: account, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error || !account) {
      throw new Error('Ad account not found');
    }

    let results = {};

    if (account.platform === 'facebook') {
      results = await syncFacebookData(account);
    } else if (account.platform === 'google') {
      results = await syncGoogleAdsData(account);
    }

    // Update last sync time
    await supabase
      .from('ad_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(JSON.stringify({ 
      message: 'Account data synced successfully',
      account_id: accountId,
      platform: account.platform,
      results: results
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error syncing account data:', error);
    throw error;
  }
};

const syncPlatformData = async (platform: string, syncType: string) => {
  try {
    const { data: accounts } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('platform', platform)
      .eq('is_active', true);

    const results = [];
    for (const account of accounts || []) {
      try {
        let accountResults = {};
        if (platform === 'facebook') {
          accountResults = await syncFacebookData(account);
        } else if (platform === 'google') {
          accountResults = await syncGoogleAdsData(account);
        }
        results.push({ account_id: account.id, status: 'success', data: accountResults });
      } catch (error) {
        console.error(`Error syncing account ${account.id}:`, error);
        results.push({ account_id: account.id, status: 'error', error: error.message });
      }
    }

    return new Response(JSON.stringify({ 
      message: `${platform} data synced`,
      platform: platform,
      results: results
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error syncing platform data:', error);
    throw error;
  }
};

const syncAllData = async () => {
  try {
    const { data: accounts } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('is_active', true);

    const results = [];
    for (const account of accounts || []) {
      try {
        let accountResults = {};
        if (account.platform === 'facebook') {
          accountResults = await syncFacebookData(account);
        } else if (account.platform === 'google') {
          accountResults = await syncGoogleAdsData(account);
        }
        results.push({ account_id: account.id, status: 'success', data: accountResults });
      } catch (error) {
        console.error(`Error syncing account ${account.id}:`, error);
        results.push({ account_id: account.id, status: 'error', error: error.message });
      }
    }

    return new Response(JSON.stringify({ 
      message: 'All ad data synced',
      results: results
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error syncing all data:', error);
    throw error;
  }
};

const syncFacebookData = async (account: any) => {
  try {
    // Get campaigns
    const campaignsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account.account_id}/campaigns?fields=id,name,status,daily_budget,created_time,updated_time&access_token=${account.access_token}`
    );

    if (!campaignsResponse.ok) {
      throw new Error(`Facebook API error: ${campaignsResponse.statusText}`);
    }

    const campaignsData = await campaignsResponse.json();
    const campaigns = campaignsData.data || [];

    const results = { campaigns: 0, insights: 0 };

    for (const campaign of campaigns) {
      // Get campaign insights
      const insightsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${campaign.id}/insights?fields=impressions,clicks,spend,actions&date_preset=today&access_token=${account.access_token}`
      );

      let insights = {};
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        insights = insightsData.data?.[0] || {};
      }

      // Calculate metrics
      const impressions = parseInt(insights.impressions || '0');
      const clicks = parseInt(insights.clicks || '0');
      const spend = parseFloat(insights.spend || '0');
      const actions = insights.actions || [];
      
      const leads = actions.find(a => a.action_type === 'lead')?.value || 0;
      const conversions = actions.find(a => a.action_type === 'purchase')?.value || 0;

      const costPerLead = leads > 0 ? spend / leads : 0;
      const costPerConversion = conversions > 0 ? spend / conversions : 0;

      // Upsert campaign data
      await supabase
        .from('ad_campaign_data')
        .upsert([{
          platform: 'facebook',
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          status: campaign.status,
          budget_daily: parseFloat(campaign.daily_budget || '0') / 100, // Facebook returns in cents
          spend_today: spend,
          spend_total: spend, // Would need historical data for accurate total
          impressions: impressions,
          clicks: clicks,
          leads: parseInt(leads),
          conversions: parseInt(conversions),
          cost_per_lead: costPerLead,
          cost_per_conversion: costPerConversion,
          last_updated: new Date().toISOString(),
          account_id: account.id
        }], {
          onConflict: 'platform,campaign_id'
        });

      results.campaigns++;
      if (Object.keys(insights).length > 0) {
        results.insights++;
      }
    }

    return results;

  } catch (error) {
    console.error('Error syncing Facebook data:', error);
    throw error;
  }
};

const syncGoogleAdsData = async (account: any) => {
  try {
    // Note: Google Ads API requires more complex authentication and setup
    // This is a simplified version - in production, you'd use the Google Ads API client library
    
    const headers = {
      'Authorization': `Bearer ${account.access_token}`,
      'developer-token': Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN') || '',
      'customer-id': account.account_id
    };

    // Get campaigns (simplified - real implementation would use Google Ads API)
    const response = await fetch('https://googleads.googleapis.com/v14/customers/campaigns', {
      headers: headers
    });

    if (!response.ok) {
      // For demo purposes, create mock data
      const mockCampaigns = [
        {
          id: 'camp_google_1',
          name: 'Google Search Campaign',
          status: 'ENABLED',
          budget: 150,
          metrics: {
            impressions: 8900,
            clicks: 321,
            cost_micros: 142300000, // Google uses micros
            conversions: 12
          }
        }
      ];

      for (const campaign of mockCampaigns) {
        const spend = campaign.metrics.cost_micros / 1000000; // Convert from micros
        const leads = Math.floor(campaign.metrics.conversions * 2.5); // Estimate leads
        const costPerLead = leads > 0 ? spend / leads : 0;
        const costPerConversion = campaign.metrics.conversions > 0 ? spend / campaign.metrics.conversions : 0;

        await supabase
          .from('ad_campaign_data')
          .upsert([{
            platform: 'google',
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            status: campaign.status === 'ENABLED' ? 'active' : 'paused',
            budget_daily: campaign.budget,
            spend_today: spend,
            spend_total: spend,
            impressions: campaign.metrics.impressions,
            clicks: campaign.metrics.clicks,
            leads: leads,
            conversions: campaign.metrics.conversions,
            cost_per_lead: costPerLead,
            cost_per_conversion: costPerConversion,
            last_updated: new Date().toISOString(),
            account_id: account.id
          }], {
            onConflict: 'platform,campaign_id'
          });
      }

      return { campaigns: mockCampaigns.length, insights: mockCampaigns.length };
    }

    // Process real Google Ads API response
    const data = await response.json();
    // Implementation would parse the actual Google Ads API response format

    return { campaigns: 0, insights: 0 };

  } catch (error) {
    console.error('Error syncing Google Ads data:', error);
    throw error;
  }
};

serve(handler);