import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle, Clock, Users, FileText, Database, Shield } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  route?: string;
}

interface TaskCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: TaskItem[];
}

export default function ProductionReadinessTracker() {
  const [activeCategory, setActiveCategory] = useState<string>('pages');

  const categories: TaskCategory[] = [
    {
      id: 'pages',
      title: 'MVP Pages',
      description: 'Replace all "Coming Soon" pages with functional MVPs',
      icon: <FileText className="h-5 w-5" />,
      tasks: [
        {
          id: 'accountant-tax-prep',
          title: 'Accountant Tax Preparation',
          description: 'Tax return management and document workflow',
          status: 'completed',
          priority: 'high',
          route: '/accountant/tax-prep'
        },
        {
          id: 'accountant-ledger',
          title: 'Accountant General Ledger',
          description: 'Bookkeeping and account management system',
          status: 'completed',
          priority: 'high',
          route: '/accountant/ledger'
        },
        {
          id: 'advisor-portfolio',
          title: 'Advisor Portfolio Management',
          description: 'Client portfolio monitoring and management',
          status: 'completed',
          priority: 'high',
          route: '/advisor/portfolio'
        },
        {
          id: 'advisor-billing',
          title: 'Advisor Billing Management',
          description: 'Fee calculation and invoice management',
          status: 'completed',
          priority: 'high',
          route: '/advisor/billing'
        },
        {
          id: 'attorney-estate-planning',
          title: 'Attorney Estate Planning',
          description: 'Estate planning and document management',
          status: 'completed',
          priority: 'high',
          route: '/attorney/estate-planning'
        },
        {
          id: 'accountant-statements',
          title: 'Financial Statements',
          description: 'Automated statement generation and analysis',
          status: 'in_progress',
          priority: 'medium',
          route: '/accountant/statements'
        },
        {
          id: 'attorney-contracts',
          title: 'Contract Management',
          description: 'Contract templates and review workflows',
          status: 'pending',
          priority: 'medium',
          route: '/attorney/contracts'
        },
        {
          id: 'admin-users',
          title: 'User Management',
          description: 'Admin user administration interface',
          status: 'pending',
          priority: 'low',
          route: '/admin/users'
        }
      ]
    },
    {
      id: 'workflows',
      title: 'Core Workflows',
      description: 'Implement essential business process workflows',
      icon: <Users className="h-5 w-5" />,
      tasks: [
        {
          id: 'client-onboarding',
          title: 'Client Onboarding Flow',
          description: 'Streamlined client signup and verification process',
          status: 'in_progress',
          priority: 'high'
        },
        {
          id: 'document-upload',
          title: 'Document Upload System',
          description: 'Secure file upload and storage with Supabase',
          status: 'pending',
          priority: 'high'
        },
        {
          id: 'approval-workflows',
          title: 'Approval Workflows',
          description: 'Multi-step approval processes for compliance',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: 'notification-system',
          title: 'Notification System',
          description: 'Email and in-app notifications for key events',
          status: 'pending',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'data',
      title: 'Data Integration',
      description: 'Replace mock data with live Supabase queries',
      icon: <Database className="h-5 w-5" />,
      tasks: [
        {
          id: 'user-profiles',
          title: 'User Profile Management',
          description: 'Connect UI to profiles table with RLS policies',
          status: 'in_progress',
          priority: 'high'
        },
        {
          id: 'client-data',
          title: 'Client Data Models',
          description: 'Implement client information storage and retrieval',
          status: 'pending',
          priority: 'high'
        },
        {
          id: 'financial-data',
          title: 'Financial Data Integration',
          description: 'Portfolio, account, and transaction data models',
          status: 'pending',
          priority: 'high'
        },
        {
          id: 'document-storage',
          title: 'Document Storage',
          description: 'File storage with proper access controls',
          status: 'pending',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Implement proper authentication and authorization',
      icon: <Shield className="h-5 w-5" />,
      tasks: [
        {
          id: 'role-based-access',
          title: 'Role-Based Access Control',
          description: 'Proper RLS policies for all user roles',
          status: 'in_progress',
          priority: 'high'
        },
        {
          id: 'error-handling',
          title: '404 & Error Handling',
          description: 'Comprehensive error pages and fallbacks',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: 'route-guards',
          title: 'Route Protection',
          description: 'Secure route access based on user roles',
          status: 'pending',
          priority: 'high'
        },
        {
          id: 'audit-logging',
          title: 'Audit Logging',
          description: 'Track user actions for compliance',
          status: 'pending',
          priority: 'medium'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      in_progress: 'default', 
      pending: 'secondary',
      blocked: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return <Badge variant={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  const calculateProgress = (tasks: TaskItem[]) => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = categories.reduce((sum, cat) => 
    sum + cat.tasks.filter(task => task.status === 'completed').length, 0);
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Production Readiness Tracker</h1>
            <p className="text-muted-foreground">Monitor progress toward production deployment</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} tasks completed</p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={overallProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {categories.reduce((sum, cat) => 
                      sum + cat.tasks.filter(task => task.status === 'completed').length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.reduce((sum, cat) => 
                      sum + cat.tasks.filter(task => task.status === 'in_progress').length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {categories.reduce((sum, cat) => 
                      sum + cat.tasks.filter(task => task.status === 'pending').length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {categories.reduce((sum, cat) => 
                      sum + cat.tasks.filter(task => task.status === 'blocked').length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Blocked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {categories.map((category) => {
            const progress = calculateProgress(category.tasks);
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-colors ${
                  activeCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                  {category.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progress}%</div>
                  <p className="text-xs text-muted-foreground">
                    {category.tasks.filter(t => t.status === 'completed').length}/{category.tasks.length} complete
                  </p>
                  <Progress value={progress} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {categories.find(cat => cat.id === activeCategory)?.icon}
              <span className="ml-2">{categories.find(cat => cat.id === activeCategory)?.title}</span>
            </CardTitle>
            <p className="text-muted-foreground">
              {categories.find(cat => cat.id === activeCategory)?.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.find(cat => cat.id === activeCategory)?.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                      {task.route && (
                        <div className="text-xs text-blue-600 font-mono">{task.route}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}