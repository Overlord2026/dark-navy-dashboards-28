import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, BarChart3, TrendingUp, Calendar, DollarSign, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function ConsultantDashboard() {
  const metrics = {
    activeProjects: 12,
    totalClients: 34,
    monthlyRevenue: '$87,500',
    projectsCompleted: 156,
    consultingHours: 420,
    clientSatisfaction: 4.8
  };

  const activeProjects = [
    { 
      id: 1, 
      name: 'Digital Transformation Strategy', 
      client: 'TechCorp Inc.', 
      progress: 75, 
      deadline: '2024-04-15',
      status: 'on-track'
    },
    { 
      id: 2, 
      name: 'Operations Optimization', 
      client: 'Manufacturing Ltd.', 
      progress: 45, 
      deadline: '2024-05-20',
      status: 'at-risk'
    },
    { 
      id: 3, 
      name: 'Change Management Program', 
      client: 'GlobalServices Co.', 
      progress: 90, 
      deadline: '2024-03-30',
      status: 'ahead'
    }
  ];

  const recentMilestones = [
    { project: 'Digital Transformation Strategy', milestone: 'Phase 2 Completion', date: '2024-03-10' },
    { project: 'Market Analysis Report', milestone: 'Final Delivery', date: '2024-03-08' },
    { project: 'Process Reengineering', milestone: 'Stakeholder Approval', date: '2024-03-05' }
  ];

  const upcomingMeetings = [
    { client: 'TechCorp Inc.', type: 'Strategy Review', time: 'Today, 2:00 PM' },
    { client: 'Manufacturing Ltd.', type: 'Progress Update', time: 'Tomorrow, 10:00 AM' },
    { client: 'GlobalServices Co.', type: 'Final Presentation', time: 'Mar 15, 3:00 PM' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage consulting projects, client relationships, and strategic initiatives
          </p>
        </div>
        <Button className="gap-2">
          <Briefcase className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
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
              8% growth this quarter
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
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clientSatisfaction}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on recent feedback
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Current consulting engagements and their progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{project.name}</h4>
                  <Badge variant={
                    project.status === 'on-track' ? 'default' :
                    project.status === 'at-risk' ? 'destructive' : 'secondary'
                  }>
                    {project.status === 'on-track' ? 'On Track' :
                     project.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.client}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {project.deadline}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>
              Scheduled client meetings and presentations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{meeting.client}</p>
                  <p className="text-sm text-muted-foreground">{meeting.type}</p>
                  <p className="text-xs text-muted-foreground">{meeting.time}</p>
                </div>
                <Button variant="outline" size="sm">
                  Join
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium">{milestone.milestone}</p>
                <p className="text-xs text-muted-foreground">{milestone.project}</p>
                <p className="text-xs text-muted-foreground">{milestone.date}</p>
                {index < recentMilestones.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Projects Completed</span>
                <span>{metrics.projectsCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Consulting Hours</span>
                <span>{metrics.consultingHours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span>94%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Detailed Reports
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="h-4 w-4 mr-2" />
              Create Project Proposal
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Client Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Review KPIs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}