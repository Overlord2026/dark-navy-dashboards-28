import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, FileText, Calendar, Clock, Users, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function AttorneyDashboard() {
  const metrics = {
    activeCases: 18,
    totalClients: 56,
    monthlyBillableHours: 145,
    monthlyRevenue: '$125,000',
    upcomingDeadlines: 7,
    documentsReviewed: 89
  };

  const activeCases = [
    { 
      id: 1, 
      title: 'Estate Planning - Johnson Family', 
      type: 'Estate Planning', 
      status: 'In Progress', 
      deadline: '2024-04-10',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Business Formation - TechStart LLC', 
      type: 'Business Law', 
      status: 'Under Review', 
      deadline: '2024-03-25',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Contract Negotiation - MegaCorp', 
      type: 'Contract Law', 
      status: 'Negotiating', 
      deadline: '2024-05-01',
      priority: 'high'
    }
  ];

  const upcomingDeadlines = [
    { case: 'Johnson Estate Planning', task: 'Will Draft Review', due: 'March 15, 2024', urgent: true },
    { case: 'TechStart LLC Formation', task: 'Articles of Incorporation', due: 'March 20, 2024', urgent: false },
    { case: 'Smith Family Trust', task: 'Trust Agreement', due: 'March 25, 2024', urgent: false }
  ];

  const recentActivity = [
    { type: 'Document', action: 'Contract reviewed for MegaCorp', time: '2 hours ago' },
    { type: 'Meeting', action: 'Client consultation with Johnson Family', time: '4 hours ago' },
    { type: 'Filing', action: 'Court filing submitted for Adams case', time: '1 day ago' },
    { type: 'Research', action: 'Legal research completed for Williams matter', time: '2 days ago' }
  ];

  const practiceAreas = [
    { name: 'Estate Planning', cases: 8, revenue: '$45,000' },
    { name: 'Business Law', cases: 6, revenue: '$38,000' },
    { name: 'Contract Law', cases: 4, revenue: '$42,000' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attorney Dashboard</h1>
          <p className="text-muted-foreground">
            Manage legal cases, client relationships, and practice areas
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active legal relationships
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
              {metrics.monthlyBillableHours}h billable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
            <CardDescription>
              Current legal matters and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCases.map((case_) => (
              <div key={case_.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{case_.title}</h4>
                  <Badge variant={
                    case_.priority === 'high' ? 'destructive' : 
                    case_.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {case_.priority === 'high' ? 'High Priority' :
                     case_.priority === 'medium' ? 'Medium' : 'Low'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{case_.type}</span>
                  <span>{case_.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Deadline: {case_.deadline}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Case Details
                </Button>
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
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                {deadline.urgent ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <Clock className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{deadline.case}</p>
                  <p className="text-sm text-muted-foreground">{deadline.task}</p>
                  <p className="text-xs text-muted-foreground">Due: {deadline.due}</p>
                </div>
                <Button variant={deadline.urgent ? "destructive" : "outline"} size="sm">
                  {deadline.urgent ? "Urgent" : "View"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Practice Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Practice Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {practiceAreas.map((area, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{area.name}</span>
                  <span className="text-sm text-muted-foreground">{area.cases} cases</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Revenue: {area.revenue}</span>
                </div>
                {index < practiceAreas.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'Document' ? 'bg-blue-500' :
                  activity.type === 'Meeting' ? 'bg-green-500' :
                  activity.type === 'Filing' ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Draft Legal Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Client Meeting
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Scale className="h-4 w-4 mr-2" />
              File Court Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Time Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}