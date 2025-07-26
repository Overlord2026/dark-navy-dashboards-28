import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  FileText, 
  Calendar, 
  DollarSign,
  Users,
  Trash2,
  Mail,
  Archive,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  onUnreadCountChange: (count: number) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'document' | 'meeting' | 'financial' | 'system' | 'professional';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    documentName?: string;
    professionalName?: string;
    amount?: number;
  };
}

export function NotificationCenter({ onUnreadCountChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Document Shared',
      message: 'John Smith (CPA) has shared tax preparation documents with you',
      type: 'info',
      category: 'document',
      timestamp: '2024-01-26T10:30:00Z',
      read: false,
      metadata: {
        documentName: 'Tax Preparation Checklist 2024',
        professionalName: 'John Smith'
      }
    },
    {
      id: '2',
      title: 'Meeting Reminder',
      message: 'Estate planning consultation with Sarah Johnson is tomorrow at 2:00 PM',
      type: 'warning',
      category: 'meeting',
      timestamp: '2024-01-25T15:00:00Z',
      read: false,
      metadata: {
        professionalName: 'Sarah Johnson'
      }
    },
    {
      id: '3',
      title: 'Portfolio Update',
      message: 'Your investment portfolio has been rebalanced by Michael Chen',
      type: 'success',
      category: 'financial',
      timestamp: '2024-01-24T09:15:00Z',
      read: false,
      metadata: {
        professionalName: 'Michael Chen'
      }
    },
    {
      id: '4',
      title: 'Document Comment',
      message: 'New comment added to your insurance policy document',
      type: 'info',
      category: 'document',
      timestamp: '2024-01-23T14:20:00Z',
      read: true,
      metadata: {
        documentName: 'Life Insurance Policy - Amendment'
      }
    },
    {
      id: '5',
      title: 'Professional Invitation',
      message: 'Lisa Anderson (Insurance Agent) has been added to your team',
      type: 'success',
      category: 'professional',
      timestamp: '2024-01-22T11:30:00Z',
      read: true,
      metadata: {
        professionalName: 'Lisa Anderson'
      }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'success') return CheckCircle;
    if (type === 'warning') return AlertTriangle;
    if (type === 'error') return AlertTriangle;
    
    switch (category) {
      case 'document': return FileText;
      case 'meeting': return Calendar;
      case 'financial': return DollarSign;
      case 'professional': return Users;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const categories = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'document', label: 'Documents', count: notifications.filter(n => n.category === 'document').length },
    { id: 'meeting', label: 'Meetings', count: notifications.filter(n => n.category === 'meeting').length },
    { id: 'financial', label: 'Financial', count: notifications.filter(n => n.category === 'financial').length },
    { id: 'professional', label: 'Professionals', count: notifications.filter(n => n.category === 'professional').length }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={filter === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category.id)}
            className="flex items-center gap-1"
          >
            {category.label}
            <Badge variant="secondary" className="ml-1 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "No notifications found for this filter."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type, notification.category);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-accent/50 transition-colors ${
                        !notification.read ? 'bg-accent/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-muted flex-shrink-0`}>
                          <Icon className={`h-4 w-4 ${getNotificationColor(notification.type)}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getCategoryColor(notification.category)}`}
                                >
                                  {notification.category}
                                </Badge>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {notification.read ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnread(notification.id)}
                                >
                                  <Mail className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}