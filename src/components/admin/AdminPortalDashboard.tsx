import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  FileText, 
  TrendingUp, 
  Shield, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

export function AdminPortalDashboard() {
  const { userProfile } = useUser();
  const isSuperAdmin = userProfile?.role === 'system_administrator';

  const stats = [
    { 
      title: 'Total Users', 
      value: '2,547', 
      icon: Users, 
      change: '+12%',
      changeType: 'positive' as const,
      href: '/admin-portal/users'
    },
    { 
      title: 'Active Tenants', 
      value: '34', 
      icon: Building, 
      change: '+3',
      changeType: 'positive' as const,
      href: '/admin-portal/tenants',
      superAdminOnly: true
    },
    { 
      title: 'Resources', 
      value: '156', 
      icon: FileText, 
      change: '+8',
      changeType: 'positive' as const,
      href: '/admin-portal/resources'
    },
    { 
      title: 'Pending Payouts', 
      value: '$12,450', 
      icon: CreditCard, 
      change: '+15%',
      changeType: 'positive' as const,
      href: '/admin-portal/payouts'
    },
  ];

  const recentActivity = [
    {
      type: 'user_created',
      message: 'New user registered: john.doe@example.com',
      time: '5 minutes ago',
      status: 'success' as const
    },
    {
      type: 'payout_processed',
      message: 'Referral payout processed: $500',
      time: '1 hour ago',
      status: 'success' as const
    },
    {
      type: 'security_alert',
      message: 'Failed login attempts detected',
      time: '2 hours ago',
      status: 'warning' as const
    },
    {
      type: 'system_update',
      message: 'Database backup completed successfully',
      time: '1 day ago',
      status: 'success' as const
    },
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Services', status: 'healthy', uptime: '99.8%' },
    { name: 'Authentication', status: 'healthy', uptime: '100%' },
    { name: 'File Storage', status: 'warning', uptime: '98.2%' },
  ];

  const filteredStats = stats.filter(stat => !stat.superAdminOnly || isSuperAdmin);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Portal Dashboard</h1>
        <p className="text-muted-foreground">
          Complete overview of your system, users, and operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className={cn(
                    "text-xs",
                    stat.changeType === 'positive' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change} from last month
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={stat.href}>View →</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-portal/analytics">View All Activity →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Current status of all system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-sm">{service.name}</div>
                    {getHealthBadge(service.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service.uptime} uptime
                  </div>
                </div>
              ))}
            </div>
            {isSuperAdmin && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin-portal/database">System Diagnostics →</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin-portal/users" className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin-portal/payouts" className="flex flex-col items-center space-y-2">
                <CreditCard className="h-6 w-6" />
                <span>Process Payouts</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin-portal/resources" className="flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Add Resources</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/referral-analytics" className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}