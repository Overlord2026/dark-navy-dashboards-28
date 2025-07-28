import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  Crown,
  TrendingUp,
  Activity
} from 'lucide-react';

export function TenantAdminDashboard() {
  const quickActions = [
    { icon: Users, label: 'Manage Users', description: 'Add, edit, or remove tenant users' },
    { icon: Settings, label: 'Tenant Settings', description: 'Configure tenant-specific settings' },
    { icon: Shield, label: 'Security Settings', description: 'Manage security and permissions' },
    { icon: BarChart3, label: 'Usage Analytics', description: 'View tenant usage and metrics' }
  ];

  const stats = [
    { label: 'Active Users', value: '24', icon: Users, trend: '+12%' },
    { label: 'Licensed Features', value: '8/12', icon: Crown, trend: '67%' },
    { label: 'Storage Used', value: '2.4GB', icon: Activity, trend: '+5%' },
    { label: 'Monthly Activity', value: '1,245', icon: TrendingUp, trend: '+18%' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader 
        heading="Tenant Administration" 
        text="Manage your organization's platform configuration and users"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant="secondary" className="text-xs">
                {stat.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tenant Administration
          </CardTitle>
          <CardDescription>
            Manage your organization's configuration and user access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2">
                  <action.icon className="h-4 w-4" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest administrative actions in your tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'User permission updated', user: 'jane.doe@company.com', time: '2 hours ago' },
              { action: 'New feature enabled', user: 'admin@company.com', time: '1 day ago' },
              { action: 'Security settings modified', user: 'admin@company.com', time: '3 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.user}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}