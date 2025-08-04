import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Plus, 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  FileText,
  Target
} from 'lucide-react';

interface ComplianceTask {
  id: string;
  title: string;
  type: 'filing' | 'review' | 'training' | 'audit' | 'renewal';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  description?: string;
}

export const ComplianceCalendar: React.FC = () => {
  const [tasks] = useState<ComplianceTask[]>([
    {
      id: '1',
      title: 'ADV Annual Amendment Filing',
      type: 'filing',
      priority: 'high',
      dueDate: '2024-03-31',
      assignee: 'Sarah Chen',
      status: 'in_progress',
      description: 'Complete and file annual amendment to Form ADV'
    },
    {
      id: '2',
      title: 'Q1 AML Policy Review',
      type: 'review',
      priority: 'medium',
      dueDate: '2024-02-15',
      assignee: 'Michael Torres',
      status: 'pending',
      description: 'Review and update AML/BSA policies for Q1'
    },
    {
      id: '3',
      title: 'Cybersecurity Training Completion',
      type: 'training',
      priority: 'high',
      dueDate: '2024-02-28',
      assignee: 'All Staff',
      status: 'pending',
      description: 'Complete mandatory cybersecurity awareness training'
    },
    {
      id: '4',
      title: 'State Registration Renewal - CA',
      type: 'renewal',
      priority: 'high',
      dueDate: '2024-02-20',
      assignee: 'Sarah Chen',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Client File Documentation Audit',
      type: 'audit',
      priority: 'medium',
      dueDate: '2024-02-10',
      assignee: 'Michael Torres',
      status: 'overdue'
    }
  ]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'filing': return <FileText className="h-4 w-4" />;
      case 'review': return <CheckCircle className="h-4 w-4" />;
      case 'training': return <User className="h-4 w-4" />;
      case 'audit': return <Target className="h-4 w-4" />;
      case 'renewal': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-primary">In Progress</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-muted-foreground';
      default: return 'border-l-muted-foreground';
    }
  };

  const upcomingTasks = tasks.filter(task => task.status !== 'completed').slice(0, 3);
  const overdueTasks = tasks.filter(task => task.status === 'overdue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Compliance Calendar & Tasks</h2>
            <p className="text-muted-foreground">Key deadlines, reviews, and task assignments</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Compliance Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input id="task-title" placeholder="Enter task title..." />
                </div>
                <div>
                  <Label htmlFor="task-type">Task Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filing">SEC/State Filing</SelectItem>
                      <SelectItem value="review">Policy Review</SelectItem>
                      <SelectItem value="training">Staff Training</SelectItem>
                      <SelectItem value="audit">Internal Audit</SelectItem>
                      <SelectItem value="renewal">License Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input type="date" id="due-date" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Chen - Compliance Officer</SelectItem>
                      <SelectItem value="michael">Michael Torres - Senior Advisor</SelectItem>
                      <SelectItem value="admin">Admin Team</SelectItem>
                      <SelectItem value="all-staff">All Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Task description..." />
                </div>
                <Button className="w-full btn-primary-gold">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getTaskIcon(task.type)}
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()} • {task.assignee}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">
                    Review Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="deadlines">Key Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Next 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} pl-4 py-3 bg-muted/30 rounded-r-lg`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTaskIcon(task.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(task.status)}
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Automated Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-warning" />
                      <div>
                        <p className="font-medium">ADV Due March 31, 2025</p>
                        <p className="text-xs text-muted-foreground">Annual amendment filing deadline approaching</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Training Certification Expiring</p>
                        <p className="text-xs text-muted-foreground">3 staff members need renewal</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div>
                        <p className="font-medium">Q4 Policy Review Complete</p>
                        <p className="text-xs text-muted-foreground">All policies updated and approved</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Monthly Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Interactive calendar view coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Will show all compliance deadlines, tasks, and reminders in a visual calendar format
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Key Filing Deadlines 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-primary">Form ADV</h4>
                    <p className="text-2xl font-bold mt-2">Mar 31</p>
                    <p className="text-xs text-muted-foreground">Annual Amendment</p>
                  </div>
                  <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                    <h4 className="font-semibold text-warning">Form PF</h4>
                    <p className="text-2xl font-bold mt-2">Apr 30</p>
                    <p className="text-xs text-muted-foreground">If Applicable</p>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                    <h4 className="font-semibold text-success">Form 13F</h4>
                    <p className="text-2xl font-bold mt-2">May 15</p>
                    <p className="text-xs text-muted-foreground">Quarterly Filing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};