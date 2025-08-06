import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, HelpCircle, MessageSquare, FileText, Activity } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SupportAlerts = () => {
  const [unreadCount] = useState(3);
  
  const notifications = [
    {
      id: 1,
      type: 'message',
      icon: MessageSquare,
      title: 'New message from your advisor',
      description: 'Portfolio review completed',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'document',
      icon: FileText,
      title: 'Document uploaded',
      description: 'Q4 Performance Report added to vault',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'activity',
      icon: Activity,
      title: 'Account activity',
      description: 'New transaction in checking account',
      time: '1 day ago',
      unread: true
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Notification Bell */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="rounded-full relative shadow-lg">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 px-2 py-0 text-xs bg-destructive text-destructive-foreground"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <DropdownMenuItem key={notification.id} className="p-3">
                <div className="flex gap-3 w-full">
                  <div className="flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center">
            <Button variant="ghost" size="sm">View all notifications</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Need Help Button */}
      <Button size="lg" variant="secondary" className="rounded-full shadow-lg gap-2">
        <HelpCircle className="h-5 w-5" />
        Need Help?
      </Button>
    </div>
  );
};