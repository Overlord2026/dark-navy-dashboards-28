import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Plus, 
  Play, 
  Pause,
  Trash2,
  Edit,
  Users,
  TrendingUp,
  Eye,
  MousePointer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  sent_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  advisor_id: string;
}

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  sent_count: number;
  response_rate: number;
  created_at: string;
  advisor_id: string;
}

export function EmailAutomation() {
  const { toast } = useToast();
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [smsCampaigns, setSmsCampaigns] = useState<SMSCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);

  const [newEmailCampaign, setNewEmailCampaign] = useState({
    name: '',
    subject: '',
    content: ''
  });

  const [newSMSCampaign, setNewSMSCampaign] = useState({
    name: '',
    message: ''
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      // Use mock data for now
      const mockEmailCampaigns: EmailCampaign[] = [
        {
          id: '1',
          name: 'Welcome Series',
          status: 'active',
          subject: 'Welcome to our services',
          content: 'Thank you for choosing us...',
          sent_count: 125,
          open_rate: 24.5,
          click_rate: 3.2,
          created_at: new Date().toISOString(),
          advisor_id: 'mock-advisor'
        }
      ];

      const mockSMSCampaigns: SMSCampaign[] = [
        {
          id: '1',
          name: 'Follow-up Sequence',
          status: 'active',
          message: 'Thanks for meeting with us...',
          sent_count: 85,
          response_rate: 12.4,
          created_at: new Date().toISOString(),
          advisor_id: 'mock-advisor'
        }
      ];

      setEmailCampaigns(mockEmailCampaigns);
      setSmsCampaigns(mockSMSCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmailCampaign = async () => {
    try {
      // Mock campaign creation
      const newCampaign: EmailCampaign = {
        id: Date.now().toString(),
        name: newEmailCampaign.name,
        subject: newEmailCampaign.subject,
        content: newEmailCampaign.content,
        status: 'active',
        sent_count: 0,
        open_rate: 0,
        click_rate: 0,
        created_at: new Date().toISOString(),
        advisor_id: 'mock-advisor'
      };
      
      setEmailCampaigns(prev => [newCampaign, ...prev]);
      toast({
        title: "Success",
        description: "Email campaign created successfully",
      });
      setIsEmailDialogOpen(false);
      setNewEmailCampaign({ name: '', subject: '', content: '' });
    } catch (error) {
      console.error('Error creating email campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive",
      });
    }
  };

  const handleCreateSMSCampaign = async () => {
    try {
      // Mock campaign creation
      const newCampaign: SMSCampaign = {
        id: Date.now().toString(),
        name: newSMSCampaign.name,
        message: newSMSCampaign.message,
        status: 'active',
        sent_count: 0,
        response_rate: 0,
        created_at: new Date().toISOString(),
        advisor_id: 'mock-advisor'
      };
      
      setSmsCampaigns(prev => [newCampaign, ...prev]);
      toast({
        title: "Success",
        description: "SMS campaign created successfully",
      });
      setIsSMSDialogOpen(false);
      setNewSMSCampaign({ name: '', message: '' });
    } catch (error) {
      console.error('Error creating SMS campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create SMS campaign",
        variant: "destructive",
      });
    }
  };

  const deleteCampaign = async (id: string, type: 'email' | 'sms') => {
    try {
      if (type === 'email') {
        setEmailCampaigns(prev => prev.filter(c => c.id !== id));
      } else {
        setSmsCampaigns(prev => prev.filter(c => c.id !== id));
      }
      
      toast({
        title: "Success",
        description: `${type === 'email' ? 'Email' : 'SMS'} campaign deleted`,
      });
    } catch (error) {
      console.error(`Error deleting ${type} campaign:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type} campaign`,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email & SMS Automation</h2>
          <p className="text-muted-foreground">Create and manage automated communication campaigns</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                New Email Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                New SMS Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">
                  {emailCampaigns.filter(c => c.status === 'active').length + 
                   smsCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">
                  {emailCampaigns.reduce((sum, c) => sum + c.sent_count, 0) +
                   smsCampaigns.reduce((sum, c) => sum + c.sent_count, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">
                  {emailCampaigns.length > 0 
                    ? (emailCampaigns.reduce((sum, c) => sum + c.open_rate, 0) / emailCampaigns.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Click Rate</p>
                <p className="text-2xl font-bold">
                  {emailCampaigns.length > 0 
                    ? (emailCampaigns.reduce((sum, c) => sum + c.click_rate, 0) / emailCampaigns.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Tabs */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="sms">SMS Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.sent_count} sent • {campaign.open_rate}% open rate • {campaign.click_rate}% click rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id, 'email')}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smsCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.sent_count} sent • {campaign.response_rate}% response rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id, 'sms')}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
              placeholder="e.g., Welcome Series"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input
              value={newEmailCampaign.subject}
              onChange={(e) => setNewEmailCampaign({...newEmailCampaign, subject: e.target.value})}
              placeholder="Email subject..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email Content</Label>
            <Textarea
              value={newEmailCampaign.content}
              onChange={(e) => setNewEmailCampaign({...newEmailCampaign, content: e.target.value})}
              placeholder="Email content..."
              rows={6}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEmailCampaign}>
              Create Campaign
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Create SMS Campaign Dialog */}
      <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
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
                placeholder="e.g., Follow-up Sequence"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={newSMSCampaign.message}
                onChange={(e) => setNewSMSCampaign({...newSMSCampaign, message: e.target.value})}
                placeholder="SMS message..."
                rows={3}
                maxLength={160}
              />
              <p className="text-sm text-muted-foreground">
                {newSMSCampaign.message.length}/160 characters
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSMSDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSMSCampaign}>
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}