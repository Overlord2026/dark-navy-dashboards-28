import React from 'react';
import { X, Calendar, Trophy } from 'lucide-react';
import { Button } from './button';
import { useInAppNotifications } from '@/hooks/useInAppNotifications';

export const InAppNotificationBanner: React.FC = () => {
  const { notifications, dismissNotification } = useInAppNotifications();

  if (notifications.length === 0) return null;

  const notification = notifications[0]; // Show only the first notification

  const getIcon = () => {
    switch (notification.type) {
      case 'scorecard-reminder':
        return <Trophy className="h-5 w-5 text-primary" />;
      case 'booking-reminder':
        return <Calendar className="h-5 w-5 text-primary" />;
      default:
        return <Trophy className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-6 relative">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-1">
            {notification.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {notification.message}
          </p>
          {notification.cta && (
            <Button 
              size="sm" 
              onClick={notification.cta.action}
              className="bg-primary hover:bg-primary/90"
            >
              {notification.cta.text}
            </Button>
          )}
        </div>
        {notification.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissNotification(notification.id)}
            className="h-6 w-6 p-0 hover:bg-background/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};