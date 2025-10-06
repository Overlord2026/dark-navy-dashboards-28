import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketingCampaign } from '@/marketing/types';
import { priorityOrder } from '@/types/goals';

interface TasksPanelProps {
  campaigns: MarketingCampaign[];
}

export function TasksPanel({ campaigns }: TasksPanelProps) {
  // Generate mock tasks based on campaign states
  const pendingApprovals = campaigns.filter(c => 
    c.status === 'awaiting_compliance' || c.status === 'awaiting_approval'
  );

  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled');
  
  // Mock failed syncs and other tasks
  const mockTasks = [
    {
      id: 'sync-1',
      type: 'sync_failed',
      title: 'Facebook Ads Sync Failed',
      description: 'Unable to sync campaign metrics for "Young Professional Q1"',
      priority: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'review-1',
      type: 'compliance_review',
      title: 'Compliance Review Required',
      description: 'New disclaimer updates need review for 3 campaigns',
      priority: 'medium',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: 'optimize-1',
      type: 'optimization',
      title: 'Budget Reallocation Suggested',
      description: 'LinkedIn performing 25% better than Facebook for B2B campaigns',
      priority: 'low',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];

  const allTasks = [
    ...pendingApprovals.map(campaign => ({
      id: `approval-${campaign.id}`,
      type: 'approval_pending',
      title: 'Approval Required',
      description: `"${campaign.name}" is waiting for ${campaign.status.replace('awaiting_', '')} approval`,
      priority: 'high' as const,
      timestamp: new Date(campaign.updatedAt),
      campaignId: campaign.id,
    })),
    ...scheduledCampaigns.map(campaign => ({
      id: `scheduled-${campaign.id}`,
      type: 'scheduled_launch',
      title: 'Scheduled Launch',
      description: `"${campaign.name}" is scheduled to launch ${campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'soon'}`,
      priority: 'medium' as const,
      timestamp: new Date(campaign.updatedAt),
      campaignId: campaign.id,
    })),
    ...mockTasks,
  ].sort((a, b) => {
    // Use centralized priority order (reverse for descending sort)
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    return aPriority - bPriority;
  });

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'approval_pending':
        return <Clock className="h-4 w-4" />;
      case 'scheduled_launch':
        return <CheckCircle className="h-4 w-4" />;
      case 'sync_failed':
        return <RefreshCw className="h-4 w-4" />;
      case 'compliance_review':
        return <Eye className="h-4 w-4" />;
      case 'optimization':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tasks & Alerts</span>
          <Badge variant="outline">
            {allTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>All caught up!</p>
            <p className="text-sm">No pending tasks or alerts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allTasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getTaskIcon(task.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <Badge variant={getTaskColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(task.timestamp)}
                  </span>
                  
                  {(task as any).campaignId && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/ai-marketing-engine/review/${(task as any).campaignId}`}>
                        View
                      </Link>
                    </Button>
                  )}
                  
                  {task.type === 'sync_failed' && (
                    <Button variant="ghost" size="sm">
                      Retry
                    </Button>
                  )}
                  
                  {task.type === 'compliance_review' && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/ai-marketing-engine/settings">
                        Review
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {allTasks.length > 5 && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/admin/ai-marketing-engine/history">
                  View All {allTasks.length} Tasks
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}