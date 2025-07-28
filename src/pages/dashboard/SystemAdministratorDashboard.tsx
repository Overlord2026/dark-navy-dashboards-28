import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Shield, 
  Activity, 
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Clock
} from 'lucide-react';

export function SystemAdministratorDashboard() {
  const systemActions = [
    { icon: Database, label: 'Database Management', description: 'Monitor and manage database performance' },
    { icon: Server, label: 'Server Administration', description: 'Manage server infrastructure and deployments' },
    { icon: Shield, label: 'Security Management', description: 'Configure system-wide security policies' },
    { icon: Users, label: 'Platform Users', description: 'Manage all users across all tenants' }
  ];

  const systemHealth = [
    { component: 'API Gateway', status: 'healthy', uptime: '99.9%', icon: CheckCircle },
    { component: 'Database Cluster', status: 'healthy', uptime: '99.8%', icon: CheckCircle },
    { component: 'Authentication Service', status: 'warning', uptime: '99.5%', icon: AlertTriangle },
    { component: 'File Storage', status: 'healthy', uptime: '100%', icon: CheckCircle }
  ];

  const metrics = [
    { label: 'Total Tenants', value: '12', icon: Server, trend: '+2 this month' },
    { label: 'Total Users', value: '1,247', icon: Users, trend: '+89 this week' },
    { label: 'System Load', value: '67%', icon: Activity, trend: 'Normal' },
    { label: 'Storage Used', value: '342GB', icon: Database, trend: '+12GB today' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader 
        heading="System Administration" 
        text="Monitor and manage the entire platform infrastructure"
      />

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Real-time status of critical system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <component.icon className={`h-5 w-5 ${
                    component.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <div className="font-medium">{component.component}</div>
                    <div className="text-sm text-muted-foreground">Uptime: {component.uptime}</div>
                  </div>
                </div>
                <Badge 
                  variant={component.status === 'healthy' ? 'default' : 'destructive'}
                  className="capitalize"
                >
                  {component.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Administration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Administration
          </CardTitle>
          <CardDescription>
            Manage platform-wide settings and infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemActions.map((action, index) => (
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

      {/* Recent System Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent System Events
          </CardTitle>
          <CardDescription>Latest system-wide activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { event: 'Database backup completed', severity: 'info', time: '15 minutes ago' },
              { event: 'New tenant onboarded: Acme Corp', severity: 'success', time: '2 hours ago' },
              { event: 'API rate limit threshold exceeded', severity: 'warning', time: '4 hours ago' },
              { event: 'Security patch applied to all servers', severity: 'info', time: '1 day ago' }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      event.severity === 'success' ? 'default' : 
                      event.severity === 'warning' ? 'destructive' : 'secondary'
                    }
                    className="w-2 h-2 p-0 rounded-full"
                  />
                  <div className="font-medium">{event.event}</div>
                </div>
                <div className="text-sm text-muted-foreground">{event.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}