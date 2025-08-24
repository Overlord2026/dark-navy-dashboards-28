import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Megaphone, 
  Mail, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Eye,
  MousePointer,
  Calendar,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';

const activeCampaigns = [
  {
    id: '1',
    name: 'Q4 Retirement Planning',
    type: 'email',
    status: 'active',
    sent: 1250,
    opened: 387,
    clicked: 94,
    converted: 12,
    startDate: '2024-10-01',
    endDate: '2024-12-31'
  },
  {
    id: '2',
    name: 'Estate Planning Webinar',
    type: 'multi-channel',
    status: 'active',
    sent: 850,
    opened: 298,
    clicked: 76,
    converted: 8,
    startDate: '2024-11-15',
    endDate: '2024-12-15'
  }
];

const draftCampaigns = [
  {
    id: '3',
    name: 'Tax Season Preparation',
    type: 'email',
    status: 'draft',
    targetAudience: 'High Net Worth Clients',
    scheduledDate: '2024-12-01'
  },
  {
    id: '4',
    name: 'New Year Financial Review',
    type: 'social',
    status: 'draft',
    targetAudience: 'All Contacts',
    scheduledDate: '2025-01-02'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return Mail;
    case 'social': return MessageSquare;
    case 'phone': return Phone;
    case 'multi-channel': return Megaphone;
    default: return Megaphone;
  }
};

export default function CampaignsPage() {
  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0.0';
  };

  return (
    <>
      <Helmet>
        <title>Marketing Campaigns | Outreach & Lead Generation</title>
        <meta name="description" content="Manage and track your marketing campaigns and outreach efforts" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage your marketing campaigns and outreach efforts
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-2xl font-bold">2.1K</p>
                </div>
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-2xl font-bold">31.2%</p>
                </div>
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">4.8%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeCampaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign.type);
              const openRate = calculateRate(campaign.opened, campaign.sent);
              const clickRate = calculateRate(campaign.clicked, campaign.opened);
              const conversionRate = calculateRate(campaign.converted, campaign.sent);

              return (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {campaign.type} Campaign • {campaign.startDate} - {campaign.endDate}
                          </p>
                          
                          <div className="grid grid-cols-4 gap-6 mt-4">
                            <div>
                              <p className="text-2xl font-bold">{campaign.sent.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Sent</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{campaign.opened}</p>
                              <p className="text-sm text-muted-foreground">Opened ({openRate}%)</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{campaign.clicked}</p>
                              <p className="text-sm text-muted-foreground">Clicked ({clickRate}%)</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{campaign.converted}</p>
                              <p className="text-sm text-muted-foreground">Converted ({conversionRate}%)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftCampaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign.type);

              return (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <TypeIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {campaign.type} Campaign • Target: {campaign.targetAudience}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Scheduled for: {campaign.scheduledDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Launch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-8 text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed campaigns</h3>
                <p className="text-muted-foreground">
                  Completed campaigns will appear here once they finish running.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}