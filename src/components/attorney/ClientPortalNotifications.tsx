import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  priority: string;
  action_url: string | null;
  created_at: string;
  read_at: string | null;
  client_name?: string;
}

export function ClientPortalNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'high-priority'>('all');
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('client_portal_notifications')
        .select('*')
        .eq('attorney_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Get client profiles separately
      const clientIds = data?.map(n => n.client_id).filter(Boolean) || [];
      let clientProfiles: any[] = [];
      
      if (clientIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', clientIds);
        
        if (!profilesError) {
          clientProfiles = profilesData || [];
        }
      }

      const transformedNotifications = data?.map(notification => {
        const profile = notification.client_id 
          ? clientProfiles.find(p => p.id === notification.client_id)
          : null;
        
        return {
          ...notification,
          client_name: profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Client'
            : 'System'
        };
      }) || [];

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error loading notifications",
        description: "Could not load notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('client_portal_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('client_portal_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('attorney_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          is_read: true, 
          read_at: new Date().toISOString() 
        }))
      );

      toast({
        title: "All notifications marked as read",
        description: "Successfully marked all notifications as read.",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error updating notifications",
        description: "Could not mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_shared':
      case 'document_uploaded':
        return <FileText className="h-4 w-4" />;
      case 'message_received':
        return <MessageSquare className="h-4 w-4" />;
      case 'appointment_scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return null;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'document_shared':
        return 'Document Shared';
      case 'document_uploaded':
        return 'Document Uploaded';
      case 'message_received':
        return 'Message Received';
      case 'appointment_scheduled':
        return 'Appointment Scheduled';
      case 'system':
        return 'System Notification';
      default:
        return 'Notification';
    }
  };

  let filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.client_name && notification.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filter === 'unread') {
    filteredNotifications = filteredNotifications.filter(n => !n.is_read);
  } else if (filter === 'high-priority') {
    filteredNotifications = filteredNotifications.filter(n => n.priority === 'high');
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            size="sm"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'high-priority' ? 'default' : 'outline'}
            onClick={() => setFilter('high-priority')}
            size="sm"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            High Priority
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications found.</p>
                <p className="text-sm">Portal activities and updates will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all ${
                !notification.is_read 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !notification.is_read ? 'bg-blue-100' : 'bg-muted'
                  }`}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getNotificationTypeLabel(notification.notification_type)}
                        </Badge>
                        {getPriorityBadge(notification.priority)}
                        {!notification.is_read && (
                          <Badge variant="default" className="h-5 w-5 p-0 text-xs">•</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.client_name && notification.client_name !== 'System' && (
                          <span className="text-xs text-muted-foreground">
                            from {notification.client_name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                        </span>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 px-2 text-xs"
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    
                    {notification.action_url && (
                      <Button variant="link" className="h-auto p-0 mt-2 text-xs">
                        View Details →
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}