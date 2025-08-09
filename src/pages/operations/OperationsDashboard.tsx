import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  ClipboardList, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { Link } from 'react-router-dom';

export default function OperationsDashboard() {
  const { organization, currentEmployee, isManager } = useOrganization();

  // Mock data - in production, this would come from the database
  const stats = {
    totalEmployees: 12,
    activeProjects: 8,
    completedProjects: 15,
    pendingReviews: 3,
    totalCourses: 24,
    completedCourses: 18,
    ceHoursEarned: 45.5,
    ceHoursRequired: 60
  };

  const recentProjects = [
    { id: '1', name: 'Q4 Marketing Campaign', status: 'active', progress: 75, dueDate: '2024-02-15' },
    { id: '2', name: 'Client Onboarding System', status: 'planning', progress: 25, dueDate: '2024-03-01' },
    { id: '3', name: 'Compliance Documentation', status: 'completed', progress: 100, dueDate: '2024-01-30' }
  ];

  const upcomingTasks = [
    { id: '1', title: 'Complete Annual Review for John Doe', priority: 'high', dueDate: '2024-02-10' },
    { id: '2', title: 'SEC Compliance Training', priority: 'medium', dueDate: '2024-02-15' },
    { id: '3', title: 'Client Portfolio Review Meeting', priority: 'low', dueDate: '2024-02-20' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentEmployee?.first_name}. Here's your organization overview.
          </p>
        </div>
        {isManager() && (
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/operations/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Active employees in organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projects in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Courses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CE Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ceHoursEarned}/{stats.ceHoursRequired}</div>
            <Progress value={(stats.ceHoursEarned / stats.ceHoursRequired) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Hours earned this year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">Due: {project.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  <div className="mt-1">
                    <Progress value={project.progress} className="w-20" />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/operations/projects">View All Projects</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your pending action items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/lms">View Training Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/operations/employees">
                <Users className="h-6 w-6" />
                <span>Employee Directory</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/operations/projects">
                <ClipboardList className="h-6 w-6" />
                <span>Projects</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/lms">
                <BookOpen className="h-6 w-6" />
                <span>Learning Center</span>
              </Link>
            </Button>
            {isManager() && (
              <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
                <Link to="/operations/reviews">
                  <TrendingUp className="h-6 w-6" />
                  <span>Annual Reviews</span>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}