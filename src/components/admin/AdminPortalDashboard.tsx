
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
  Monitor,
  Zap,
  TrendingUp
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

  // Edge Function Activity Data
  const { data: edgeFunctionStats } = useQuery({
    queryKey: ['edge-function-stats'],
    queryFn: async () => {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .in('event_type', ['edge_function_success', 'edge_function_error'])
        .gte('created_at', last24Hours);
      
      if (error) throw error;

      const totalCalls = data?.length || 0;
      const successCalls = data?.filter(log => log.status === 'success').length || 0;
      const errorCalls = totalCalls - successCalls;
      const successRate = totalCalls > 0 ? (successCalls / totalCalls) * 100 : 100;

      // Calculate average execution time
      const executionTimes = data?.map(log => {
        const details = typeof log.details === 'object' && log.details !== null ? log.details as any : {};
        return details.execution_time_ms || 0;
      }) || [];
      
      const avgExecutionTime = executionTimes.length > 0 
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length 
        : 0;

      return {
        totalCalls,
        successCalls,
        errorCalls,
        successRate,
        avgExecutionTime
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

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
      title: 'Edge Function Calls (24h)', 
      value: edgeFunctionStats?.totalCalls || 0, 
      icon: Zap
    },
    { 
      title: 'Function Success Rate', 
      value: `${Math.round(edgeFunctionStats?.successRate || 100)}%`, 
      icon: TrendingUp
    },
    { 
      title: 'LTC Stress-Tests', 
      value: kpiData?.ltcStressTests || 0, 
      icon: BarChart3
    },
    { 
      title: 'Open Support Tickets', 
      value: kpiData?.openSupportTickets || 0, 
      icon: HeadphonesIcon
    },
  ];

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (error) throw error;
      return data?.map(log => ({
        type: log.event_type,
        message: `${log.event_type}: ${log.status}`,
        time: new Date(log.created_at).toLocaleString(),
        status: log.status === 'success' ? 'success' as const : 
                log.status === 'error' ? 'error' as const : 'warning' as const
      })) || [];
    },
    refetchInterval: 60000,
  });

  // Edge Function Alerts - Recent errors and performance issues
  const { data: edgeFunctionAlerts = [] } = useQuery({
    queryKey: ['edge-function-alerts'],
    queryFn: async () => {
      const last30Minutes = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('event_type', 'edge_function_error')
        .gte('created_at', last30Minutes)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;

      return data?.map(log => {
        const details = typeof log.details === 'object' && log.details !== null ? log.details as any : {};
        return {
          type: 'edge_function_error',
          message: `${details.function_name || 'Unknown function'}: ${details.error_message || 'Error occurred'}`,
          time: new Date(log.created_at).toLocaleString(),
          status: 'error' as const,
          correlationId: details.correlation_id
        };
      }) || [];
    },
    refetchInterval: 30000, // More frequent for alerts
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time KPIs, edge function monitoring, and system oversight for Family Office operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin-portal/edge-functions">
              <Zap className="h-4 w-4 mr-2" />
              Edge Functions
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin-portal/system-health">
              <Monitor className="h-4 w-4 mr-2" />
              System Health
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Grid 3x2 */}
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

      {/* Three Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Activity
            </CardTitle>
            <CardDescription>System events and audit trail (last 15)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.slice(0, 8).map((activity, index) => (
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

        {/* Edge Function Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Edge Function Health
            </CardTitle>
            <CardDescription>Real-time function monitoring and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate (24h)</span>
                {edgeFunctionStats && (
                  <Badge 
                    variant={edgeFunctionStats.successRate >= 95 ? "default" : "destructive"}
                    className={edgeFunctionStats.successRate >= 95 ? "bg-green-100 text-green-800" : ""}
                  >
                    {Math.round(edgeFunctionStats.successRate)}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Calls (24h)</span>
                <span className="text-sm font-bold">{edgeFunctionStats?.totalCalls || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Response Time</span>
                <span className="text-sm">{Math.round(edgeFunctionStats?.avgExecutionTime || 0)}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Errors (24h)</span>
                <span className="text-sm text-red-600 font-medium">{edgeFunctionStats?.errorCalls || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-portal/edge-functions">View Dashboard →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Edge function errors and system issues (last 30 min)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {edgeFunctionAlerts.length > 0 ? (
                edgeFunctionAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                      {alert.correlationId && (
                        <p className="text-xs text-muted-foreground font-mono">
                          ID: {alert.correlationId}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No recent alerts</p>
                  <p className="text-xs">All systems operational</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-portal/edge-functions">View All Errors →</Link>
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
