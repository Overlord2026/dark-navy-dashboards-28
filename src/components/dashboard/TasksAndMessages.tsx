import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MessageSquare, 
  Plus,
  User,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignee?: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'normal';
}

export const TasksAndMessages: React.FC = () => {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Q4 Tax Documents',
      description: 'Complete review of client tax documentation',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-02-15',
      assignee: 'John Smith'
    },
    {
      id: '2', 
      title: 'Client Meeting Prep',
      description: 'Prepare materials for Thompson family meeting',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-02-12',
      assignee: 'You'
    },
    {
      id: '3',
      title: 'Update Investment Allocation',
      description: 'Rebalance portfolio based on new goals',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-02-20'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      from: 'Sarah Johnson',
      subject: 'Estate Planning Update',
      preview: 'The trust documentation has been reviewed and is ready for...',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      from: 'Mike Chen',
      subject: 'Investment Performance Report',
      preview: 'Your portfolio has outperformed the benchmark by 2.3%...',
      timestamp: '5 hours ago',
      read: true,
      priority: 'normal'
    },
    {
      id: '3',
      from: 'Lisa Williams',
      subject: 'Tax Season Preparation',
      preview: 'Please review the attached documents for your upcoming...',
      timestamp: '1 day ago',
      read: false,
      priority: 'normal'
    }
  ]);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low' | 'normal') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-80 bg-background border-l border-border">
      <Tabs defaultValue="tasks" className="h-full">
        <div className="p-4 border-b border-border">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="text-sm">Tasks</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">Messages</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks" className="m-0 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">My Tasks</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {task.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.dueDate)}</span>
                          {task.assignee && (
                            <>
                              <User className="h-3 w-3 ml-2" />
                              <span>{task.assignee}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="w-full justify-between">
            View All Tasks
            <ArrowRight className="h-4 w-4" />
          </Button>
        </TabsContent>

        <TabsContent value="messages" className="m-0 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Messages</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-sm transition-shadow cursor-pointer ${
                  !message.read ? 'border-primary/50' : ''
                }`}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm ${message.read ? 'font-normal' : 'font-semibold'} text-foreground truncate`}>
                            {message.from}
                          </h4>
                          {message.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              !
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${message.read ? 'font-normal' : 'font-medium'} text-foreground truncate`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {message.preview}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {message.timestamp}
                        </p>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="w-full justify-between">
            View All Messages
            <ArrowRight className="h-4 w-4" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};