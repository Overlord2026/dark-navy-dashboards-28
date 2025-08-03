import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Calendar, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface ComplianceTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  due_date: string;
  regulation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function CompliancePage() {
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const complianceTasks: ComplianceTask[] = [
    {
      id: '1',
      title: 'PCAOB Independence Verification',
      description: 'Verify independence requirements for audit clients',
      status: 'completed',
      due_date: '2024-03-15',
      regulation: 'PCAOB',
      priority: 'critical'
    },
    {
      id: '2',
      title: 'SOX 404 Documentation Review',
      description: 'Review internal controls documentation for public company clients',
      status: 'in_progress',
      due_date: '2024-03-25',
      regulation: 'SOX',
      priority: 'high'
    },
    {
      id: '3',
      title: 'State License Renewal',
      description: 'Renew CPA license and continuing education requirements',
      status: 'pending',
      due_date: '2024-04-30',
      regulation: 'State Board',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Quality Control Review',
      description: 'Annual firm quality control review and documentation',
      status: 'overdue',
      due_date: '2024-03-10',
      regulation: 'AICPA',
      priority: 'critical'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const completedTasks = complianceTasks.filter(task => task.status === 'completed').length;
  const totalTasks = complianceTasks.length;
  const overdueTasks = complianceTasks.filter(task => task.status === 'overdue').length;
  const completionRate = (completedTasks / totalTasks) * 100;

  const handleCompliancePassed = () => {
    triggerCelebration('success', 'Compliance Check Passed! ✅');
  };

  return (
    <ThreeColumnLayout title="Compliance Management">
      <div className="space-y-6">
        {CelebrationComponent}
        
        <DashboardHeader 
          heading="Compliance Management Center"
          text="Track regulatory requirements, deadlines, and compliance status."
        />

        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracker">Task Tracker</TabsTrigger>
            <TabsTrigger value="calendar">Regulatory Calendar</TabsTrigger>
            <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    Active compliance tasks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{completionRate.toFixed(0)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{overdueTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">5</div>
                  <p className="text-xs text-muted-foreground">
                    Days remaining
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Task Tracker</CardTitle>
                <CardDescription>
                  Monitor all regulatory compliance requirements and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{task.title}</div>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Due: {task.due_date}</span>
                          <span>Regulation: {task.regulation}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(task.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button onClick={handleCompliancePassed} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Run Compliance Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Calendar</CardTitle>
                <CardDescription>
                  Important compliance dates and deadlines across all regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">March 2024</h4>
                    <div className="space-y-1">
                      <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                        <div className="font-medium">Mar 10 - Quality Review (Overdue)</div>
                      </div>
                      <div className="p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                        <div className="font-medium">Mar 15 - PCAOB Independence</div>
                      </div>
                      <div className="p-2 bg-secondary/10 border border-secondary/20 rounded text-sm">
                        <div className="font-medium">Mar 25 - SOX Documentation</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">April 2024</h4>
                    <div className="space-y-1">
                      <div className="p-2 bg-secondary/10 border border-secondary/20 rounded text-sm">
                        <div className="font-medium">Apr 30 - License Renewal</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">May 2024</h4>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">No scheduled deadlines</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-log" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Audit Log</CardTitle>
                <CardDescription>
                  Historical record of all compliance activities and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">PCAOB Independence Verification Completed</div>
                      <div className="text-xs text-muted-foreground">Mar 15, 2024 - Verified by Sarah Johnson</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Clock className="h-4 w-4 text-warning" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">SOX 404 Review Started</div>
                      <div className="text-xs text-muted-foreground">Mar 12, 2024 - Assigned to Mike Chen</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Quality Control Review Overdue</div>
                      <div className="text-xs text-muted-foreground">Mar 10, 2024 - Escalated to management</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reporting</CardTitle>
                <CardDescription>
                  Generate compliance reports and summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileCheck className="h-6 w-6 mb-2" />
                    Compliance Summary Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Regulatory Calendar Export
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    Risk Assessment Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Exception Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}