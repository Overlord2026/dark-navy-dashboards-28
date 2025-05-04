
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Clock, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "system" | "update" | "security";
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Security Alert",
      description: "Your password was changed successfully.",
      timestamp: "2 hours ago",
      read: false,
      type: "security"
    },
    {
      id: "2",
      title: "System Update",
      description: "The system will be undergoing maintenance on Friday night.",
      timestamp: "Yesterday",
      read: true,
      type: "system"
    },
    {
      id: "3",
      title: "New Feature Available",
      description: "Check out our new report generation tools!",
      timestamp: "3 days ago",
      read: true,
      type: "update"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="container py-8">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {notifications.length > 0 ? notifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications to display
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications you haven't seen yet</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {notifications.filter(n => !n.read).length > 0 ? (
                    notifications
                      .filter(n => !n.read)
                      .map((notification) => (
                        <NotificationItem 
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                        />
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No unread notifications
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about security-related events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications about system maintenance and updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Feature Announcements</Label>
                    <p className="text-sm text-muted-foreground">Learn about new features and improvements</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case "security": return <Shield className="h-5 w-5 text-red-500" />;
      case "system": return <Settings className="h-5 w-5 text-blue-500" />;
      case "update": return <Bell className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border flex items-start gap-4 ${
        notification.read ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <div className="rounded-full p-2 bg-muted">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{notification.title}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {notification.timestamp}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
        {!notification.read && (
          <button 
            className="text-xs text-primary mt-2"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

// Need to import missing component
const Button = ({ children, variant, onClick }: { children: React.ReactNode; variant?: string; onClick?: () => void }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses = variant === "outline" 
    ? "border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" 
    : "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Shield = Clock; // Temporarily reuse Clock icon

export default NotificationsPage;
