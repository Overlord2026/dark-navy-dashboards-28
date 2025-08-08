import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  Send,
  Plus,
  BarChart3,
  Users,
  FileText
} from 'lucide-react';

interface CPAMarketingEngineProps {
  isPremium?: boolean;
}

export const CPAMarketingEngine: React.FC<CPAMarketingEngineProps> = ({ isPremium }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const campaignTemplates = [
    {
      id: 'tax-deadline',
      title: 'Tax Deadline Reminders',
      description: 'Automated reminders for key tax deadlines',
      type: 'Email + SMS',
      audience: 'All Clients',
      timing: '2 weeks before deadlines'
    },
    {
      id: 'year-end-planning',
      title: 'Year-End Tax Planning',
      description: 'Strategic planning outreach for Q4',
      type: 'Email Series',
      audience: 'High-Value Clients',
      timing: 'October - December'
    },
    {
      id: 'new-client-welcome',
      title: 'New Client Welcome Series',
      description: 'Onboarding sequence for new clients',
      type: 'Email + Call',
      audience: 'New Clients',
      timing: 'Upon signup'
    },
    {
      id: 'quarterly-check-in',
      title: 'Quarterly Business Check-ins',
      description: 'Regular touchpoints with business clients',
      type: 'Email + Meeting',
      audience: 'Business Clients',
      timing: 'Quarterly'
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      name: 'Q1 Tax Deadline Reminders',
      type: 'Email + SMS',
      status: 'Active',
      sent: 247,
      opened: 189,
      clicked: 67,
      responses: 23
    },
    {
      id: 2,
      name: 'Extension Deadline Alerts',
      type: 'Email',
      status: 'Scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      responses: 0
    }
  ];

  const upcomingDeadlines = [
    { date: '2024-03-15', description: 'Q4 Corporate Tax Returns', clients: 23 },
    { date: '2024-04-15', description: 'Individual Tax Returns', clients: 156 },
    { date: '2024-05-15', description: 'Partnership Tax Returns', clients: 34 },
    { date: '2024-06-15', description: 'Extended Individual Returns', clients: 45 }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="deadlines">Tax Deadlines</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Campaigns</h3>
              <p className="text-muted-foreground">Monitor and manage your client outreach campaigns</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>

          <div className="grid gap-4">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>{campaign.type}</CardDescription>
                    </div>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{campaign.sent}</div>
                      <div className="text-sm text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{campaign.opened}</div>
                      <div className="text-sm text-muted-foreground">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{campaign.clicked}</div>
                      <div className="text-sm text-muted-foreground">Clicked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{campaign.responses}</div>
                      <div className="text-sm text-muted-foreground">Responses</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                    {campaign.status === 'Scheduled' && (
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Campaign Templates</h3>
              <p className="text-muted-foreground">Pre-built templates for common CPA marketing scenarios</p>
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Custom Template
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {campaignTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Type</div>
                        <div className="font-medium">{template.type}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Audience</div>
                        <div className="font-medium">{template.audience}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Timing</div>
                      <div className="font-medium">{template.timing}</div>
                    </div>
                    <Button className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tax Deadline Campaign Automation</h3>
              <p className="text-muted-foreground">Automatically trigger campaigns based on tax deadlines</p>
            </div>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Add Deadline
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tax Deadlines</CardTitle>
              <CardDescription>Automated campaigns will be triggered for these deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{deadline.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {deadline.date} • {deadline.clients} clients affected
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Auto-Campaign</Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open Rate</span>
                    <span className="font-bold text-primary">76.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Click Rate</span>
                    <span className="font-bold text-primary">27.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-bold text-primary">9.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Client Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Campaigns</span>
                    <span className="font-bold text-primary">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Reach</span>
                    <span className="font-bold text-primary">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Leads</span>
                    <span className="font-bold text-primary">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">ROI Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Campaign ROI</span>
                    <span className="font-bold text-green-600">340%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Generated</span>
                    <span className="font-bold text-primary">$47,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost per Lead</span>
                    <span className="font-bold text-primary">$23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Trends</CardTitle>
              <CardDescription>Performance trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mr-2" />
                Campaign analytics chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};