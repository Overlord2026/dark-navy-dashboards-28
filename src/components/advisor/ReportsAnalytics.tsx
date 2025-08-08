import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumUpgradePrompt } from './PremiumUpgradePrompt';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  Calendar,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';

interface ReportsAnalyticsProps {
  isPremium?: boolean;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ isPremium = false }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Reports & Analytics</CardTitle>
            <CardDescription className="text-base">
              Advanced performance metrics and business intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Growth Analytics</h3>
                <p className="text-sm text-muted-foreground">Client acquisition and retention metrics</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Conversion Tracking</h3>
                <p className="text-sm text-muted-foreground">Lead-to-client conversion analysis</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">ROI Reports</h3>
                <p className="text-sm text-muted-foreground">Marketing spend and return analysis</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowUpgrade(true)} 
              size="lg" 
              className="w-full md:w-auto"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
        
        {showUpgrade && (
          <PremiumUpgradePrompt 
            isOpen={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            feature="Reports & Analytics"
          />
        )}
      </div>
    );
  }

  const kpiData = [
    {
      title: 'Client Growth',
      value: '+24%',
      change: '+12%',
      period: 'vs last quarter',
      trend: 'up',
      icon: Users
    },
    {
      title: 'AUM Growth',
      value: '+18%',
      change: '+8%',
      period: 'vs last quarter',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Conversion Rate',
      value: '18%',
      change: '+3%',
      period: 'vs last month',
      trend: 'up',
      icon: Target
    },
    {
      title: 'Marketing ROI',
      value: '340%',
      change: '+15%',
      period: 'vs last quarter',
      trend: 'up',
      icon: DollarSign
    }
  ];

  const conversionData = [
    { stage: 'Leads Generated', count: 247, percentage: 100, change: '+12%' },
    { stage: 'Qualified Prospects', count: 156, percentage: 63, change: '+8%' },
    { stage: 'Meetings Scheduled', count: 98, percentage: 40, change: '+15%' },
    { stage: 'Proposals Sent', count: 67, percentage: 27, change: '+22%' },
    { stage: 'Clients Acquired', count: 44, percentage: 18, change: '+18%' }
  ];

  const marketingCampaigns = [
    {
      name: 'Estate Planning Webinar',
      type: 'Email Campaign',
      sent: 1247,
      opened: 892,
      clicked: 234,
      converted: 12,
      roi: '285%',
      cost: '$1,200'
    },
    {
      name: 'Retirement Planning Guide',
      type: 'Social Media',
      sent: 2156,
      opened: 1567,
      clicked: 445,
      converted: 18,
      roi: '420%',
      cost: '$800'
    },
    {
      name: 'Tax Planning Workshop',
      type: 'Direct Mail',
      sent: 500,
      opened: 425,
      clicked: 89,
      converted: 8,
      roi: '160%',
      cost: '$2,400'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  {getTrendIcon(kpi.trend)}
                </div>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="text-sm text-muted-foreground">{kpi.title}</div>
                <div className={`text-xs font-medium ${getTrendColor(kpi.trend)}`}>
                  {kpi.change} {kpi.period}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="growth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ROI</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Growth Analytics</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition Trend</CardTitle>
                <CardDescription>Monthly new client growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Interactive growth chart would be rendered here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AUM Growth</CardTitle>
                <CardDescription>Assets under management over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mr-2" />
                  Interactive AUM chart would be rendered here
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Client Segmentation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">67</div>
                  <div className="text-sm text-muted-foreground">High Net Worth</div>
                  <div className="text-xs text-green-600">+15% this quarter</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">134</div>
                  <div className="text-sm text-muted-foreground">Pre-Retirees</div>
                  <div className="text-xs text-green-600">+22% this quarter</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-sm text-muted-foreground">Next-Gen</div>
                  <div className="text-xs text-green-600">+35% this quarter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lead-to-Client Conversion Funnel</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 Days
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {conversionData.map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div 
                          className="h-6 bg-primary rounded" 
                          style={{ width: `${stage.percentage}%` }}
                        />
                        <span className="text-sm font-medium">{stage.percentage}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{stage.count}</div>
                      <div className="text-xs text-green-600">{stage.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">18%</div>
                <div className="text-sm text-muted-foreground">Overall Conversion Rate</div>
                <div className="text-xs text-green-600">+3% vs last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">14 days</div>
                <div className="text-sm text-muted-foreground">Avg Sales Cycle</div>
                <div className="text-xs text-green-600">-2 days vs last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">$125K</div>
                <div className="text-sm text-muted-foreground">Avg Client Value</div>
                <div className="text-xs text-green-600">+8% vs last month</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Marketing Campaign Performance</h3>
            <Button className="gap-2">
              <Target className="h-4 w-4" />
              New Campaign
            </Button>
          </div>

          <div className="grid gap-4">
            {marketingCampaigns.map((campaign, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{campaign.roi}</div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{campaign.sent.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{campaign.opened.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Opened</div>
                      <div className="text-xs text-green-600">
                        {Math.round((campaign.opened / campaign.sent) * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{campaign.clicked.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Clicked</div>
                      <div className="text-xs text-green-600">
                        {Math.round((campaign.clicked / campaign.opened) * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{campaign.converted}</div>
                      <div className="text-xs text-muted-foreground">Converted</div>
                      <div className="text-xs text-green-600">
                        {Math.round((campaign.converted / campaign.clicked) * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{campaign.cost}</div>
                      <div className="text-xs text-muted-foreground">Cost</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Custom Report Builder</h3>
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Create Report
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Your frequently used reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Monthly Performance Summary</div>
                    <div className="text-sm text-muted-foreground">Last run: 2 days ago</div>
                  </div>
                  <Button size="sm" variant="outline">Run</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Client Acquisition Report</div>
                    <div className="text-sm text-muted-foreground">Last run: 1 week ago</div>
                  </div>
                  <Button size="sm" variant="outline">Run</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Marketing ROI Analysis</div>
                    <div className="text-sm text-muted-foreground">Last run: 3 days ago</div>
                  </div>
                  <Button size="sm" variant="outline">Run</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Generate insights instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Export Client List
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Generate Performance Dashboard
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Target className="h-4 w-4" />
                  Campaign Analysis Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Growth Trend Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};