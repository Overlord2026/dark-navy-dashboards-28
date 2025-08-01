import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  FileText, 
  Star,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EngagementMetrics {
  totalClients: number;
  completedReturns: number;
  engagementRate: number;
  upsellConversions: number;
}

interface FamilyOfficeUpsell {
  id: string;
  client_user_id: string;
  upsell_type: string;
  status: string;
  presented_at: string;
  clicked_at?: string;
  converted_at?: string;
  conversion_value?: number;
  client_name?: string;
}

export function ClientEngagementCenter() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    totalClients: 0,
    completedReturns: 0,
    engagementRate: 0,
    upsellConversions: 0
  });
  const [upsells, setUpsells] = useState<FamilyOfficeUpsell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchUpsells();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Get current CPA partner
      const { data: cpaPartner } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!cpaPartner) return;

      // Fetch metrics
      const [clientsResult, completedResult, engagementResult, upsellResult] = await Promise.all([
        supabase
          .from('cpa_client_onboarding')
          .select('id')
          .eq('cpa_partner_id', cpaPartner.id),
        
        supabase
          .from('cpa_client_onboarding')
          .select('id')
          .eq('cpa_partner_id', cpaPartner.id)
          .eq('onboarding_stage', 'completed'),
        
        supabase
          .from('client_engagement_history')
          .select('id, status')
          .eq('cpa_partner_id', cpaPartner.id),
        
        supabase
          .from('family_office_upsells')
          .select('id, status')
          .eq('cpa_partner_id', cpaPartner.id)
          .eq('status', 'converted')
      ]);

      const engagementRate = engagementResult.data 
        ? (engagementResult.data.filter(e => e.status === 'opened' || e.status === 'clicked').length / engagementResult.data.length) * 100
        : 0;

      setMetrics({
        totalClients: clientsResult.data?.length || 0,
        completedReturns: completedResult.data?.length || 0,
        engagementRate: Math.round(engagementRate),
        upsellConversions: upsellResult.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchUpsells = async () => {
    try {
      const { data: cpaPartner } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!cpaPartner) return;

      // First get upsells
      const { data: upsellsData, error } = await supabase
        .from('family_office_upsells')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('presented_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Then get client names separately
      const formattedUpsells = [];
      if (upsellsData) {
        for (const upsell of upsellsData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', upsell.client_user_id)
            .single();
          
          formattedUpsells.push({
            ...upsell,
            client_name: profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Client'
              : 'Unknown Client'
          });
        }
      }

      setUpsells(formattedUpsells);
    } catch (error) {
      console.error('Error fetching upsells:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFamilyOfficeUpsell = async (clientId: string) => {
    try {
      const { data: cpaPartner } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!cpaPartner) return;

      // Call the engagement automation edge function
      const { data, error } = await supabase.functions.invoke('engagement-automation', {
        body: {
          type: 'upsell_prompt',
          clientId,
          cpaPartnerId: cpaPartner.id,
          content: {
            upgradeUrl: `${window.location.origin}/family-office-upgrade`,
            promotionDetails: {
              discount: '50% off setup fees',
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        }
      });

      if (error) throw error;

      // Track the upsell presentation
      await supabase.from('family_office_upsells').insert({
        client_user_id: clientId,
        cpa_partner_id: cpaPartner.id,
        upsell_type: 'dashboard_access',
        presentation_context: 'manual_trigger',
        status: 'presented'
      });

      toast.success('Family Office upsell sent successfully!');
      fetchUpsells();
    } catch (error) {
      console.error('Error triggering upsell:', error);
      toast.error('Failed to send upsell');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'presented': return 'bg-gray-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const formatUpsellType = (type: string) => {
    const types: Record<string, string> = {
      dashboard_access: 'Family Office Dashboard',
      premium_planning: 'Premium Planning Services',
      wealth_management: 'Wealth Management',
      estate_planning: 'Estate Planning'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Client Engagement & Upsell Center</h2>
        <p className="text-muted-foreground">
          Drive client engagement and expand your service offerings
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active client relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Returns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedReturns}</div>
            <p className="text-xs text-muted-foreground">
              Ready for upsell
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              Email open/click rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upsell Conversions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upsellConversions}</div>
            <p className="text-xs text-muted-foreground">
              Successful upgrades
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upsells" className="w-full">
        <TabsList>
          <TabsTrigger value="upsells">Family Office Upsells</TabsTrigger>
          <TabsTrigger value="automation">Automation Settings</TabsTrigger>
          <TabsTrigger value="analytics">Engagement Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upsells" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Family Office Upsells</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  Trigger Upsell
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Family Office Upsell</DialogTitle>
                  <DialogDescription>
                    Select a client to send a personalized Family Office upgrade invitation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will send an email highlighting the benefits of upgrading to our Family Office platform,
                    including wealth management tools, estate planning, and dedicated advisory services.
                  </p>
                  <Button onClick={() => toast.info('Client selection UI would be implemented here')}>
                    Select Client & Send
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {upsells.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upsells Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start engaging your clients with Family Office upgrade opportunities
                  </p>
                  <Button>
                    <Target className="h-4 w-4 mr-2" />
                    Send First Upsell
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upsells.map((upsell) => (
                <Card key={upsell.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(upsell.status)}`} />
                      <div>
                        <h4 className="font-semibold">{upsell.client_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatUpsellType(upsell.upsell_type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        upsell.status === 'converted' ? 'default' :
                        upsell.status === 'clicked' ? 'secondary' : 'outline'
                      }>
                        {upsell.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(upsell.presented_at).toLocaleDateString()}
                        </p>
                        {upsell.conversion_value && (
                          <p className="text-sm text-green-600">
                            +${upsell.conversion_value.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {upsell.status === 'converted' && (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Set up automatic triggers for client engagement and upsells
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Tax Completion Triggers</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically send planning guides and Family Office invitations when tax returns are completed
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Edit Templates
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Set Delays
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Planning Guide Distribution</h4>
                  <Badge variant="outline">Inactive</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Send personalized planning guides based on client profiles and needs
                </p>
                <Button variant="outline" size="sm">
                  Configure Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Open Rate</span>
                    <span className="font-semibold">{metrics.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Click-through Rate</span>
                    <span className="font-semibold">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Upsell Revenue (YTD)</span>
                    <span className="font-semibold text-green-600">$24,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Upsell Value</span>
                    <span className="font-semibold">$4,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI on Campaigns</span>
                    <span className="font-semibold text-green-600">320%</span>
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