import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Play,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

export default function LMSDashboard() {
  const { currentEmployee, canManageCourses } = useOrganization();

  // Mock data - in production, this would come from the database
  const stats = {
    enrolledCourses: 12,
    completedCourses: 8,
    totalCEHours: 24.5,
    requiredCEHours: 40,
    certificates: 5,
    dueThisWeek: 2
  };

  const enrolledCourses = [
    {
      id: '1',
      title: 'SEC/FINRA Compliance Training',
      description: 'Essential compliance training for financial advisors',
      progress: 75,
      status: 'in_progress',
      dueDate: '2024-02-15',
      ceHours: 2,
      type: 'compliance'
    },
    {
      id: '2',
      title: 'Client Onboarding Workflow',
      description: 'Master the client onboarding process',
      progress: 100,
      status: 'completed',
      completedDate: '2024-01-20',
      ceHours: 1.5,
      type: 'persona_specific'
    },
    {
      id: '3',
      title: 'Platform Navigation Training',
      description: 'Learn to navigate the platform efficiently',
      progress: 30,
      status: 'in_progress',
      dueDate: '2024-02-20',
      ceHours: 1,
      type: 'orientation'
    },
    {
      id: '4',
      title: 'Advanced Portfolio Management',
      description: 'Deep dive into portfolio management strategies',
      progress: 0,
      status: 'not_started',
      dueDate: '2024-03-01',
      ceHours: 3,
      type: 'best_practices'
    }
  ];

  const recentCertificates = [
    {
      id: '1',
      courseName: 'Client Onboarding Workflow',
      issuedDate: '2024-01-20',
      ceHours: 1.5,
      verificationCode: 'COW-2024-001'
    },
    {
      id: '2',
      courseName: 'Data Privacy Compliance',
      issuedDate: '2024-01-15',
      ceHours: 2,
      verificationCode: 'DPC-2024-002'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'not_started':
        return 'outline';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'not_started':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'compliance':
        return 'destructive';
      case 'orientation':
        return 'default';
      case 'persona_specific':
        return 'secondary';
      case 'best_practices':
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
          <h1 className="text-3xl font-bold tracking-tight">Learning Management</h1>
          <p className="text-muted-foreground">
            Track your training progress and manage continuing education requirements.
          </p>
        </div>
        {canManageCourses() && (
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/lms/library">
                <BookOpen className="h-4 w-4 mr-2" />
                Course Library
              </Link>
            </Button>
            <Button asChild>
              <Link to="/lms/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CE Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCEHours}/{stats.requiredCEHours}</div>
            <Progress value={(stats.totalCEHours / stats.requiredCEHours) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {(stats.requiredCEHours - stats.totalCEHours).toFixed(1)} hours remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
            <p className="text-xs text-muted-foreground">
              Earned this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dueThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Courses to complete
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Your enrolled courses and progress</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/lms/library">Browse All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.slice(0, 4).map((course) => (
              <div key={course.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(course.status)}
                      <h4 className="font-medium">{course.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{course.ceHours} CE Hours</span>
                      {course.dueDate && (
                        <span>Due: {new Date(course.dueDate).toLocaleDateString()}</span>
                      )}
                      {course.completedDate && (
                        <span>Completed: {new Date(course.completedDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getCourseTypeColor(course.type)}>
                      {course.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getStatusColor(course.status)}>
                      {course.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                {course.status !== 'completed' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <Button size="sm" variant={course.status === 'completed' ? 'outline' : 'default'} asChild>
                    <Link to={`/lms/course/${course.id}`}>
                      {course.status === 'completed' ? 'Review' : 'Continue'}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Certificates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Certificates</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCertificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium">{cert.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {cert.ceHours} CE Hours • {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Code: {cert.verificationCode}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/lms/certificates">View All Certificates</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common learning tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/lms/library">
                <Search className="h-6 w-6" />
                <span>Browse Courses</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/lms/reports">
                <TrendingUp className="h-6 w-6" />
                <span>CE Report</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
              <Link to="/lms/certificates">
                <Award className="h-6 w-6" />
                <span>Certificates</span>
              </Link>
            </Button>
            {canManageCourses() && (
              <Button variant="outline" className="h-24 flex flex-col space-y-2" asChild>
                <Link to="/lms/admin">
                  <Filter className="h-6 w-6" />
                  <span>Admin Panel</span>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}