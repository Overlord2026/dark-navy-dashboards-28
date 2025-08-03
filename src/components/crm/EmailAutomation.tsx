import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Plus,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  trigger_type: 'lead_status_change' | 'time_based' | 'engagement_based' | 'manual';
  trigger_config: any;
  status: 'active' | 'paused' | 'draft';
  send_count: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  created_at: string;
}

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  trigger_type: 'lead_status_change' | 'time_based' | 'engagement_based' | 'manual';
  trigger_config: any;
  status: 'active' | 'paused' | 'draft';
  send_count: number;
  response_rate: number;
  created_at: string;
}

export function EmailAutomation() {
  const { toast } = useToast();
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [smsCampaigns, setSmsCampaigns] = useState<SMSCampaign[]>([]);
  const [isCreateEmailOpen, setIsCreateEmailOpen] = useState(false);
  const [isCreateSMSOpen, setIsCreateSMSOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

  const [newEmailCampaign, setNewEmailCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    trigger_type: 'lead_status_change' as const,
    trigger_config: {
      from_status: 'new',
      to_status: 'contacted',
      delay_hours: 0
    }
  });

  const [newSMSCampaign, setNewSMSCampaign] = useState({
    name: '',
    message: '',
    trigger_type: 'lead_status_change' as const,
    trigger_config: {
      from_status: 'new', 
      to_status: 'contacted',
      delay_hours: 0
    }
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Load email campaigns
      const { data: emails } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('created_at', { ascending: false });

      // Load SMS campaigns  
      const { data: sms } = await supabase
        .from('sms_campaigns')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('created_at', { ascending: false });

      setEmailCampaigns(emails || []);
      setSmsCampaigns(sms || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      // Mock data for demo
      setEmailCampaigns([
        {
          id: '1',
          name: 'Welcome Email Series',
          subject: 'Welcome to our financial planning service',
          content: 'Thank you for your interest in our services...',
          trigger_type: 'lead_status_change',
          trigger_config: { from_status: 'new', to_status: 'contacted' },
          status: 'active',
          send_count: 45,
          open_rate: 0.68,
          click_rate: 0.24,
          conversion_rate: 0.12,
          created_at: new Date().toISOString()
        }
      ]);

      setSmsCampaigns([
        {
          id: '1',
          name: 'Appointment Reminder',
          message: 'Hi {{name}}, this is a reminder about your meeting tomorrow at {{time}}. Reply CONFIRM to confirm.',
          trigger_type: 'time_based',
          trigger_config: { hours_before_meeting: 24 },
          status: 'active',
          send_count: 23,
          response_rate: 0.87,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const createEmailCampaign = async () => {
    if (!newEmailCampaign.name || !newEmailCampaign.subject || !newEmailCampaign.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert([{
          ...newEmailCampaign,
          advisor_id: user.user.id,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Email Campaign Created",
        description: "Your email campaign has been saved as draft",
      });

      setIsCreateEmailOpen(false);
      setNewEmailCampaign({
        name: '',
        subject: '',
        content: '',
        trigger_type: 'lead_status_change',
        trigger_config: {
          from_status: 'new',
          to_status: 'contacted',
          delay_hours: 0
        }
      });

      loadCampaigns();
    } catch (error) {
      console.error('Error creating email campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive",
      });
    }
  };

  const createSMSCampaign = async () => {
    if (!newSMSCampaign.name || !newSMSCampaign.message) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('sms_campaigns')
        .insert([{
          ...newSMSCampaign,
          advisor_id: user.user.id,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "SMS Campaign Created",
        description: "Your SMS campaign has been saved as draft",
      });

      setIsCreateSMSOpen(false);
      setNewSMSCampaign({
        name: '',
        message: '',
        trigger_type: 'lead_status_change',
        trigger_config: {
          from_status: 'new',
          to_status: 'contacted', 
          delay_hours: 0
        }
      });

      loadCampaigns();
    } catch (error) {
      console.error('Error creating SMS campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create SMS campaign",
        variant: "destructive",
      });
    }
  };

  const toggleCampaignStatus = async (id: string, type: 'email' | 'sms', currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const table = type === 'email' ? 'email_campaigns' : 'sms_campaigns';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Campaign Updated",
        description: `Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`,
      });

      loadCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const sendTestEmail = async (campaignId: string) => {
    try {
      await supabase.functions.invoke('send-test-email', {
        body: { campaign_id: campaignId }
      });

      toast({
        title: "Test Email Sent",
        description: "Check your inbox for the test email",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
    }
  };

  const sendTestSMS = async (campaignId: string) => {
    try {
      await supabase.functions.invoke('send-test-sms', {
        body: { campaign_id: campaignId }
      });

      toast({
        title: "Test SMS Sent",
        description: "Check your phone for the test message",
      });
    } catch (error) {
      console.error('Error sending test SMS:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email & SMS Automation</h2>
          <p className="text-muted-foreground">
            Automate your follow-up campaigns and communications
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateEmailOpen} onOpenChange={setIsCreateEmailOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                New Email Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={isCreateSMSOpen} onOpenChange={setIsCreateSMSOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                New SMS Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Campaign Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'email' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('email')}
        >
          <Mail className="h-4 w-4 mr-2 inline" />
          Email Campaigns ({emailCampaigns.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'sms' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('sms')}
        >
          <MessageSquare className="h-4 w-4 mr-2 inline" />
          SMS Campaigns ({smsCampaigns.length})
        </button>
      </div>

      {/* Email Campaigns */}
      {activeTab === 'email' && (
        <div className="grid gap-4">
          {emailCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    
                    <div className="text-sm text-muted-foreground text-right">
                      <div>Sent: {campaign.send_count}</div>
                      <div>Open: {Math.round(campaign.open_rate * 100)}%</div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCampaignStatus(campaign.id, 'email', campaign.status)}
                    >
                      {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendTestEmail(campaign.id)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-lg">{Math.round(campaign.open_rate * 100)}%</div>
                    <div className="text-muted-foreground">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{Math.round(campaign.click_rate * 100)}%</div>
                    <div className="text-muted-foreground">Click Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{Math.round(campaign.conversion_rate * 100)}%</div>
                    <div className="text-muted-foreground">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SMS Campaigns */}
      {activeTab === 'sms' && (
        <div className="grid gap-4">
          {smsCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-md">{campaign.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    
                    <div className="text-sm text-muted-foreground text-right">
                      <div>Sent: {campaign.send_count}</div>
                      <div>Response: {Math.round(campaign.response_rate * 100)}%</div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCampaignStatus(campaign.id, 'sms', campaign.status)}
                    >
                      {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendTestSMS(campaign.id)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Email Campaign Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input
              value={newEmailCampaign.name}
              onChange={(e) => setNewEmailCampaign({...newEmailCampaign, name: e.target.value})}
              placeholder="e.g., Welcome Email Series"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email Subject</Label>
            <Input
              value={newEmailCampaign.subject}
              onChange={(e) => setNewEmailCampaign({...newEmailCampaign, subject: e.target.value})}
              placeholder="e.g., Welcome to our financial planning service"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email Content</Label>
            <Textarea
              value={newEmailCampaign.content}
              onChange={(e) => setNewEmailCampaign({...newEmailCampaign, content: e.target.value})}
              placeholder="Write your email content here... Use {{name}}, {{company}} for personalization"
              rows={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <Select
              value={newEmailCampaign.trigger_type}
              onValueChange={(value: any) => setNewEmailCampaign({...newEmailCampaign, trigger_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead_status_change">Lead Status Change</SelectItem>
                <SelectItem value="time_based">Time Based</SelectItem>
                <SelectItem value="engagement_based">Engagement Based</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createEmailCampaign}>
              Create Campaign
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Create SMS Campaign Dialog */}
      <Dialog open={isCreateSMSOpen} onOpenChange={setIsCreateSMSOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create SMS Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                value={newSMSCampaign.name}
                onChange={(e) => setNewSMSCampaign({...newSMSCampaign, name: e.target.value})}
                placeholder="e.g., Appointment Reminder"
              />
            </div>
            
            <div className="space-y-2">
              <Label>SMS Message (160 characters max)</Label>
              <Textarea
                value={newSMSCampaign.message}
                onChange={(e) => setNewSMSCampaign({...newSMSCampaign, message: e.target.value})}
                placeholder="Hi {{name}}, this is a reminder about your meeting..."
                rows={3}
                maxLength={160}
              />
              <div className="text-sm text-muted-foreground text-right">
                {newSMSCampaign.message.length}/160 characters
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select
                value={newSMSCampaign.trigger_type}
                onValueChange={(value: any) => setNewSMSCampaign({...newSMSCampaign, trigger_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_status_change">Lead Status Change</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="engagement_based">Engagement Based</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateSMSOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createSMSCampaign}>
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}