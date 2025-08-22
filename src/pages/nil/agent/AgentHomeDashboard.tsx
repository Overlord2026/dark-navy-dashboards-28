import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { nilAnalytics } from '@/lib/nil/analytics';
import { NILActions } from '@/lib/nil/proofSlips';

interface Deal {
  id: string;
  athleteName: string;
  brandName: string;
  amount: number;
  status: 'prospect' | 'negotiating' | 'pending_approval' | 'active' | 'completed';
  stage: string;
  lastActivity: string;
  conflictStatus: 'clear' | 'warning' | 'blocked';
}

interface Dispute {
  id: string;
  athleteName: string;
  postId: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const AgentHomeDashboard = () => {
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [showDisputes, setShowDisputes] = useState(false);

  // Mock data
  const deals: Deal[] = [
    {
      id: 'deal-1',
      athleteName: 'Sarah Johnson',
      brandName: 'Nike',
      amount: 5000,
      status: 'negotiating',
      stage: 'Contract Review',
      lastActivity: '2 hours ago',
      conflictStatus: 'clear'
    },
    {
      id: 'deal-2',
      athleteName: 'Mike Chen',
      brandName: 'Gatorade',
      amount: 3500,
      status: 'pending_approval',
      stage: 'School Approval',
      lastActivity: '1 day ago',
      conflictStatus: 'warning'
    },
    {
      id: 'deal-3',
      athleteName: 'Emma Davis',
      brandName: 'Under Armour',
      amount: 2500,
      status: 'active',
      stage: 'Content Creation',
      lastActivity: '3 days ago',
      conflictStatus: 'clear'
    }
  ];

  const disputes: Dispute[] = [
    {
      id: 'dispute-1',
      athleteName: 'Sarah Johnson',
      postId: 'post-123',
      reason: 'Missing FTC Disclosure',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15'
    },
    {
      id: 'dispute-2',
      athleteName: 'Mike Chen',
      postId: 'post-456',
      reason: 'Exclusivity Violation',
      status: 'investigating',
      priority: 'medium',
      createdAt: '2024-01-14'
    }
  ];

  const handleStageChange = async (dealId: string, newStage: string) => {
    console.log(`Deal ${dealId} moved to ${newStage}`);
    
    // Track analytics
    nilAnalytics.trackEvent('nil.pipeline.stage_change', {
      dealId,
      newStage,
      agentId: 'agent-123'
    });
  };

  const handleDisputeAction = async (disputeId: string, action: 'open' | 'resolve') => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    if (action === 'open') {
      nilAnalytics.disputeOpen(disputeId, dispute.postId, dispute.reason);
    } else {
      nilAnalytics.disputeClose(disputeId, 'agent_resolved', 45);
      await NILActions.logDispute(disputeId, 'original-decision-123', 'resolved', 'Agent intervention');
    }

    setShowDisputes(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'resolved':
        return 'success';
      case 'pending_approval':
      case 'investigating':
        return 'warning';
      case 'prospect':
      case 'open':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getConflictColor = (status: string) => {
    switch (status) {
      case 'clear':
        return 'success';
      case 'warning':
        return 'warning';
      case 'blocked':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredDeals = deals.filter(deal => 
    pipelineFilter === 'all' || deal.status === pipelineFilter
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage athlete partnerships and opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={() => setShowDisputes(!showDisputes)}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            {showDisputes ? 'Hide' : 'Show'} Disputes
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">{deals.filter(d => d.status === 'active').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">
                  ${deals.reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Athletes</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Disputes</p>
                <p className="text-2xl font-bold">{disputes.filter(d => d.status === 'open').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
          <TabsTrigger value="athletes">Athletes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Deal Pipeline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select 
                    value={pipelineFilter} 
                    onChange={(e) => setPipelineFilter(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="all">All Deals</option>
                    <option value="prospect">Prospects</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{deal.athleteName}</h3>
                          <Badge variant="outline">{deal.brandName}</Badge>
                          <Badge variant={getStatusColor(deal.status)}>
                            {deal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${deal.amount.toLocaleString()} • {deal.stage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last activity: {deal.lastActivity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Conflicts</p>
                          <Badge variant={getConflictColor(deal.conflictStatus)} className="text-xs">
                            {deal.conflictStatus}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStageChange(deal.id, 'next_stage')}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Advance
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disputes Section */}
          {showDisputes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Disputes & Delta Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4 border-l-4 border-l-warning">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{dispute.athleteName}</h4>
                            <Badge variant={getPriorityColor(dispute.priority)}>
                              {dispute.priority} priority
                            </Badge>
                            <Badge variant={getStatusColor(dispute.status)}>
                              {dispute.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Post: {dispute.postId} • {dispute.reason}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {dispute.createdAt}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisputeAction(dispute.id, 'resolve')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="athletes">
          <Card>
            <CardHeader>
              <CardTitle>Athlete Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Athlete management tools coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed analytics dashboard coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentHomeDashboard;