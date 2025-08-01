import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { KpiTile } from '@/components/admin/KpiTile';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Bell, 
  Plus, 
  Eye, 
  Users, 
  Calendar,
  TrendingUp,
  MousePointer,
  CheckCircle,
  Clock,
  Target,
  Video,
  Filter,
  Search,
  AlertTriangle
} from 'lucide-react';

interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  subject?: string;
  message_content: string;
  status: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

// Mock data for demo
const campaignMetrics = [
  { name: 'Tax Season Reminder', sent: 150, opened: 95, clicked: 23, type: 'email' },
  { name: 'Document Request', sent: 75, opened: 68, clicked: 45, type: 'portal_alert' },
  { name: 'Quarterly Check-in', sent: 200, opened: 140, clicked: 67, type: 'email' },
  { name: 'Urgent: Missing Forms', sent: 45, opened: 42, clicked: 38, type: 'sms' },
];

const engagementTrend = [
  { month: 'Jan', opens: 78, clicks: 23 },
  { month: 'Feb', opens: 85, clicks: 29 },
  { month: 'Mar', opens: 92, clicks: 34 },
  { month: 'Apr', opens: 88, clicks: 31 },
  { month: 'May', opens: 95, clicks: 38 },
  { month: 'Jun', opens: 89, clicks: 35 },
];

export function CommunicationsDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: '',
    campaign_type: 'email',
    subject: '',
    message_content: '',
    scheduled_for: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) {
        toast({
          title: "Error",
          description: "Could not find CPA partner profile",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('communication_campaigns')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load communication campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) throw partnerError;

      const { error } = await supabase
        .from('communication_campaigns')
        .insert({
          cpa_partner_id: cpaPartner.id,
          campaign_name: newCampaign.campaign_name,
          campaign_type: newCampaign.campaign_type,
          subject: newCampaign.subject || null,
          message_content: newCampaign.message_content,
          scheduled_for: newCampaign.scheduled_for || null,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      setShowCreateDialog(false);
      setNewCampaign({
        campaign_name: '',
        campaign_type: 'email',
        subject: '',
        message_content: '',
        scheduled_for: ''
      });
      
      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'portal_alert': return Bell;
      default: return Mail;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      scheduled: { variant: 'default' as const, label: 'Scheduled' },
      sent: { variant: 'default' as const, label: 'Sent' },
      failed: { variant: 'destructive' as const, label: 'Failed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <DashboardHeader 
          heading="Communications Dashboard"
          text="Manage batch emails, SMS, and portal alerts with detailed tracking and analytics"
        />
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Communication Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign_name">Campaign Name</Label>
                <Input
                  id="campaign_name"
                  value={newCampaign.campaign_name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, campaign_name: e.target.value }))}
                  placeholder="Tax Season Reminder 2024"
                />
              </div>

              <div>
                <Label htmlFor="campaign_type">Campaign Type</Label>
                <Select 
                  value={newCampaign.campaign_type} 
                  onValueChange={(value) => setNewCampaign(prev => ({ ...prev, campaign_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="portal_alert">Portal Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newCampaign.campaign_type === 'email' && (
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Important: Tax documents needed"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="message_content">Message Content</Label>
                <Textarea
                  id="message_content"
                  value={newCampaign.message_content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, message_content: e.target.value }))}
                  placeholder="Dear [Client Name], we need your tax documents..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="scheduled_for">Schedule for Later (Optional)</Label>
                <Input
                  id="scheduled_for"
                  type="datetime-local"
                  value={newCampaign.scheduled_for}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_for: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createCampaign} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batch">Batch Messages</TabsTrigger>
          <TabsTrigger value="nudges">AI Nudges</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiTile
              title="Total Campaigns"
              value={campaigns.length.toString()}
              icon={Send}
            />
            <KpiTile
              title="Emails Sent"
              value="1,247"
              icon={Mail}
            />
            <KpiTile
              title="Avg Open Rate"
              value="74.2%"
              icon={Eye}
            />
            <KpiTile
              title="Avg Click Rate"
              value="31.5%"
              icon={MousePointer}
            />
          </div>

          {/* Engagement Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveChart height={300}>
                <LineChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opens" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Opens"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Batch Communication</CardTitle>
              <CardDescription>Target clients with missing docs, overdue responses, or specific criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missing_docs">Missing Documents (12 clients)</SelectItem>
                    <SelectItem value="overdue">Overdue Response (8 clients)</SelectItem>
                    <SelectItem value="all_pending">All Pending (23 clients)</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Batch Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nudges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Nudge Rules</CardTitle>
              <CardDescription>Automated reminders for slow responders and missing documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Missing Document Reminder</h4>
                    <p className="text-sm text-muted-foreground">Triggers after 3 days of missing docs</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Overdue Response Follow-up</h4>
                    <p className="text-sm text-muted-foreground">Triggers after 5 days of no response</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Meetings</CardTitle>
              <CardDescription>Schedule and manage client meetings with video integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Tax Review with John Smith</h4>
                    <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                  </div>
                  <Button size="sm">
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Comments</CardTitle>
              <CardDescription>Recent questions and clarifications on client documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Sarah Johnson (Client)</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm">Question about line 23 on the tax organizer - do I include rental income here?</p>
                  <Badge variant="secondary" className="mt-2">Pending Response</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Campaigns Yet</h3>
                    <p className="text-muted-foreground">
                      Create your first communication campaign to start engaging with clients.
                    </p>
                  </div>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const Icon = getCampaignIcon(campaign.campaign_type);
                return (
                  <Card key={campaign.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold">{campaign.campaign_name}</h3>
                            {campaign.subject && (
                              <p className="text-sm text-muted-foreground">
                                Subject: {campaign.subject}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {campaign.message_content.length > 100 
                                ? campaign.message_content.substring(0, 100) + '...'
                                : campaign.message_content
                              }
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="capitalize">{campaign.campaign_type}</span>
                              <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
                              {campaign.scheduled_for && (
                                <span>Scheduled {new Date(campaign.scheduled_for).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(campaign.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveChart height={400}>
                <BarChart data={campaignMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sent" fill="hsl(var(--muted))" name="Sent" />
                  <Bar dataKey="opened" fill="hsl(var(--primary))" name="Opened" />
                  <Bar dataKey="clicked" fill="hsl(var(--accent))" name="Clicked" />
                </BarChart>
              </ResponsiveChart>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignMetrics.slice(0, 3).map((campaign, index) => {
                    const openRate = ((campaign.opened / campaign.sent) * 100).toFixed(1);
                    const clickRate = ((campaign.clicked / campaign.sent) * 100).toFixed(1);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{campaign.type}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{openRate}% open rate</div>
                          <div className="text-muted-foreground">{clickRate}% click rate</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Tax Season Reminder sent</p>
                      <p className="text-sm text-muted-foreground">2 hours ago • 150 recipients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Document Request scheduled</p>
                      <p className="text-sm text-muted-foreground">Tomorrow at 9:00 AM • 75 recipients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Send className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Quarterly Check-in created</p>
                      <p className="text-sm text-muted-foreground">1 day ago • Draft</p>
                    </div>
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