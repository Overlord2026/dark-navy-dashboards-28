import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  Upload, 
  Bell, 
  FileText,
  Calendar,
  AlertTriangle,
  Users 
} from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface AuditTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: string;
  client: string;
}

export default function AuditPrepPage() {
  const { triggerCelebration, CelebrationComponent } = useCelebration();
  const [selectedClient, setSelectedClient] = useState('all');

  const auditTasks: AuditTask[] = [
    {
      id: '1',
      title: 'Bank Reconciliation Review',
      description: 'Review and verify all bank reconciliations for fiscal year',
      status: 'completed',
      due_date: '2024-03-15',
      assigned_to: 'Sarah Johnson',
      client: 'TechCorp Inc'
    },
    {
      id: '2',
      title: 'Fixed Asset Verification',
      description: 'Physical verification of fixed assets and depreciation calculations',
      status: 'in_progress',
      due_date: '2024-03-20',
      assigned_to: 'Mike Chen',
      client: 'TechCorp Inc'
    },
    {
      id: '3',
      title: 'Accounts Receivable Confirmation',
      description: 'Send confirmation letters to major customers',
      status: 'pending',
      due_date: '2024-03-25',
      assigned_to: 'Lisa Wong',
      client: 'BuildCorp LLC'
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const completedTasks = auditTasks.filter(task => task.status === 'completed').length;
  const totalTasks = auditTasks.length;
  const completionPercentage = (completedTasks / totalTasks) * 100;

  const handleCompleteAudit = () => {
    triggerCelebration('success', 'Audit Preparation Complete! 🎉');
  };

  return (
    <ThreeColumnLayout title="Audit Preparation">
      <div className="space-y-6">
        {CelebrationComponent}
        
        <DashboardHeader 
          heading="Audit Preparation & Management"
          text="Comprehensive audit preparation tools and checklist management."
        />

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Progress value={completionPercentage} className="h-2 w-12" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">2</div>
                  <p className="text-xs text-muted-foreground">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Audit Checklist</CardTitle>
                <CardDescription>
                  Track audit preparation tasks and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="space-y-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due: {task.due_date}
                          <Users className="h-3 w-3" />
                          {task.assigned_to}
                          <span className="font-medium">{task.client}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(task.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button onClick={handleCompleteAudit} className="w-full">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mark Audit Phase Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Storage & Management</CardTitle>
                <CardDescription>
                  Centralized storage for audit-related documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Audit Documents</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop files or click to browse
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Bank_Statements_Q4_2023.pdf</span>
                      </div>
                      <Badge variant="outline">Uploaded Today</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Fixed_Assets_Register.xlsx</span>
                      </div>
                      <Badge variant="outline">2 days ago</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Reminder System</CardTitle>
                <CardDescription>
                  Set up and manage audit deadline reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Bell className="h-6 w-6 mb-2" />
                    Schedule Reminder
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Clock className="h-6 w-6 mb-2" />
                    View Active Reminders
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Upcoming Reminders</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border rounded bg-warning/10">
                      <Bell className="h-4 w-4 text-warning" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Client confirmation letters due</div>
                        <div className="text-xs text-muted-foreground">Due in 2 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and completion analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-success mb-2">{completionPercentage.toFixed(0)}%</div>
                  <div className="text-muted-foreground">Overall Completion Rate</div>
                  <Progress value={completionPercentage} className="mt-4" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}