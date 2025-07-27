import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileText, BookOpen, TrendingUp, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function AccountantDashboard() {
  const metrics = {
    totalClients: 85,
    activeTaxReturns: 23,
    completedReturns: 147,
    monthlyRevenue: '$42,500',
    pendingReviews: 12,
    upcomingDeadlines: 8
  };

  const recentActivity = [
    { id: 1, client: 'Smith LLC', action: 'Tax return filed', time: '2 hours ago', status: 'completed' },
    { id: 2, client: 'Johnson Family', action: 'Quarterly review due', time: '1 day ago', status: 'pending' },
    { id: 3, client: 'Wilson Corp', action: 'Bookkeeping updated', time: '2 days ago', status: 'completed' },
    { id: 4, client: 'Davis Trust', action: 'Tax planning session', time: '3 days ago', status: 'scheduled' }
  ];

  const upcomingDeadlines = [
    { client: 'ABC Corp', task: 'Quarterly Tax Filing', due: 'March 15, 2024', priority: 'high' },
    { client: 'XYZ LLC', task: 'Annual Report', due: 'March 20, 2024', priority: 'medium' },
    { client: 'Smith Family', task: 'Personal Tax Return', due: 'April 15, 2024', priority: 'low' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accountant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage tax services, bookkeeping, and financial reporting
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          New Tax Return
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tax Returns</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTaxReturns}</div>
            <p className="text-xs text-muted-foreground">
              In progress this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest client activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' : 
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Important dates and filing deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {deadline.client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deadline.task}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {deadline.due}
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {deadline.priority}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Service Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tax Returns Filed</span>
                <span>147/200</span>
              </div>
              <Progress value={73.5} className="w-full" />
            </div>
            <Button variant="outline" className="w-full">
              Manage Tax Returns
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bookkeeping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Books Updated</span>
                <span>78/85</span>
              </div>
              <Progress value={91.8} className="w-full" />
            </div>
            <Button variant="outline" className="w-full">
              View Ledgers
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reports Generated</span>
                <span>65/70</span>
              </div>
              <Progress value={92.9} className="w-full" />
            </div>
            <Button variant="outline" className="w-full">
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}