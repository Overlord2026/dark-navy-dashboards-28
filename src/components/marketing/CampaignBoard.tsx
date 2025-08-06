import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Edit, 
  Eye, 
  Calendar, 
  Users, 
  Mail, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  persona: string;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed';
  contacts: number;
  sent: number;
  opened: number;
  clicked: number;
  scheduled?: string;
  template: string;
  sequence: string[];
}

export function CampaignBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'VIP Advisor Early Access',
      persona: 'advisor',
      status: 'sending',
      contacts: 245,
      sent: 198,
      opened: 87,
      clicked: 23,
      template: 'VIP Advisor Invitation',
      sequence: ['Initial Invite', 'Follow-up Day 3', 'Final Reminder Day 7']
    },
    {
      id: '2',
      name: 'CPA Beta Program',
      persona: 'accountant',
      status: 'scheduled',
      contacts: 156,
      sent: 0,
      opened: 0,
      clicked: 0,
      scheduled: '2024-01-15',
      template: 'CPA Beta Invitation',
      sequence: ['Welcome Email', 'Feature Demo Day 2', 'Q&A Webinar Day 5']
    },
    {
      id: '3',
      name: 'Attorney Partnership Drive',
      persona: 'attorney',
      status: 'draft',
      contacts: 89,
      sent: 0,
      opened: 0,
      clicked: 0,
      template: 'Attorney Partnership Invite',
      sequence: ['Partnership Invite', 'Benefits Overview Day 2', 'Call to Action Day 4']
    }
  ]);

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'sending': return <Send className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      case 'sending': return 'default';
      case 'paused': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const handleCampaignAction = (campaignId: string, action: 'start' | 'pause' | 'resume' | 'edit') => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        switch (action) {
          case 'start':
            return { ...campaign, status: 'sending' as const };
          case 'pause':
            return { ...campaign, status: 'paused' as const };
          case 'resume':
            return { ...campaign, status: 'sending' as const };
          default:
            return campaign;
        }
      }
      return campaign;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Pipeline</h2>
          <p className="text-muted-foreground">Manage your outreach campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Draft Column */}
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm">Draft</h3>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'draft').length} campaigns
            </p>
          </div>
          {campaigns.filter(c => c.status === 'draft').map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={handleCampaignAction}
            />
          ))}
        </div>

        {/* Scheduled Column */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-sm">Scheduled</h3>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'scheduled').length} campaigns
            </p>
          </div>
          {campaigns.filter(c => c.status === 'scheduled').map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={handleCampaignAction}
            />
          ))}
        </div>

        {/* Sending Column */}
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="font-medium text-sm">Sending</h3>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'sending').length} campaigns
            </p>
          </div>
          {campaigns.filter(c => c.status === 'sending').map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={handleCampaignAction}
            />
          ))}
        </div>

        {/* Paused Column */}
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-sm">Paused</h3>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'paused').length} campaigns
            </p>
          </div>
          {campaigns.filter(c => c.status === 'paused').map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={handleCampaignAction}
            />
          ))}
        </div>

        {/* Completed Column */}
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm">Completed</h3>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'completed').length} campaigns
            </p>
          </div>
          {campaigns.filter(c => c.status === 'completed').map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={handleCampaignAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onAction: (campaignId: string, action: 'start' | 'pause' | 'resume' | 'edit') => void;
}

function CampaignCard({ campaign, onAction }: CampaignCardProps) {
  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'sending': return <Send className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      case 'sending': return 'default';
      case 'paused': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-3">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm leading-tight">{campaign.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{campaign.persona}</p>
          </div>
          <Badge variant={getStatusColor(campaign.status) as any} className="text-xs">
            {getStatusIcon(campaign.status)}
            <span className="ml-1 capitalize">{campaign.status}</span>
          </Badge>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Contacts</span>
            <span className="font-medium">{campaign.contacts}</span>
          </div>
          
          {campaign.status === 'sending' && (
            <>
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span>{Math.round((campaign.sent / campaign.contacts) * 100)}%</span>
                </div>
                <Progress value={(campaign.sent / campaign.contacts) * 100} className="h-1" />
              </div>
              
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <div className="font-medium">{campaign.sent}</div>
                  <div className="text-muted-foreground">Sent</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{campaign.opened}</div>
                  <div className="text-muted-foreground">Opened</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{campaign.clicked}</div>
                  <div className="text-muted-foreground">Clicked</div>
                </div>
              </div>
            </>
          )}

          {campaign.scheduled && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {campaign.scheduled}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          {campaign.status === 'draft' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6 px-2"
              onClick={() => onAction(campaign.id, 'start')}
            >
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          )}
          
          {campaign.status === 'sending' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6 px-2"
              onClick={() => onAction(campaign.id, 'pause')}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          )}
          
          {campaign.status === 'paused' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6 px-2"
              onClick={() => onAction(campaign.id, 'resume')}
            >
              <Play className="h-3 w-3 mr-1" />
              Resume
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs h-6 px-2"
            onClick={() => onAction(campaign.id, 'edit')}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}