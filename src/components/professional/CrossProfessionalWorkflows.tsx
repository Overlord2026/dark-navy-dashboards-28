import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  ArrowRight, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { useProfessionalTeams } from '@/hooks/useProfessionalTeams';

export function CrossProfessionalWorkflows() {
  const { workflows, metrics, triggerWorkflow, loading } = useProfessionalTeams();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const getWorkflowIcon = (triggerType: string) => {
    if (triggerType.includes('estate')) return <FileText className="h-4 w-4 text-purple-500" />;
    if (triggerType.includes('tax')) return <BarChart3 className="h-4 w-4 text-blue-500" />;
    if (triggerType.includes('insurance')) return <AlertTriangle className="h-4 w-4 text-green-500" />;
    if (triggerType.includes('asset')) return <CheckCircle className="h-4 w-4 text-orange-500" />;
    return <Zap className="h-4 w-4 text-purple-500" />;
  };

  const getAutomationMetrics = () => {
    const totalTriggers = workflows.reduce((sum, w) => sum + w.completedCount, 0);
    const averageCompletionTime = '2.3h'; // Mock data
    const successRate = 94; // Mock data
    
    return { totalTriggers, averageCompletionTime, successRate };
  };

  const handleToggleWorkflow = async (workflowId: string) => {
    // In real implementation, this would update the workflow status in database
    console.log('Toggle workflow:', workflowId);
  };

  const handleTriggerWorkflow = async (workflowId: string) => {
    await triggerWorkflow(workflowId, 'sample-client-id');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const automationMetrics = getAutomationMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cross-Professional Workflows</h2>
          <p className="text-muted-foreground">Automated handoffs and coordination between professionals</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{metrics.activeWorkflows}</p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {workflows.length} total configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Handoffs</p>
                <p className="text-2xl font-bold">{automationMetrics.totalTriggers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Completion Time</p>
                <p className="text-2xl font-bold">{automationMetrics.averageCompletionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-success mt-2">
              35% faster than manual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{automationMetrics.successRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={automationMetrics.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configured Workflows
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-6 space-y-4">
              {/* Workflow Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getWorkflowIcon(workflow.triggerType)}
                  <div>
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                  <Switch
                    checked={workflow.status === 'active'}
                    onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                  />
                </div>
              </div>

              {/* Workflow Flow */}
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{workflow.fromProfessional}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">Automated Workflow</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{workflow.toProfessional}</span>
                  </div>
                </div>
              </div>

              {/* Automated Actions */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Automated Actions:</h4>
                <div className="flex flex-wrap gap-2">
                  {workflow.automatedActions.map((action, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Workflow Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>
                    <strong>{workflow.completedCount}</strong> completed handoffs
                  </span>
                  {workflow.lastTriggered && (
                    <span>
                      Last triggered: <strong>{workflow.lastTriggered}</strong>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleTriggerWorkflow(workflow.id)}>
                    <Play className="h-3 w-3 mr-1" />
                    Test Workflow
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Workflow Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock recent activities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Estate Planning → Tax Planning Handoff</p>
                  <p className="text-xs text-muted-foreground">Client: John Smith • Triggered by estate plan update</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Completed</p>
                <p>2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Tax Assessment → Insurance Review</p>
                  <p className="text-xs text-muted-foreground">Client: Sarah Johnson • Triggered by high tax liability</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>In Progress</p>
                <p>1 day ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <p className="text-sm font-medium">Investment Change → Estate Update</p>
                  <p className="text-xs text-muted-foreground">Client: Michael Brown • Triggered by asset change</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Completed</p>
                <p>3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}