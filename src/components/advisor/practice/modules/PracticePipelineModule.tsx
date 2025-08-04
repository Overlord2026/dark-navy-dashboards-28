import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  User, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export function PracticePipelineModule() {
  const pipelineStages = [
    {
      name: 'Lead',
      count: 12,
      value: '$2.4M',
      color: 'bg-gray-100 border-gray-200'
    },
    {
      name: 'Qualified',
      count: 8,
      value: '$1.8M',
      color: 'bg-blue-100 border-blue-200'
    },
    {
      name: 'Meeting',
      count: 5,
      value: '$1.2M',
      color: 'bg-yellow-100 border-yellow-200'
    },
    {
      name: 'Proposal Sent',
      count: 3,
      value: '$750K',
      color: 'bg-orange-100 border-orange-200'
    },
    {
      name: 'Won',
      count: 2,
      value: '$500K',
      color: 'bg-green-100 border-green-200'
    },
    {
      name: 'Lost',
      count: 1,
      value: '$150K',
      color: 'bg-red-100 border-red-200'
    }
  ];

  const prospects = [
    {
      id: '1',
      name: 'Sarah Chen',
      stage: 'Meeting',
      value: '$450K',
      probability: '75%',
      nextAction: 'Initial Consultation',
      dueDate: 'Mar 20',
      source: 'LinkedIn',
      tags: ['High Priority', 'Professional']
    },
    {
      id: '2',
      name: 'David Rodriguez',
      stage: 'Proposal Sent',
      value: '$300K',
      probability: '60%',
      nextAction: 'Follow-up Call',
      dueDate: 'Mar 18',
      source: 'Referral',
      tags: ['Retirement Planning']
    },
    {
      id: '3',
      name: 'Jennifer Walsh',
      stage: 'Qualified',
      value: '$200K',
      probability: '40%',
      nextAction: 'Schedule Meeting',
      dueDate: 'Mar 22',
      source: 'Website',
      tags: ['First-time Investor']
    }
  ];

  const pipelineAnalytics = {
    conversionRate: '68%',
    avgSalesCycle: '45 days',
    avgClientValue: '$285K',
    totalPipelineValue: '$7.8M'
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Lead': return User;
      case 'Qualified': return CheckCircle;
      case 'Meeting': return Calendar;
      case 'Proposal Sent': return FileText;
      case 'Won': return TrendingUp;
      case 'Lost': return AlertCircle;
      default: return Clock;
    }
  };

  const getPriorityBadge = (tags: string[]) => {
    if (tags.includes('High Priority')) {
      return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pipelineAnalytics.totalPipelineValue}</div>
            <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pipelineAnalytics.conversionRate}</div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pipelineAnalytics.avgSalesCycle}</div>
            <p className="text-sm text-muted-foreground">Avg. Sales Cycle</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pipelineAnalytics.avgClientValue}</div>
            <p className="text-sm text-muted-foreground">Avg. Client Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pipeline Kanban Board</span>
            <Button size="sm">
              Add Prospect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pipelineStages.map((stage, index) => {
              const Icon = getStageIcon(stage.name);
              return (
                <div key={index} className={`rounded-lg border-2 border-dashed p-4 min-h-[200px] ${stage.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{stage.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stage.count}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold mb-4">{stage.value}</div>
                  
                  {/* Sample cards for each stage */}
                  {stage.name === 'Meeting' && (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-border shadow-sm">
                        <div className="font-medium text-sm">Sarah Chen</div>
                        <div className="text-xs text-muted-foreground">$450K • 75%</div>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">High Priority</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {stage.name === 'Proposal Sent' && (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-border shadow-sm">
                        <div className="font-medium text-sm">David Rodriguez</div>
                        <div className="text-xs text-muted-foreground">$300K • 60%</div>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">Follow-up</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prospect Detail List */}
      <Card>
        <CardHeader>
          <CardTitle>Prospect Details & Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prospects.map((prospect) => (
              <div key={prospect.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{prospect.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {prospect.stage} • {prospect.value} • {prospect.probability} probability
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{prospect.nextAction}</div>
                    <div className="text-xs text-muted-foreground">Due: {prospect.dueDate}</div>
                  </div>
                  
                  <div className="flex gap-1">
                    {getPriorityBadge(prospect.tags)}
                    <Badge variant="outline" className="text-xs">
                      {prospect.source}
                    </Badge>
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}