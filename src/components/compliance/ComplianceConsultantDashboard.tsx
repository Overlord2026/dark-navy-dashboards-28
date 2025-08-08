import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, FileText, AlertTriangle, TrendingUp, CheckCircle, Plus } from 'lucide-react';

export const ComplianceConsultantDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const upcomingDeadlines = [
    { client: 'Advisor Group A', task: 'Form ADV Amendment', dueDate: '2024-12-12', priority: 'high', status: 'pending' },
    { client: 'Insurance Agency B', task: 'CE Credit Submission', dueDate: '2024-12-15', priority: 'medium', status: 'in-progress' },
    { client: 'RIA Firm C', task: 'Quarterly Compliance Review', dueDate: '2024-12-20', priority: 'low', status: 'pending' }
  ];

  const recentActivity = [
    { action: 'Completed Form U4 review', client: 'Advisor Group A', time: '2 hours ago' },
    { action: 'Uploaded compliance manual', client: 'Insurance Agency B', time: '4 hours ago' },
    { action: 'Scheduled audit meeting', client: 'RIA Firm C', time: '1 day ago' }
  ];

  const clients = [
    { name: 'Advisor Group A', type: 'RIA', status: 'active', nextReview: '2024-12-12', riskLevel: 'low' },
    { name: 'Insurance Agency B', type: 'Insurance', status: 'active', nextReview: '2024-12-15', riskLevel: 'medium' },
    { name: 'RIA Firm C', type: 'RIA', status: 'active', nextReview: '2024-12-20', riskLevel: 'low' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage all compliance activities</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Alerts</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-5">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="filings">Filings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Compliance Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
                      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6; // Start from previous month
                        const isCurrentMonth = day > 0 && day <= 31;
                        const hasEvent = [10, 15, 20].includes(day);
                        
                        return (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                              isCurrentMonth
                                ? hasEvent
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {isCurrentMonth ? day : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{deadline.task}</p>
                          <p className="text-xs text-muted-foreground">{deadline.client}</p>
                          <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
                        </div>
                        <Badge variant={getPriorityColor(deadline.priority) as any}>
                          {deadline.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">Type: {client.type}</p>
                        <p className="text-sm text-muted-foreground">Next Review: {client.nextReview}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskColor(client.riskLevel) as any}>
                          {client.riskLevel} risk
                        </Badge>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Filings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.client}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Compliance Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Monthly Summary
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <AlertTriangle className="w-6 h-6 mb-2" />
                    Risk Assessment
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <CheckCircle className="w-6 h-6 mb-2" />
                    Audit Trail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Form ADV
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Form U4
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Compliance Manual
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Create New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};