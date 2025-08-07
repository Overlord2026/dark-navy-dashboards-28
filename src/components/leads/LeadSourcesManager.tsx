import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Users, 
  Mail, 
  Phone, 
  Linkedin, 
  Facebook, 
  Search,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Target,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LeadSource {
  id: string;
  name: string;
  type: 'website' | 'social' | 'referral' | 'email' | 'phone' | 'event' | 'advertising';
  status: 'active' | 'paused' | 'inactive';
  leads_count: number;
  conversion_rate: number;
  cost_per_lead: number;
  last_lead_at: string;
  setup_complete: boolean;
  config: any;
}

interface CampaignPerformance {
  source: string;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  spend: number;
  roi: number;
}

export function LeadSourcesManager() {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  useEffect(() => {
    loadLeadSources();
    loadCampaignPerformance();
  }, []);

  const loadLeadSources = async () => {
    setLoading(true);
    try {
      // Mock data with realistic lead sources
      const mockSources: LeadSource[] = [
        {
          id: '1',
          name: 'Company Website',
          type: 'website',
          status: 'active',
          leads_count: 45,
          conversion_rate: 15.5,
          cost_per_lead: 0,
          last_lead_at: new Date().toISOString(),
          setup_complete: true,
          config: { tracking_enabled: true }
        },
        {
          id: '2',
          name: 'LinkedIn Ads',
          type: 'social',
          status: 'active',
          leads_count: 23,
          conversion_rate: 22.3,
          cost_per_lead: 85.50,
          last_lead_at: new Date(Date.now() - 3600000).toISOString(),
          setup_complete: true,
          config: { campaign_id: 'LI_123456' }
        },
        {
          id: '3',
          name: 'Google Ads',
          type: 'advertising',
          status: 'active',
          leads_count: 38,
          conversion_rate: 12.8,
          cost_per_lead: 125.75,
          last_lead_at: new Date(Date.now() - 1800000).toISOString(),
          setup_complete: true,
          config: { campaign_id: 'GGL_789012' }
        },
        {
          id: '4',
          name: 'Client Referrals',
          type: 'referral',
          status: 'active',
          leads_count: 18,
          conversion_rate: 45.6,
          cost_per_lead: 0,
          last_lead_at: new Date(Date.now() - 7200000).toISOString(),
          setup_complete: true,
          config: { referral_program: true }
        },
        {
          id: '5',
          name: 'Email Campaigns',
          type: 'email',
          status: 'paused',
          leads_count: 12,
          conversion_rate: 8.4,
          cost_per_lead: 45.25,
          last_lead_at: new Date(Date.now() - 86400000).toISOString(),
          setup_complete: false,
          config: { integration_needed: true }
        }
      ];

      setLeadSources(mockSources);
    } catch (error) {
      console.error('Error loading lead sources:', error);
      toast.error('Failed to load lead sources');
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignPerformance = async () => {
    try {
      // Mock campaign performance data
      const mockCampaigns: CampaignPerformance[] = [
        {
          source: 'LinkedIn Ads',
          impressions: 15420,
          clicks: 324,
          leads: 23,
          conversions: 5,
          spend: 1965.50,
          roi: 285.2
        },
        {
          source: 'Google Ads',
          impressions: 28750,
          clicks: 892,
          leads: 38,
          conversions: 8,
          spend: 4779.00,
          roi: 167.8
        },
        {
          source: 'Facebook Ads',
          impressions: 9850,
          clicks: 156,
          leads: 11,
          conversions: 2,
          spend: 875.25,
          roi: 134.5
        }
      ];

      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error loading campaign performance:', error);
    }
  };

  const syncLeadSources = async () => {
    setSyncStatus('syncing');
    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data
      await loadLeadSources();
      await loadCampaignPerformance();
      
      setSyncStatus('idle');
      toast.success('Lead sources synced successfully');
    } catch (error) {
      setSyncStatus('error');
      toast.error('Failed to sync lead sources');
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'social': return <Linkedin className="h-4 w-4" />;
      case 'advertising': return <Search className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'paused': return 'bg-warning/10 text-warning border-warning/20';
      case 'inactive': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredSources = selectedSource === 'all' 
    ? leadSources 
    : leadSources.filter(source => source.type === selectedSource);

  const totalLeads = leadSources.reduce((sum, source) => sum + source.leads_count, 0);
  const avgConversionRate = leadSources.reduce((sum, source) => sum + source.conversion_rate, 0) / leadSources.length;
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Sources & Performance</h2>
          <p className="text-muted-foreground">
            Track and optimize all your lead generation channels
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={syncLeadSources} 
            disabled={syncStatus === 'syncing'}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Sources'}
          </Button>
          
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Sources
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sources</p>
                <p className="text-2xl font-bold">{leadSources.filter(s => s.status === 'active').length}</p>
              </div>
              <Target className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="advertising">Advertising</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sources List */}
          <div className="grid gap-4">
            {filteredSources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{source.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(source.status)}
                          >
                            {source.status}
                          </Badge>
                          {!source.setup_complete && (
                            <Badge variant="outline" className="border-warning text-warning">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Setup Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Leads</p>
                        <p className="font-semibold">{source.leads_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p className="font-semibold">{source.conversion_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost/Lead</p>
                        <p className="font-semibold">
                          {source.cost_per_lead === 0 ? 'Free' : `$${source.cost_per_lead}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Lead</p>
                        <p className="font-semibold">
                          {new Date(source.last_lead_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for conversion rate */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Conversion Rate</span>
                      <span>{source.conversion_rate}%</span>
                    </div>
                    <Progress value={source.conversion_rate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{campaign.source}</h4>
                      <Badge 
                        variant="outline" 
                        className={campaign.roi > 150 ? 'border-success text-success' : 'border-warning text-warning'}
                      >
                        ROI: {campaign.roi}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-semibold">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Leads</p>
                        <p className="font-semibold">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-semibold">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spend</p>
                        <p className="font-semibold">${campaign.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-semibold">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(source.type)}
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {source.leads_count} leads
                        </span>
                        <Progress 
                          value={source.conversion_rate} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm font-medium w-12">
                          {source.conversion_rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Advanced analytics available in Premium</p>
                    <Button variant="outline" className="mt-2">
                      Upgrade for Full Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}