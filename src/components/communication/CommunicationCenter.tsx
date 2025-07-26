import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Calendar, 
  Bell, 
  FileText, 
  Users, 
  Send,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { NotificationCenter } from './NotificationCenter';
import { SchedulingPanel } from './SchedulingPanel';
import { DocumentComments } from './DocumentComments';
import { MilestoneAlerts } from './MilestoneAlerts';

interface CommunicationCenterProps {
  className?: string;
}

export function CommunicationCenter({ className }: CommunicationCenterProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [unreadCount, setUnreadCount] = useState({
    messages: 3,
    notifications: 5,
    comments: 2,
    milestones: 1
  });

  const stats = [
    {
      title: 'Active Conversations',
      value: '8',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      title: 'Upcoming Meetings',
      value: '3',
      icon: Calendar,
      color: 'text-green-500'
    },
    {
      title: 'Unread Notifications',
      value: unreadCount.notifications,
      icon: Bell,
      color: 'text-orange-500'
    },
    {
      title: 'Document Comments',
      value: unreadCount.comments,
      icon: FileText,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-muted-foreground">Stay connected with your professional team</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Communication Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat" className="relative">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
            {unreadCount.messages > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0">
                {unreadCount.messages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
            {unreadCount.notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0">
                {unreadCount.notifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="relative">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="comments" className="relative">
            <FileText className="h-4 w-4 mr-2" />
            Comments
            {unreadCount.comments > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0">
                {unreadCount.comments}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="milestones" className="relative">
            <CheckCircle className="h-4 w-4 mr-2" />
            Milestones
            {unreadCount.milestones > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0">
                {unreadCount.milestones}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <ChatPanel onUnreadCountChange={(count) => setUnreadCount(prev => ({ ...prev, messages: count }))} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationCenter onUnreadCountChange={(count) => setUnreadCount(prev => ({ ...prev, notifications: count }))} />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <SchedulingPanel />
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <DocumentComments onUnreadCountChange={(count) => setUnreadCount(prev => ({ ...prev, comments: count }))} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <MilestoneAlerts onUnreadCountChange={(count) => setUnreadCount(prev => ({ ...prev, milestones: count }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
}