import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  DollarSign,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  FileText,
  BarChart3,
  UserPlus,
  Settings,
  Star,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyManagementDashboardProps {
  className?: string;
}

export function PropertyManagementDashboard({ className }: PropertyManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for demonstration
  const stats = {
    totalProperties: 47,
    totalUnits: 156,
    occupancyRate: 94.2,
    monthlyRevenue: 125800,
    newInquiries: 8,
    openTickets: 3,
    upcomingTasks: 12
  };

  const recentProperties = [
    {
      id: "1",
      name: "Oceanfront Estate",
      address: "123 Ocean Dr, Malibu, CA",
      type: "Single Family",
      status: "Occupied",
      monthlyRent: 8500,
      owner: "Johnson Family Trust"
    },
    {
      id: "2", 
      name: "Downtown Penthouse",
      address: "456 Fifth Ave, NYC, NY",
      type: "Luxury Condo",
      status: "Available",
      monthlyRent: 12000,
      owner: "Smith Holdings LLC"
    }
  ];

  const upcomingTasks = [
    { id: "1", task: "Lease renewal - Oceanfront Estate", due: "2024-01-15", priority: "high" },
    { id: "2", task: "Annual inspection - Downtown Penthouse", due: "2024-01-18", priority: "medium" },
    { id: "3", task: "Property tax payment - Villa Gardens", due: "2024-01-20", priority: "high" }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Founding Partner Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Management Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio with premium family office tools</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <Star className="h-3 w-3 mr-1" />
            Founding Partner
          </Badge>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalUnits} total units
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.openTickets} urgent items
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Properties and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recent Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{property.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </p>
                      <p className="text-xs text-muted-foreground">{property.owner}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={property.status === "Occupied" ? "default" : "secondary"}>
                        {property.status}
                      </Badge>
                      <p className="text-sm font-medium">${property.monthlyRent.toLocaleString()}/mo</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Properties
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{task.task}</h4>
                      <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                        {task.priority === "high" ? (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        ) : (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Property Portfolio</h2>
            <Button>
              <Building2 className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Property management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Client Management</h2>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Client management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Billing & Invoicing</h2>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Billing interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Document Vault</h2>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Document management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Calendar & Tasks</h2>
            <Button>
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule Task
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Calendar interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Analytics dashboard will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Team Management</h2>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Team management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}