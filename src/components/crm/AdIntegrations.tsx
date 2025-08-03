import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users,
  RefreshCw,
  Settings,
  Plus,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdAccount {
  id: string;
  platform: 'facebook' | 'google';
  account_id: string;
  account_name: string;
  access_token: string;
  refresh_token?: string;
  is_active: boolean;
  last_sync: string;
  created_at: string;
}

interface AdCampaignData {
  id: string;
  platform: 'facebook' | 'google';
  campaign_id: string;
  campaign_name: string;
  status: 'active' | 'paused' | 'ended';
  budget_daily: number;
  spend_today: number;
  spend_total: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  cost_per_lead: number;
  cost_per_conversion: number;
  last_updated: string;
}

interface LeadAttribution {
  lead_id: string;
  platform: 'facebook' | 'google';
  campaign_id: string;
  campaign_name: string;
  ad_set_id?: string;
  ad_id?: string;
  cost_attribution: number;
  click_id?: string;
  conversion_type: string;
  attribution_window: number;
  created_at: string;
}

export function AdIntegrations() {
  const { toast } = useToast();
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [campaignData, setCampaignData] = useState<AdCampaignData[]>([]);
  const [leadAttributions, setLeadAttributions] = useState<LeadAttribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'google'>('facebook');

  useEffect(() => {
    loadAdAccounts();
    loadCampaignData();
    loadLeadAttributions();
  }, []);

  const loadAdAccounts = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdAccounts(data || []);
    } catch (error) {
      console.error('Error loading ad accounts:', error);
      // Mock data for demo
      setAdAccounts([
        {
          id: '1',
          platform: 'facebook',
          account_id: 'act_123456789',
          account_name: 'Financial Advisor Facebook Ads',
          access_token: 'mock_token',
          is_active: true,
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'google',
          account_id: '123-456-7890',
          account_name: 'Google Ads Account',
          access_token: 'mock_token',
          is_active: true,
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const loadCampaignData = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_campaign_data')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setCampaignData(data || []);
    } catch (error) {
      console.error('Error loading campaign data:', error);
      // Mock data for demo
      setCampaignData([
        {
          id: '1',
          platform: 'facebook',
          campaign_id: 'camp_123',
          campaign_name: 'Retirement Planning Lead Gen',
          status: 'active',
          budget_daily: 100,
          spend_today: 87.50,
          spend_total: 2450.75,
          impressions: 12500,
          clicks: 450,
          leads: 23,
          conversions: 8,
          cost_per_lead: 106.55,
          cost_per_conversion: 306.34,
          last_updated: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'google',
          campaign_id: 'camp_456',
          campaign_name: 'Investment Advisory Search',
          status: 'active',
          budget_daily: 150,
          spend_today: 142.30,
          spend_total: 4250.90,
          impressions: 8900,
          clicks: 321,
          leads: 31,
          conversions: 12,
          cost_per_lead: 137.12,
          cost_per_conversion: 354.24,
          last_updated: new Date().toISOString()
        }
      ]);
    }
  };

  const loadLeadAttributions = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_attributions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeadAttributions(data || []);
    } catch (error) {
      console.error('Error loading lead attributions:', error);
      // Mock data for demo
      setLeadAttributions([
        {
          lead_id: 'lead_123',
          platform: 'facebook',
          campaign_id: 'camp_123',
          campaign_name: 'Retirement Planning Lead Gen',
          ad_set_id: 'adset_789',
          ad_id: 'ad_101',
          cost_attribution: 106.55,
          click_id: 'fb_click_123',
          conversion_type: 'lead_form_submit',
          attribution_window: 7,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const connectAdAccount = async () => {
    try {
      setLoading(true);
      
      // Initiate OAuth flow for the selected platform
      const { data } = await supabase.functions.invoke('connect-ad-platform', {
        body: { 
          platform: selectedPlatform,
          return_url: window.location.origin + '/crm'
        }
      });
      
      if (data?.auth_url) {
        // Open OAuth popup
        const popup = window.open(
          data.auth_url, 
          'ad_auth', 
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for OAuth completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            loadAdAccounts(); // Refresh accounts
            setIsConnectOpen(false);
            toast({
              title: "Account Connected",
              description: `${selectedPlatform} ad account connected successfully`,
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting ad account:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect ad account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncCampaignData = async (accountId: string) => {
    try {
      setLoading(true);
      
      await supabase.functions.invoke('sync-ad-data', {
        body: { account_id: accountId }
      });
      
      await loadCampaignData();
      await loadLeadAttributions();
      
      toast({
        title: "Data Synced",
        description: "Campaign data has been updated",
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync campaign data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const trackLeadAttribution = async (leadId: string, clickId: string, platform: 'facebook' | 'google') => {
    try {
      await supabase.functions.invoke('track-lead-attribution', {
        body: {
          lead_id: leadId,
          click_id: clickId,
          platform: platform
        }
      });
    } catch (error) {
      console.error('Error tracking lead attribution:', error);
    }
  };

  const getTotalSpend = () => {
    return campaignData.reduce((total, campaign) => total + campaign.spend_total, 0);
  };

  const getTotalLeads = () => {
    return campaignData.reduce((total, campaign) => total + campaign.leads, 0);
  };

  const getAverageCPL = () => {
    const totalSpend = getTotalSpend();
    const totalLeads = getTotalLeads();
    return totalLeads > 0 ? totalSpend / totalLeads : 0;
  };

  const getTotalConversions = () => {
    return campaignData.reduce((total, campaign) => total + campaign.conversions, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'facebook' ? '📘' : '🔍';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ad Platform Integrations</h2>
          <p className="text-muted-foreground">
            Track real-time lead attribution and campaign performance
          </p>
        </div>
        
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Ad Account
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Spend</div>
            </div>
            <div className="text-2xl font-bold">${getTotalSpend().toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
            <div className="text-2xl font-bold">{getTotalLeads()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Avg Cost/Lead</div>
            </div>
            <div className="text-2xl font-bold">${getAverageCPL().toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Conversions</div>
            </div>
            <div className="text-2xl font-bold">{getTotalConversions()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Ad Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getPlatformIcon(account.platform)}</div>
                  <div>
                    <h3 className="font-medium">{account.account_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {account.account_id} • Last sync: {new Date(account.last_sync).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => syncCampaignData(account.id)}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                </div>
              </div>
            ))}
            
            {adAccounts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No ad accounts connected</p>
                <p className="text-sm">Connect your Facebook or Google Ads accounts to track campaign performance</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignData.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{getPlatformIcon(campaign.platform)}</div>
                    <div>
                      <h3 className="font-medium">{campaign.campaign_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Daily Budget: ${campaign.budget_daily} • Spent Today: ${campaign.spend_today}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-lg">{campaign.impressions.toLocaleString()}</div>
                    <div className="text-muted-foreground">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{campaign.clicks}</div>
                    <div className="text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{campaign.leads}</div>
                    <div className="text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{campaign.conversions}</div>
                    <div className="text-muted-foreground">Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">${campaign.cost_per_lead.toFixed(2)}</div>
                    <div className="text-muted-foreground">Cost/Lead</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">${campaign.cost_per_conversion.toFixed(2)}</div>
                    <div className="text-muted-foreground">Cost/Conv</div>
                  </div>
                </div>
              </div>
            ))}
            
            {campaignData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No campaign data available</p>
                <p className="text-sm">Connect your ad accounts and sync data to see campaign performance</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Lead Attributions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lead Attributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leadAttributions.slice(0, 10).map((attribution) => (
              <div key={attribution.lead_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg">{getPlatformIcon(attribution.platform)}</div>
                  <div>
                    <p className="font-medium">Lead #{attribution.lead_id.slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">{attribution.campaign_name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">${attribution.cost_attribution.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{attribution.conversion_type}</div>
                </div>
              </div>
            ))}
            
            {leadAttributions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lead attributions yet</p>
                <p className="text-sm">Lead attribution data will appear here as leads are tracked</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connect Account Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Ad Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Select Platform</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`p-4 border rounded-lg text-center hover:bg-muted ${
                  selectedPlatform === 'facebook' ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedPlatform('facebook')}
              >
                <div className="text-2xl mb-2">📘</div>
                <div className="font-medium">Facebook Ads</div>
                <div className="text-sm text-muted-foreground">Connect Facebook Ad Account</div>
              </button>
              
              <button
                className={`p-4 border rounded-lg text-center hover:bg-muted ${
                  selectedPlatform === 'google' ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedPlatform('google')}
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-medium">Google Ads</div>
                <div className="text-sm text-muted-foreground">Connect Google Ads Account</div>
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConnectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={connectAdAccount} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect {selectedPlatform === 'facebook' ? 'Facebook' : 'Google'} Ads
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}