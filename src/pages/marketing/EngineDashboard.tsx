import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, DollarSign, Users, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RequireMarketingRole } from '@/routes/guards/RequireMarketingRole';
import { getMarketingStore } from '@/marketing/adapters';
import { MarketingCampaign, SpendSnapshot } from '@/marketing/types';
import { ChannelPerformanceCards } from '@/components/marketing/dashboard/ChannelPerformanceCards';
import { ABTestResults } from '@/components/marketing/dashboard/ABTestResults';
import { BudgetMonitor } from '@/components/marketing/dashboard/BudgetMonitor';
import { TasksPanel } from '@/components/marketing/dashboard/TasksPanel';
import { ExportButtons } from '@/components/marketing/dashboard/ExportButtons';

export function EngineDashboard() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [spendData, setSpendData] = useState<SpendSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const store = getMarketingStore();
      const [campaignsData] = await Promise.all([
        store.listCampaigns({ status: 'live' }),
      ]);
      
      setCampaigns(campaignsData);
      
      // Load spend data for active campaigns
      const allSpendData: SpendSnapshot[] = [];
      for (const campaign of campaignsData) {
        const snapshots = await store.getSpendSnapshots(campaign.id);
        allSpendData.push(...snapshots);
      }
      setSpendData(allSpendData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'live');
  const totalSpend = spendData.reduce((sum, snapshot) => sum + snapshot.metrics.spend, 0);
  const totalConversions = spendData.reduce((sum, snapshot) => sum + snapshot.metrics.conversions, 0);
  const avgROAS = spendData.length > 0 
    ? spendData.reduce((sum, snapshot) => sum + snapshot.metrics.roas, 0) / spendData.length 
    : 0;

  if (loading) {
    return (
      <RequireMarketingRole allowedRoles={['marketing_manager', 'compliance_officer', 'admin']}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </RequireMarketingRole>
    );
  }

  return (
    <RequireMarketingRole allowedRoles={['marketing_manager', 'compliance_officer', 'admin']}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Marketing Engine</h1>
            <p className="text-muted-foreground">
              Manage multi-channel campaigns with AI assistance and compliance automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/ai-marketing-engine/new">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Link>
            </Button>
            <ExportButtons />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                {campaigns.length - activeCampaigns.length} in pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                Across all channels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgROAS.toFixed(2)}x</div>
              <p className="text-xs text-muted-foreground">
                Return on ad spend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channel Performance */}
          <div className="lg:col-span-2">
            <ChannelPerformanceCards spendData={spendData} />
          </div>

          {/* Tasks & Alerts */}
          <div>
            <TasksPanel campaigns={campaigns} />
          </div>
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A/B Test Results */}
          <ABTestResults campaigns={activeCampaigns} />

          {/* Budget Monitor */}
          <BudgetMonitor campaigns={activeCampaigns} spendData={spendData} />
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.persona.replace('_', ' ')} • ${campaign.totalBudget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      campaign.status === 'live' ? 'default' :
                      campaign.status === 'paused' ? 'secondary' :
                      campaign.status === 'completed' ? 'outline' :
                      'destructive'
                    }>
                      {campaign.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/ai-marketing-engine/review/${campaign.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No campaigns yet. Create your first AI-assisted campaign!</p>
                <Button asChild className="mt-4">
                  <Link to="/admin/ai-marketing-engine/new">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Teaser */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upgrade for Advanced Features</h3>
                <p className="text-muted-foreground">
                  Access advanced A/B testing, deeper analytics, and unlimited campaigns starting at $49/month
                </p>
              </div>
              <Button variant="outline">
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireMarketingRole>
  );
}