import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  HelpCircle, 
  Settings, 
  BarChart3, 
  TrendingUp,
  Target,
  Activity,
  AlertTriangle 
} from 'lucide-react';
import { LeadAnalyticsDashboard } from '@/components/admin/LeadAnalyticsDashboard';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { title: 'Active FAQs', value: '45', icon: HelpCircle, change: '+3' },
    { title: 'System Health', value: '98%', icon: BarChart3, change: '+2%' },
    { title: 'Settings', value: '12', icon: Settings, change: '0' },
  ];

  const leadStats = [
    { title: 'Total Leads', value: '847', icon: Users, change: '+23%' },
    { title: 'Conversion Rate', value: '18.5%', icon: Target, change: '+2.3%' },
    { title: 'Active Campaigns', value: '12', icon: Activity, change: '+4' },
    { title: 'High Priority', value: '8', icon: AlertTriangle, change: '-2' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your system and comprehensive analytics.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">New user registration</p>
                      <p className="text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Lead assignment updated</p>
                      <p className="text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">System backup completed</p>
                      <p className="text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Lead Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {leadStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <LeadAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Exports</CardTitle>
              <CardDescription>Generate and download comprehensive reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Lead Performance Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed analysis of lead sources, conversion rates, and advisor performance
                  </p>
                  <Button size="sm" className="w-full">Generate Report</Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Monthly Summary</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive monthly overview of all key metrics and trends
                  </p>
                  <Button size="sm" className="w-full">Generate Report</Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Custom Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build custom reports with specific date ranges and filters
                  </p>
                  <Button size="sm" className="w-full">Create Custom</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}