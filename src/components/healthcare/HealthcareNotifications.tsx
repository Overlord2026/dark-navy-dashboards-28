
import React from "react";
import { Bell, X, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Hospital, User, MapPin, AlertCircle, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge-extended";

interface HealthcareNotificationsProps {
  upcomingAppointments?: {
    id: string;
    title: string;
    doctor: string;
    date: Date;
    time: string;
    notes: string;
    location: string;
  }[];
  medications?: {
    id: string;
    name: string;
    nextRefill: string;
    dosage: string;
    frequency: string;
    doctor: string;
    pharmacy: string;
  }[];
  policies?: {
    id: string;
    name: string;
    endDate: string;
  }[];
}

const notifications = [
  {
    id: "1",
    title: "Appointment Reminder",
    description: "Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM.",
    time: "8:00 AM",
    type: "Reminder",
    isRead: false,
  },
  {
    id: "2",
    title: "Medication Alert",
    description: "Remember to take your medication at 12:00 PM.",
    time: "11:30 AM",
    type: "Alert",
    isRead: false,
  },
  {
    id: "3",
    title: "Lab Results Available",
    description: "Your recent lab results are now available in your portal.",
    time: "Yesterday",
    type: "Update",
    isRead: true,
  },
  {
    id: "4",
    title: "Upcoming Checkup",
    description: "Schedule your annual checkup with Dr. Johnson.",
    time: "2 days ago",
    type: "Reminder",
    isRead: true,
  },
  {
    id: "5",
    title: "New Message",
    description: "You have a new message from your healthcare provider.",
    time: "1 week ago",
    type: "Message",
    isRead: true,
  },
];

const HealthcareNotifications: React.FC<HealthcareNotificationsProps> = ({
  upcomingAppointments = [],
  medications = [],
  policies = []
}) => {
  const [readNotifications, setReadNotifications] = React.useState<string[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = React.useState<string[]>([]);

  const markAsRead = (id: string) => {
    setReadNotifications([...readNotifications, id]);
  };

  const dismissNotification = (id: string) => {
    setDismissedNotifications([...dismissedNotifications, id]);
  };

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id) &&
      !dismissedNotifications.includes(notification.id)
  );

  return (
    <div className="w-full max-w-md rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:transition-none">
      <div className="flex items-center justify-between rounded-t-md border-b p-4">
        <div className="flex items-center">
          <Bell className="mr-2 h-4 w-4" />
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
      </div>
      <ScrollArea className="h-[400px] p-0">
        {unreadNotifications.length > 0 ? (
          unreadNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              description={notification.description}
              time={notification.time}
              type={notification.type}
              isRead={readNotifications.includes(notification.id)}
              onMarkRead={() => markAsRead(notification.id)}
              onDismiss={() => dismissNotification(notification.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  type: string;
  isRead: boolean;
  onMarkRead: () => void;
  onDismiss: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  title, 
  description, 
  time, 
  type, 
  isRead, 
  onMarkRead, 
  onDismiss 
}) => {
  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  // Get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch (type) {
      case "Reminder":
        return <Calendar className="h-4 w-4" />;
      case "Alert":
        return <AlertCircle className="h-4 w-4" />;
      case "Update":
        return <Pill className="h-4 w-4" />;
      case "Message":
        return <User className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className={`p-4 ${isRead ? 'bg-background' : 'bg-muted/30'} border-b border-border`}>
      <div className="flex items-center justify-end gap-2">
        {!isRead && (
          <button
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={handleMarkRead}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Mark as read</span>
          </button>
        )}
        <button
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-background p-2 border border-border">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{title}</h4>
            <Badge variant="warning" className="text-xs py-0">
              {type}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">{time}</div>
    </div>
  );
};

export default HealthcareNotifications;
