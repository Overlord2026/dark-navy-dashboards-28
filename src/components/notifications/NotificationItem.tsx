import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Info, Shield, Settings, Zap } from 'lucide-react';
import { SystemNotification, useSystemNotifications } from '@/hooks/useSystemNotifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: SystemNotification;
  compact?: boolean;
}

export const NotificationItem = ({ notification, compact = false }: NotificationItemProps) => {
  const { markAsRead, markAsAcknowledged } = useSystemNotifications();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'feature': return <Zap className="h-4 w-4" />;
      case 'regulatory': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compliance': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'security': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'maintenance': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'feature': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'regulatory': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const handleRead = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleAcknowledge = () => {
    markAsAcknowledged(notification.id);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
          !notification.is_read && "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
        )}
        onClick={handleRead}
      >
        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded-full", getTypeColor(notification.type))}>
            {getTypeIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{notification.title}</h4>
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant={getPriorityBadgeVariant(notification.priority)} className="text-xs">
                {notification.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.published_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      "p-4 transition-colors",
      !notification.is_read && "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-full", getTypeColor(notification.type))}>
          {getTypeIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-base">{notification.title}</h3>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>
          
          <p className="text-muted-foreground mb-3">{notification.message}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                {notification.priority}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {notification.type}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(notification.published_at), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {!notification.is_read && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRead}
                className="text-xs"
              >
                Mark as read
              </Button>
            )}
            
            {notification.requires_acknowledgment && !notification.acknowledged_at && (
              <Button
                variant="default"
                size="sm"
                onClick={handleAcknowledge}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};