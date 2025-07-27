import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Settings, Activity, BarChart3, DollarSign, AlertTriangle, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function AdminDashboard() {
  const systemMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    systemUptime: '99.9%',
    monthlyRevenue: '$485,750',
    storageUsed: 78,
    activeSessions: 156
  };

  const userGrowth = [
    { role: 'Clients', count: 856, growth: '+12%' },
    { role: 'Advisors', count: 245, growth: '+8%' },
    { role: 'Accountants', count: 89, growth: '+15%' },
    { role: 'Consultants', count: 34, growth: '+6%' },
    { role: 'Attorneys', count: 23, growth: '+18%' }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High storage usage detected', time: '2 hours ago' },
    { type: 'info', message: 'Scheduled maintenance completed', time: '1 day ago' },
    { type: 'error', message: 'Failed login attempts spike', time: '3 hours ago' },
    { type: 'success', message: 'Backup completed successfully', time: '6 hours ago' }
  ];

  const recentActivity = [
    { action: 'New user registration', details: 'John Smith (Advisor)', time: '5 minutes ago' },
    { action: 'System setting updated', details: 'Authentication timeout changed', time: '1 hour ago' },
    { action: 'Bulk user import', details: '50 new client accounts', time: '3 hours ago' },
    { action: 'Role permission modified', details: 'Consultant access updated', time: '5 hours ago' }
  ];

  const platformStats = [
    { label: 'Total Transactions', value: '24,567', trend: '+8.2%' },
    { label: 'API Calls (24h)', value: '1.2M', trend: '+5.1%' },
    { label: 'Storage Used', value: '2.4TB', trend: '+12%' },
    { label: 'Active Integrations', value: '47', trend: '+3%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system health, manage users, and oversee platform operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </Button>
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Key System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics.activeUsers} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +14% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Current online users
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth by Role */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth by Role</CardTitle>
            <CardDescription>
              Platform adoption across different user types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userGrowth.map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{role.role}</p>
                    <p className="text-xs text-muted-foreground">{role.count} users</p>
                  </div>
                </div>
                <Badge variant={role.growth.startsWith('+') ? 'default' : 'secondary'}>
                  {role.growth}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Recent system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                {alert.type === 'error' || alert.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{stat.label}</span>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Growth</span>
                  <span className="text-green-600">{stat.trend}</span>
                </div>
                {index < platformStats.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
                {index < recentActivity.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>{systemMetrics.storageUsed}%</span>
              </div>
              <Progress value={systemMetrics.storageUsed} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>62%</span>
              </div>
              <Progress value={62} className="w-full" />
            </div>
            
            <Button variant="outline" className="w-full">
              View Detailed Metrics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}