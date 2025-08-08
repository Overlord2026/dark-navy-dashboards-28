import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumUpgradePrompt } from './PremiumUpgradePrompt';
import { 
  Send, 
  Calendar, 
  Target, 
  BarChart3,
  Mail,
  MessageSquare,
  Share2,
  Plus,
  Play,
  Pause,
  Settings,
  Crown
} from 'lucide-react';

interface MarketingEngineProps {
  isPremium?: boolean;
}

export const MarketingEngine: React.FC<MarketingEngineProps> = ({ isPremium = false }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Marketing Engine</CardTitle>
            <CardDescription className="text-base">
              Unlock powerful automation tools to grow your practice
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Email Campaigns</h3>
                <p className="text-sm text-muted-foreground">Automated nurture sequences</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">SMS Marketing</h3>
                <p className="text-sm text-muted-foreground">Direct client engagement</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <Share2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Social Posting</h3>
                <p className="text-sm text-muted-foreground">Scheduled content management</p>
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
            feature="Marketing Engine"
          />
        )}
      </div>
    );
  }

  const campaigns = [
    {
      id: 1,
      name: 'New Client Welcome Series',
      type: 'email',
      status: 'active',
      recipients: 47,
      openRate: '68%',
      clickRate: '24%',
      nextSend: '2024-01-20'
    },
    {
      id: 2,
      name: 'Quarterly Market Update',
      type: 'email',
      status: 'scheduled',
      recipients: 234,
      openRate: '72%',
      clickRate: '31%',
      nextSend: '2024-01-25'
    },
    {
      id: 3,
      name: 'Estate Planning Reminders',
      type: 'sms',
      status: 'active',
      recipients: 89,
      openRate: '95%',
      clickRate: '45%',
      nextSend: '2024-01-22'
    }
  ];

  const templates = [
    { name: 'High Net Worth Welcome', persona: 'HNW Client', type: 'email', engagement: '78%' },
    { name: 'Pre-Retiree Check-in', persona: 'Pre-Retiree', type: 'email', engagement: '65%' },
    { name: 'Next-Gen Education', persona: 'Next-Gen', type: 'email', engagement: '82%' },
    { name: 'Family Office Update', persona: 'Family Admin', type: 'email', engagement: '71%' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      active: 'default',
      scheduled: 'secondary',
      paused: 'outline',
      completed: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      social: Share2
    };
    const IconComponent = icons[type as keyof typeof icons];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {campaign.recipients} recipients • Next: {new Date(campaign.nextSend).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-semibold">{campaign.openRate}</div>
                        <div className="text-xs text-muted-foreground">Open Rate</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold">{campaign.clickRate}</div>
                        <div className="text-xs text-muted-foreground">Click Rate</div>
                      </div>

                      {getStatusBadge(campaign.status)}

                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Campaign Templates by Persona</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline">{template.persona}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {template.type}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {template.engagement}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Engagement
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Automated Workflows</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Automation
            </Button>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Lead Follow-up</CardTitle>
                <CardDescription>
                  Automatically send welcome series when new leads are added
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      47 leads processed this month
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Anniversary Outreach</CardTitle>
                <CardDescription>
                  Send personalized messages on client anniversaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      12 anniversaries this month
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Marketing Performance</h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Total Sends</div>
                <div className="text-xs text-green-600">+12% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">71%</div>
                <div className="text-sm text-muted-foreground">Open Rate</div>
                <div className="text-xs text-green-600">+3% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">28%</div>
                <div className="text-sm text-muted-foreground">Click Rate</div>
                <div className="text-xs text-green-600">+5% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">340%</div>
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className="text-xs text-green-600">+15% from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mr-2" />
                Interactive charts would be rendered here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};