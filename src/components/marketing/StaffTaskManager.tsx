import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, User, Mail } from 'lucide-react';

interface Task {
  id: string;
  type: 'review' | 'vip_approval' | 'error' | 'follow_up';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  contactName: string;
  contactEmail: string;
  assignedTo?: string;
  createdAt: Date;
  dueAt?: Date;
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'vip_approval',
    title: 'VIP Contact Needs Approval',
    description: 'High-profile advisor from Goldman Sachs needs custom outreach',
    priority: 'high',
    contactName: 'Michael Thompson',
    contactEmail: 'mthompson@goldmansachs.com',
    createdAt: new Date(),
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'error',
    title: 'Email Bounce - Invalid Address',
    description: 'Email bounced, needs correction or removal',
    priority: 'medium',
    contactName: 'Sarah Wilson',
    contactEmail: 'swilson@oldcompany.com',
    createdAt: new Date()
  },
  {
    id: '3',
    type: 'review',
    title: 'Missing LinkedIn Profile',
    description: 'Contact uploaded without LinkedIn URL, manual research needed',
    priority: 'low',
    contactName: 'David Chen',
    contactEmail: 'dchen@wealthpartners.com',
    createdAt: new Date()
  }
];

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'vip_approval': return <User className="h-4 w-4" />;
    case 'error': return <AlertCircle className="h-4 w-4" />;
    case 'review': return <Clock className="h-4 w-4" />;
    case 'follow_up': return <Mail className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

export default function StaffTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.type === filter;
  });

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const taskCounts = {
    all: tasks.length,
    vip_approval: tasks.filter(t => t.type === 'vip_approval').length,
    error: tasks.filter(t => t.type === 'error').length,
    review: tasks.filter(t => t.type === 'review').length,
    follow_up: tasks.filter(t => t.type === 'follow_up').length
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Task Manager</CardTitle>
        <CardDescription>
          Manual review items requiring staff attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Tasks ({taskCounts.all})
          </Button>
          <Button
            variant={filter === 'vip_approval' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('vip_approval')}
          >
            VIP Approval ({taskCounts.vip_approval})
          </Button>
          <Button
            variant={filter === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('error')}
          >
            Errors ({taskCounts.error})
          </Button>
          <Button
            variant={filter === 'review' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('review')}
          >
            Review ({taskCounts.review})
          </Button>
          <Button
            variant={filter === 'follow_up' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('follow_up')}
          >
            Follow-up ({taskCounts.follow_up})
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No pending tasks! Great work.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTaskIcon(task.type)}
                        <h4 className="font-semibold">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span><strong>Contact:</strong> {task.contactName}</span>
                        <span><strong>Email:</strong> {task.contactEmail}</span>
                        {task.dueAt && (
                          <span className="text-red-600">
                            <strong>Due:</strong> {task.dueAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}