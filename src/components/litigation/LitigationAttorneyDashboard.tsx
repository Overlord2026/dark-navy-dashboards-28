import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Calendar, Lock, CheckSquare, MessageCircle, Plus, Clock, AlertTriangle } from 'lucide-react';

export const LitigationAttorneyDashboard: React.FC = () => {
  const activeCases = [
    { name: 'Smith v. Johnson', number: '2024-CV-12345', status: 'discovery', priority: 'high', nextDate: '2024-12-15', type: 'Civil Litigation' },
    { name: 'Estate of Williams', number: '2024-PR-6789', status: 'mediation', priority: 'medium', nextDate: '2024-12-20', type: 'Probate' },
    { name: 'ABC Corp v. XYZ Inc', number: '2024-CV-9876', status: 'trial-prep', priority: 'high', nextDate: '2024-12-10', type: 'Commercial' }
  ];

  const upcomingDeadlines = [
    { case: 'Smith v. Johnson', task: 'Motion to Compel', due: '2024-12-12', type: 'filing' },
    { case: 'Estate of Williams', task: 'Mediation Session', due: '2024-12-15', type: 'hearing' },
    { case: 'ABC Corp v. XYZ Inc', task: 'Expert Witness Disclosure', due: '2024-12-18', type: 'disclosure' }
  ];

  const recentMessages = [
    { from: 'John Smith', case: 'Smith v. Johnson', message: 'Updated discovery documents uploaded', time: '2 hours ago' },
    { from: 'Paralegal', case: 'Estate of Williams', message: 'Mediation date confirmed', time: '4 hours ago' },
    { from: 'Opposing Counsel', case: 'ABC Corp v. XYZ Inc', message: 'Settlement proposal submitted', time: '1 day ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovery': return 'default';
      case 'mediation': return 'secondary';
      case 'trial-prep': return 'warning';
      case 'trial': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
            <h1 className="text-3xl font-bold">Litigation Dashboard</h1>
            <p className="text-muted-foreground">Manage cases, deadlines, and client communications</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evidence Items</p>
                  <p className="text-2xl font-bold">342</p>
                </div>
                <Lock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <CheckSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-5">
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Case List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Active Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCases.map((case_, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{case_.name}</h3>
                          <Badge variant={getPriorityColor(case_.priority) as any}>
                            {case_.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{case_.number}</span>
                          <Badge variant={getStatusColor(case_.status) as any}>
                            {case_.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{case_.type}</span>
                          <span className="text-muted-foreground">Next: {case_.nextDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Court Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{deadline.task}</p>
                          <Badge variant="outline" className="text-xs">
                            {deadline.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{deadline.case}</p>
                        <p className="text-xs text-muted-foreground">Due: {deadline.due}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Court Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  <div className="text-center font-medium p-2">Sun</div>
                  <div className="text-center font-medium p-2">Mon</div>
                  <div className="text-center font-medium p-2">Tue</div>
                  <div className="text-center font-medium p-2">Wed</div>
                  <div className="text-center font-medium p-2">Thu</div>
                  <div className="text-center font-medium p-2">Fri</div>
                  <div className="text-center font-medium p-2">Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6;
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Evidence Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 mb-2" />
                    Documents
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 mb-2" />
                    Audio/Video
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 mb-2" />
                    Photos
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Upload New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.case}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {task.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Client Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{message.from}</p>
                        <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{message.case}</p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};