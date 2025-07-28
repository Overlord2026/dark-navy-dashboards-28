import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, AlertTriangle, CheckCircle, Plus, Settings } from "lucide-react";

export const PropertyReminders: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingReminders = [
    {
      id: "1",
      type: "Insurance Renewal",
      property: "Sunset Apartment",
      dueDate: "2024-03-15",
      priority: "high",
      description: "Property insurance policy expires",
      daysUntil: 28
    },
    {
      id: "2",
      type: "Property Tax",
      property: "Downtown Condo", 
      dueDate: "2024-03-20",
      priority: "medium",
      description: "Annual property tax payment due",
      daysUntil: 33
    },
    {
      id: "3",
      type: "Lease Renewal",
      property: "Beach House",
      dueDate: "2024-04-01",
      priority: "low",
      description: "Tenant lease renewal decision",
      daysUntil: 45
    },
    {
      id: "4",
      type: "HVAC Maintenance",
      property: "Sunset Apartment",
      dueDate: "2024-02-28",
      priority: "medium", 
      description: "Scheduled HVAC system service",
      daysUntil: 12
    }
  ];

  const reminderTypes = [
    { id: "insurance", name: "Insurance Renewals", icon: "🛡️", active: true },
    { id: "tax", name: "Property Taxes", icon: "📊", active: true },
    { id: "lease", name: "Lease Management", icon: "📋", active: true },
    { id: "maintenance", name: "Maintenance", icon: "🔧", active: true },
    { id: "mortgage", name: "Mortgage Payments", icon: "🏦", active: false },
    { id: "inspection", name: "Inspections", icon: "🔍", active: true }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getDaysUntilColor = (days: number) => {
    if (days <= 7) return "text-red-600";
    if (days <= 30) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Reminder Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due This Week</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due This Month</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">4</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Reminder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Smart Reminders
            </span>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </CardTitle>
          <CardDescription>
            Set up automatic reminders for important property-related dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {reminderTypes.map((type) => (
              <Card 
                key={type.id} 
                className={`cursor-pointer transition-all ${type.active ? 'ring-2 ring-primary' : 'opacity-60'}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {type.active ? 'Active' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reminders</CardTitle>
          <CardDescription>Important dates and deadlines for your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{reminder.type}</h3>
                      <Badge variant={getPriorityColor(reminder.priority) as any}>
                        {reminder.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{reminder.property}</p>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{reminder.dueDate}</p>
                  <p className={`text-sm ${getDaysUntilColor(reminder.daysUntil)}`}>
                    {reminder.daysUntil} days
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">Snooze</Button>
                    <Button size="sm">Mark Done</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how and when you receive reminder notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Notification Methods:</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">In-app notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">SMS notifications (Premium)</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Default Advance Notice:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Insurance & Tax Deadlines</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>30 days before</option>
                    <option>60 days before</option>
                    <option>90 days before</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Maintenance Tasks</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>7 days before</option>
                    <option>14 days before</option>
                    <option>30 days before</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};