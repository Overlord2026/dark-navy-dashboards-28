import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUser } from '@/context/UserContext';
import { hasRoleAccess, ROLE_GROUPS } from '@/utils/roleHierarchy';
import {
  Scale,
  FileText,
  Shield,
  Gavel,
  UserPlus,
  Upload,
  Share,
  Mail,
  BookOpen,
  GraduationCap,
  Folder,
  ClipboardList,
  MessageSquare,
  Users,
  StickyNote,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';

interface AttorneyMetric {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
}

export function AttorneyDashboard() {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || 'client';
  
  // Role-based access control
  const isAttorney = hasRoleAccess(userRole, ['attorney']);
  const isAdmin = hasRoleAccess(userRole, ROLE_GROUPS.ADMIN_ACCESS);
  const hasAttorneyAccess = isAttorney || isAdmin;

  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>('dashboard');

  if (!hasAttorneyAccess) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You don't have permission to access the Attorney Dashboard. 
                Please contact your administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Attorney metrics
  const metrics: AttorneyMetric[] = [
    {
      title: 'Current Cases',
      value: 23,
      subtitle: 'Active matters',
      icon: Scale,
      trend: 'up',
      trendValue: '+3 this month'
    },
    {
      title: 'Open Requests',
      value: 8,
      subtitle: 'Pending client documents',
      icon: FileText,
      trend: 'neutral'
    },
    {
      title: 'Pending Reviews',
      value: 12,
      subtitle: 'Documents awaiting review',
      icon: CheckCircle,
      trend: 'down',
      trendValue: '-2 from last week'
    },
    {
      title: 'New Client Intakes',
      value: 5,
      subtitle: 'This month',
      icon: UserPlus,
      trend: 'up',
      trendValue: '+2 vs last month'
    }
  ];

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      title: 'Start New Intake',
      description: 'Begin client onboarding process',
      icon: UserPlus,
      onClick: () => console.log('Start new intake'),
    },
    {
      title: 'Upload Legal Document',
      description: 'Add document to client matter',
      icon: Upload,
      onClick: () => console.log('Upload document'),
    },
    {
      title: 'Refer a Case',
      description: 'Send case to specialist attorney',
      icon: Share,
      onClick: () => console.log('Refer case'),
      variant: 'outline'
    },
    {
      title: 'Invite Client',
      description: 'Send secure portal invitation',
      icon: Mail,
      onClick: () => console.log('Invite client'),
      variant: 'outline'
    }
  ];

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { title: 'Legal Guides', icon: BookOpen, href: '/attorney-education' },
    { title: 'CLE Tracker', icon: GraduationCap, href: '/cle-tracker', badge: '3 due' },
    { title: 'Documents', icon: Folder, href: '/documents', badge: '12' },
    { title: 'Intake Forms', icon: ClipboardList, href: '/intake-forms' },
    { title: 'Collaboration', icon: MessageSquare, href: '/collaboration', badge: '2' },
    { title: 'Client Portal', icon: Users, href: '/client-portal' },
    { title: 'Case Notes', icon: StickyNote, href: '/case-notes' }
  ];

  // Welcome message based on role
  const getWelcomeMessage = () => {
    if (isAdmin) {
      return {
        title: 'Attorney Dashboard Overview',
        subtitle: 'System-wide attorney metrics and management tools'
      };
    }
    return {
      title: `Welcome back, ${userProfile?.displayName || 'Attorney'}`,
      subtitle: 'Here\'s your practice overview for today'
    };
  };

  const { title, subtitle } = getWelcomeMessage();

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/10 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Attorney Tools
            </h3>
            {sidebarItems.map((item) => (
              <Button
                key={item.title}
                variant={selectedSidebarItem === item.title.toLowerCase().replace(' ', '-') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedSidebarItem(item.title.toLowerCase().replace(' ', '-'))}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Building className="h-3 w-3" />
                Attorney
              </Badge>
            </div>
          </div>

          {/* Profile Status & CLE Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Profile Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bar Registration</span>
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">E&O Insurance</span>
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Client Portal Setup</span>
                    <Badge variant="outline" className="bg-blue-50">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  CLE Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>2024 Requirements</span>
                    <span>18/20 hours</span>
                  </div>
                  <Progress value={90} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    2 hours remaining • Due Dec 31, 2024
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => setSelectedSidebarItem('cle-tracker')}
                  >
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Track CLE Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <metric.icon className="h-4 w-4" />
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.subtitle}
                  </p>
                  {metric.trend && metric.trendValue && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`h-3 w-3 ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600 rotate-180' : 
                        'text-muted-foreground'
                      }`} />
                      <span className="text-xs text-muted-foreground">{metric.trendValue}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and workflows for your legal practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={action.onClick}
                  >
                    <action.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Will updated for Johnson Estate</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New client intake: Sarah Williams</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Scale className="h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trust documents finalized</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}