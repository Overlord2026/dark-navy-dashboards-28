import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Shield, 
  TrendingUp,
  Calendar,
  AlertTriangle,
  Settings
} from "lucide-react";

export function NotificationsAlertsSection() {
  const notificationChannels = [
    { id: 'email', name: 'Email', icon: Mail, enabled: true },
    { id: 'sms', name: 'SMS/Text', icon: MessageSquare, enabled: true },
    { id: 'push', name: 'Push Notifications', icon: Smartphone, enabled: false },
    { id: 'inApp', name: 'In-App Notifications', icon: Bell, enabled: true }
  ];

  const notificationTypes = [
    {
      category: 'Account & Security',
      icon: Shield,
      notifications: [
        { id: 'login', name: 'New device login', description: 'Alert when signing in from a new device', email: true, sms: true, push: false, inApp: true },
        { id: 'password', name: 'Password changes', description: 'Notify when password is changed', email: true, sms: true, push: false, inApp: true },
        { id: 'security', name: 'Security alerts', description: 'Important security notifications', email: true, sms: true, push: true, inApp: true }
      ]
    },
    {
      category: 'Financial Updates',
      icon: TrendingUp,
      notifications: [
        { id: 'goals', name: 'Goal milestones', description: 'When you reach financial milestones', email: true, sms: false, push: true, inApp: true },
        { id: 'accounts', name: 'Account changes', description: 'New accounts or balance updates', email: true, sms: false, push: false, inApp: true },
        { id: 'performance', name: 'Portfolio performance', description: 'Weekly/monthly performance summaries', email: true, sms: false, push: false, inApp: false }
      ]
    },
    {
      category: 'Team & Collaboration',
      icon: MessageSquare,
      notifications: [
        { id: 'messages', name: 'New messages', description: 'Messages from your professional team', email: true, sms: false, push: true, inApp: true },
        { id: 'assignments', name: 'New professional assignments', description: 'When a new professional is assigned', email: true, sms: true, push: false, inApp: true },
        { id: 'requests', name: 'Access requests', description: 'Professional access requests requiring approval', email: true, sms: true, push: true, inApp: true }
      ]
    },
    {
      category: 'Appointments & Reminders',
      icon: Calendar,
      notifications: [
        { id: 'meetings', name: 'Meeting reminders', description: 'Upcoming meetings with your team', email: true, sms: true, push: true, inApp: true },
        { id: 'deadlines', name: 'Important deadlines', description: 'Tax deadlines, document renewals, etc.', email: true, sms: true, push: true, inApp: true },
        { id: 'birthdays', name: 'Family birthdays', description: 'Birthday reminders for family members', email: false, sms: false, push: true, inApp: true }
      ]
    },
    {
      category: 'Product Updates',
      icon: Settings,
      notifications: [
        { id: 'features', name: 'New features', description: 'Announcements about new platform features', email: true, sms: false, push: false, inApp: true },
        { id: 'maintenance', name: 'Maintenance notices', description: 'Scheduled maintenance and downtime', email: true, sms: false, push: false, inApp: true },
        { id: 'tips', name: 'Tips & insights', description: 'Educational content and best practices', email: false, sms: false, push: false, inApp: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <channel.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">{channel.name}</Label>
                    {channel.enabled ? (
                      <Badge variant="default" className="ml-2 text-xs">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2 text-xs">Disabled</Badge>
                    )}
                  </div>
                </div>
                <Switch defaultChecked={channel.enabled} />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <Label className="font-medium">Notification Frequency</Label>
            </div>
            <Select defaultValue="immediate">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences by Category */}
      {notificationTypes.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.notifications.map((notification) => (
                <div key={notification.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="font-medium">{notification.name}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 ml-0">
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`${notification.id}-email`} 
                        defaultChecked={notification.email}
                      />
                      <Label htmlFor={`${notification.id}-email`} className="text-xs">Email</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`${notification.id}-sms`} 
                        defaultChecked={notification.sms}
                      />
                      <Label htmlFor={`${notification.id}-sms`} className="text-xs">SMS</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`${notification.id}-push`} 
                        defaultChecked={notification.push}
                      />
                      <Label htmlFor={`${notification.id}-push`} className="text-xs">Push</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`${notification.id}-app`} 
                        defaultChecked={notification.inApp}
                      />
                      <Label htmlFor={`${notification.id}-app`} className="text-xs">In-App</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Enable All Notifications
            </Button>
            <Button variant="outline" size="sm">
              Essential Only
            </Button>
            <Button variant="outline" size="sm">
              Disable All
            </Button>
            <Button variant="outline" size="sm">
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}