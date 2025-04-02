
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Users, AlertCircle, Info, Calendar, Clock, User, Mail } from "lucide-react";
import { auditLog } from "@/services/auditLog/auditLogService";
import { DocumentItem } from "@/types/document";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface HealthcareNotification {
  id: string;
  type: 'document_share' | 'document_upload' | 'document_update' | 'reminder' | 'access_request';
  documentId?: string;
  documentName?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sender?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface HealthcareNotificationCenterProps {
  documents: DocumentItem[];
}

export function HealthcareNotificationCenter({ documents }: HealthcareNotificationCenterProps) {
  const [notifications, setNotifications] = useLocalStorage<HealthcareNotification[]>("healthcare-notifications", []);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // If no notifications exist, create sample notifications
    if (notifications.length === 0) {
      const sampleNotifications: HealthcareNotification[] = [
        {
          id: "notif-1",
          type: "document_share",
          documentId: "doc-123",
          documentName: "Medicare Supplement Policy",
          message: "Dr. Sarah Smith has viewed your Medicare Supplement Policy",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          isRead: false,
          sender: "system",
          priority: "medium"
        },
        {
          id: "notif-2",
          type: "reminder",
          message: "Your annual wellness checkup is scheduled in 3 days",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isRead: true,
          priority: "high"
        },
        {
          id: "notif-3",
          type: "document_upload",
          documentId: "doc-456",
          documentName: "Lab Results",
          message: "New lab results have been uploaded to your healthcare folder",
          timestamp: new Date().toISOString(),
          isRead: false,
          sender: "Dr. James Wilson",
          priority: "high"
        }
      ];
      
      setNotifications(sampleNotifications);
    }
  }, [notifications.length, setNotifications]);
  
  // Listen for document creation/modification events in the auditLog
  useEffect(() => {
    // In a real app, this would be a subscription to a real-time event source
    // This is a simplified example
    const recentLogs = auditLog.getRecentEntries()
      .filter(entry => 
        (entry.eventType === 'document_creation' || 
         entry.eventType === 'document_modification' ||
         entry.eventType === 'document_share') && 
        entry.metadata?.resourceType?.includes('healthcare')
      );
      
    if (recentLogs.length > 0) {
      // Process logs and generate new notifications if needed
      const existingNotificationIds = notifications.map(n => n.id);
      
      const newNotifications = recentLogs
        .filter(log => !existingNotificationIds.includes(log.id))
        .map(log => {
          const notificationType = 
            log.eventType === 'document_creation' ? 'document_upload' :
            log.eventType === 'document_share' ? 'document_share' : 
            'document_update';
            
          return {
            id: log.id,
            type: notificationType as 'document_share' | 'document_upload' | 'document_update',
            documentId: log.metadata?.resourceId,
            documentName: log.metadata?.details?.documentName,
            message: getNotificationMessage(log),
            timestamp: log.timestamp.toISOString(),
            isRead: false,
            sender: log.userName || 'system',
            priority: 'medium'
          } as HealthcareNotification;
        });
        
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    }
  }, [notifications, setNotifications]);
  
  const getNotificationMessage = (logEntry: any): string => {
    switch (logEntry.eventType) {
      case 'document_creation':
        return `New document "${logEntry.metadata?.details?.documentName}" has been added to your healthcare folder`;
      case 'document_modification':
        return `Document "${logEntry.metadata?.details?.documentName}" has been updated`;
      case 'document_share':
        return `Document "${logEntry.metadata?.details?.documentName}" has been shared with ${logEntry.metadata?.details?.sharedWith?.length || 0} collaborator(s)`;
      default:
        return 'You have a new healthcare notification';
    }
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  const clearNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  const getFilteredNotifications = () => {
    if (!activeFilter) return notifications;
    return notifications.filter(notification => notification.type === activeFilter);
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'document_share': return <Users className="h-5 w-5 text-blue-500" />;
      case 'document_upload': return <Info className="h-5 w-5 text-green-500" />;
      case 'document_update': return <Info className="h-5 w-5 text-amber-500" />;
      case 'reminder': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'access_request': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </div>
        </CardTitle>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button 
            variant={!activeFilter ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter(null)}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "document_share" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("document_share")}
            className="flex items-center gap-1"
          >
            <Users className="h-3.5 w-3.5" /> Shares
          </Button>
          <Button 
            variant={activeFilter === "document_upload" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("document_upload")}
            className="flex items-center gap-1"
          >
            <Info className="h-3.5 w-3.5" /> Uploads
          </Button>
          <Button 
            variant={activeFilter === "reminder" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("reminder")}
            className="flex items-center gap-1"
          >
            <Calendar className="h-3.5 w-3.5" /> Reminders
          </Button>
        </div>
        
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {getFilteredNotifications().length > 0 ? (
            getFilteredNotifications().map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border ${notification.isRead ? 'bg-background' : 'bg-accent/20'}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex gap-2 ml-2 flex-shrink-0">
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => clearNotification(notification.id)}
                          className="h-6 w-6 text-red-500"
                        >
                          <span className="sr-only">Delete</span>
                          &times;
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {notification.sender && notification.sender !== 'system' && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{notification.sender}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(notification.timestamp).toLocaleDateString()} {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {notification.priority === 'high' && (
                        <Badge variant="destructive" className="px-1 py-0 text-[10px]">
                          High Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
