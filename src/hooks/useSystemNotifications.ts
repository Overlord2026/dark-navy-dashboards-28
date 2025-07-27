import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'compliance' | 'maintenance' | 'feature' | 'regulatory' | 'security' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target_audience: string[];
  published_at: string;
  expires_at?: string;
  requires_acknowledgment: boolean;
  is_read?: boolean;
  acknowledged_at?: string;
}

export const useSystemNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, use mock data until the migration is complete
      // TODO: Replace with actual Supabase queries after migration
      const mockNotifications = [
        {
          id: '1',
          title: 'System Maintenance Scheduled',
          message: 'Planned maintenance window on Sunday 2AM-4AM EST. No action required.',
          type: 'maintenance' as const,
          priority: 'medium' as const,
          target_audience: ['all'],
          published_at: new Date().toISOString(),
          requires_acknowledgment: false,
          is_read: false
        },
        {
          id: '2',
          title: 'New Compliance Requirements',
          message: 'Updated SEC regulations effective next month. Please review new documentation.',
          type: 'compliance' as const,
          priority: 'high' as const,
          target_audience: ['all'],
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          requires_acknowledgment: true,
          is_read: false
        }
      ];

      const processedNotifications = mockNotifications;

      setNotifications(processedNotifications);
      
      // Calculate unread count
      const unread = processedNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Implement after migration
      console.log('Mark as read:', notificationId);
      
      // Update local state for now
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAsAcknowledged = async (notificationId: string) => {
    try {
      // TODO: Implement after migration
      console.log('Mark as acknowledged:', notificationId);
      
      // Update local state for now
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, acknowledged_at: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error acknowledging notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Implement after migration
      console.log('Mark all as read');
      
      // Update local state for now
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // TODO: Set up real-time subscription after migration
    // const channel = supabase
    //   .channel('system-notifications')
    //   .on('postgres_changes', 
    //     { event: '*', schema: 'public', table: 'system_notifications' },
    //     () => {
    //       fetchNotifications();
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsAcknowledged,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};