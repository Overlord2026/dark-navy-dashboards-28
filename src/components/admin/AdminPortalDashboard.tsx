import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck,
  Heart,
  BarChart3,
  FileText,
  HeadphonesIcon,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { KpiTile } from './KpiTile';
import { useKpiData } from '@/hooks/useKpiData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function AdminPortalDashboard() {
  const { userProfile } = useUser();
  const isSuperAdmin = userProfile?.role === 'system_administrator';
  const { data: kpiData, isLoading: kpiLoading } = useKpiData();

  const kpiTiles = [
    { 
      title: 'Active Clients', 
      value: kpiData?.activeClients || 0, 
      icon: Users
    },
    { 
      title: 'Active Advisors', 
      value: kpiData?.activeAdvisors || 0, 
      icon: UserCheck
    },
    { 
      title: 'Healthspan Reports', 
      value: kpiData?.healthspanReports || 0, 
      icon: Heart
    },
    { 
      title: 'LTC Stress-Tests', 
      value: kpiData?.ltcStressTests || 0, 
      icon: BarChart3
    },
    { 
      title: 'Fee-Savings Reports', 
      value: kpiData?.feeSavingsReports || 0, 
      icon: FileText
    },
    { 
      title: 'Open Support Tickets', 
      value: kpiData?.openSupportTickets || 0, 
      icon: HeadphonesIcon
    },
  ];

  // Latest Activity from audit logs
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data?.map(log => ({
        type: log.event_type,
        message: `${log.event_type}: ${log.status}`,
        time: new Date(log.created_at).toLocaleString(),
        status: log.status === 'success' ? 'success' as const : 'warning' as const
      })) || [];
    },
    refetchInterval: 60000,
  });

  // System Alerts from failed webhook deliveries
  const { data: systemAlerts = [] } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      // Mock data for system alerts - replace with real webhook delivery failures
      return [
        {
          type: 'webhook_failure',
          message: 'Email notification webhook failed',
          time: '15 minutes ago',
          status: 'error' as const
        }
      ];
    },
    refetchInterval: 60000,
  });


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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time KPIs and system oversight for Family Office operations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin-portal/system-health">
            <Monitor className="h-4 w-4 mr-2" />
            Run Full System Diagnostics
          </Link>
        </Button>
      </div>

      {/* KPI Grid 3x2 */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {kpiTiles.map((tile) => (
          <KpiTile
            key={tile.title}
            title={tile.title}
            value={tile.value}
            icon={tile.icon}
            loading={kpiLoading}
          />
        ))}
      </div>

      {/* Two Half-Width Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Activity
            </CardTitle>
            <CardDescription>Feed from audit logs (last 20 rows)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.slice(0, 10).map((activity, index) => (
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
                <Link to="/admin-portal/compliance">View All Activity →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Errors from edge functions and webhook deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {systemAlerts.length > 0 ? (
                systemAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No system alerts</p>
                  <p className="text-xs">All systems operational</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-portal/system-health">System Diagnostics →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}