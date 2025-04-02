
import React from "react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Pill, Shield, FileSymlink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { addDays, differenceInDays, parseISO, format } from "date-fns";

interface Reminder {
  id: string;
  type: "prescription" | "insurance" | "appointment" | "document";
  title: string;
  dueDate: string;
  entity: string;
  priority: "low" | "medium" | "high";
  notified: boolean;
}

interface HealthcareNotificationsProps {
  upcomingAppointments: Array<{
    id: string;
    title: string;
    doctor: string;
    date: Date;
  }>;
  medications: Array<{
    id: string;
    name: string;
    nextRefill: Date;
  }>;
  policies: Array<{
    id: string;
    name: string;
    endDate?: string;
  }>;
}

export const HealthcareNotifications: React.FC<HealthcareNotificationsProps> = ({
  upcomingAppointments,
  medications,
  policies
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage("healthcare-notifications-enabled", true);
  const [emailNotifications, setEmailNotifications] = useLocalStorage("healthcare-email-notifications", false);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>("healthcare-reminders", []);
  
  // Check for upcoming reminders and generate notifications
  React.useEffect(() => {
    if (!notificationsEnabled) return;
    
    const newReminders: Reminder[] = [];
    
    // Check medications for refills due in the next 7 days
    medications.forEach(med => {
      const daysUntilRefill = differenceInDays(med.nextRefill, new Date());
      if (daysUntilRefill <= 7 && daysUntilRefill >= 0) {
        const existingReminder = reminders.find(r => 
          r.type === "prescription" && r.title === med.name && r.id === med.id
        );
        
        if (!existingReminder) {
          newReminders.push({
            id: med.id,
            type: "prescription",
            title: `${med.name} refill due soon`,
            dueDate: med.nextRefill.toISOString(),
            entity: med.name,
            priority: daysUntilRefill <= 2 ? "high" : "medium",
            notified: false
          });
        }
      }
    });
    
    // Check upcoming appointments in the next 3 days
    upcomingAppointments.forEach(apt => {
      const daysUntilAppointment = differenceInDays(apt.date, new Date());
      if (daysUntilAppointment <= 3 && daysUntilAppointment >= 0) {
        const existingReminder = reminders.find(r => 
          r.type === "appointment" && r.id === apt.id
        );
        
        if (!existingReminder) {
          newReminders.push({
            id: apt.id,
            type: "appointment",
            title: `Upcoming appointment: ${apt.title}`,
            dueDate: apt.date.toISOString(),
            entity: apt.doctor,
            priority: daysUntilAppointment <= 1 ? "high" : "medium",
            notified: false
          });
        }
      }
    });
    
    // Check insurance policies for renewals due in the next 30 days
    policies.forEach(policy => {
      if (policy.endDate) {
        const endDate = parseISO(policy.endDate);
        const daysUntilExpiration = differenceInDays(endDate, new Date());
        
        if (daysUntilExpiration <= 30 && daysUntilExpiration >= 0) {
          const existingReminder = reminders.find(r => 
            r.type === "insurance" && r.id === policy.id
          );
          
          if (!existingReminder) {
            newReminders.push({
              id: policy.id,
              type: "insurance",
              title: `Insurance policy renewal: ${policy.name}`,
              dueDate: policy.endDate,
              entity: policy.name,
              priority: daysUntilExpiration <= 7 ? "high" : "medium",
              notified: false
            });
          }
        }
      }
    });
    
    // Add new reminders and update state
    if (newReminders.length > 0) {
      setReminders([...reminders, ...newReminders]);
      
      // Show toast for new high priority reminders
      const highPriorityReminders = newReminders.filter(r => r.priority === "high");
      if (highPriorityReminders.length > 0) {
        toast({
          title: "Important Healthcare Reminder",
          description: `You have ${highPriorityReminders.length} urgent healthcare ${highPriorityReminders.length === 1 ? 'reminder' : 'reminders'}`,
          variant: "default"
        });
      }
      
      // Simulate email notification
      if (emailNotifications && newReminders.length > 0) {
        console.log("Email notification would be sent:", newReminders);
      }
    }
  }, [medications, upcomingAppointments, policies, notificationsEnabled, emailNotifications]);
  
  const dismissReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };
  
  const dismissAllReminders = () => {
    setReminders([]);
    toast({
      title: "All reminders cleared",
      description: "Your healthcare reminder list has been cleared"
    });
  };
  
  const getReminderIcon = (type: string) => {
    switch (type) {
      case "prescription": return <Pill className="h-4 w-4 text-blue-500" />;
      case "insurance": return <Shield className="h-4 w-4 text-green-500" />;
      case "appointment": return <Calendar className="h-4 w-4 text-amber-500" />;
      case "document": return <FileSymlink className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Healthcare Reminders
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications-enabled"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Label htmlFor="email-notifications">Email Alerts</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  {getReminderIcon(reminder.type)}
                  <div>
                    <div className="font-medium">{reminder.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {reminder.entity} • Due {format(parseISO(reminder.dueDate), "MMM d, yyyy")}
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(reminder.priority) as any}>
                    {reminder.priority}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => dismissReminder(reminder.id)}
                >
                  Dismiss
                </Button>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={dismissAllReminders}
              >
                Clear All
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No healthcare reminders</p>
            <p className="text-sm">You'll be notified when there are important healthcare deadlines</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
