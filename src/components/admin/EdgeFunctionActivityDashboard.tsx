
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Filter,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface EdgeFunctionLogEntry {
  id: string;
  event_type: string;
  status: string;
  created_at: string;
  user_id: string | null;
  details: {
    function_name: string;
    execution_time_ms: number;
    correlation_id: string;
    success: boolean;
    error_code?: string;
    error_message?: string;
    error_category?: string;
    response_size?: number;
  };
}

interface FunctionStats {
  functionName: string;
  totalCalls: number;
  successRate: number;
  avgExecutionTime: number;
  lastCalled: Date;
  errorCount: number;
}

export function EdgeFunctionActivityDashboard() {
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  const [functionFilter, setFunctionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['edge-function-logs', filter, functionFilter, timeRange],
    queryFn: async () => {
      const timeRangeMap = {
        '1h': 1,
        '6h': 6,
        '24h': 24,
        '7d': 168
      };

      let query = supabase
        .from('audit_logs')
        .select('*')
        .in('event_type', ['edge_function_success', 'edge_function_error'])
        .gte('created_at', new Date(Date.now() - timeRangeMap[timeRange] * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('status', filter === 'success' ? 'success' : 'error');
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(log => ({
        ...log,
        details: typeof log.details === 'object' && log.details !== null 
          ? log.details as EdgeFunctionLogEntry['details']
          : {
              function_name: 'unknown',
              execution_time_ms: 0,
              correlation_id: 'unknown',
              success: false
            }
      })) as EdgeFunctionLogEntry[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: functionStats = [] } = useQuery({
    queryKey: ['function-stats', timeRange],
    queryFn: async () => {
      const timeRangeMap = {
        '1h': 1,
        '6h': 6,
        '24h': 24,
        '7d': 168
      };

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .in('event_type', ['edge_function_success', 'edge_function_error'])
        .gte('created_at', new Date(Date.now() - timeRangeMap[timeRange] * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const statsMap = new Map<string, {
        totalCalls: number;
        successCount: number;
        totalExecutionTime: number;
        lastCalled: Date;
        errorCount: number;
      }>();

      (data || []).forEach(log => {
        const details = typeof log.details === 'object' && log.details !== null ? log.details as any : {};
        const functionName = details.function_name || 'unknown';
        const executionTime = details.execution_time_ms || 0;
        const isSuccess = log.status === 'success';
        const logDate = new Date(log.created_at);

        if (!statsMap.has(functionName)) {
          statsMap.set(functionName, {
            totalCalls: 0,
            successCount: 0,
            totalExecutionTime: 0,
            lastCalled: logDate,
            errorCount: 0
          });
        }

        const stats = statsMap.get(functionName)!;
        stats.totalCalls++;
        stats.totalExecutionTime += executionTime;
        
        if (isSuccess) {
          stats.successCount++;
        } else {
          stats.errorCount++;
        }

        if (logDate > stats.lastCalled) {
          stats.lastCalled = logDate;
        }
      });

      return Array.from(statsMap.entries()).map(([functionName, stats]): FunctionStats => ({
        functionName,
        totalCalls: stats.totalCalls,
        successRate: stats.totalCalls > 0 ? (stats.successCount / stats.totalCalls) * 100 : 0,
        avgExecutionTime: stats.totalCalls > 0 ? stats.totalExecutionTime / stats.totalCalls : 0,
        lastCalled: stats.lastCalled,
        errorCount: stats.errorCount
      })).sort((a, b) => b.totalCalls - a.totalCalls);
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const filteredLogs = logs.filter(log => {
    const matchesFunction = functionFilter === 'all' || log.details.function_name === functionFilter;
    const matchesSearch = searchQuery === '' || 
      log.details.function_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.correlation_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFunction && matchesSearch;
  });

  const uniqueFunctions = [...new Set(logs.map(log => log.details.function_name))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 95) return <Badge variant="default" className="bg-green-100 text-green-800">{rate.toFixed(1)}%</Badge>;
    if (rate >= 85) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{rate.toFixed(1)}%</Badge>;
    return <Badge variant="destructive">{rate.toFixed(1)}%</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edge Function Activity</h1>
          <p className="text-muted-foreground">
            Monitor edge function performance and error rates
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Function Statistics Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {functionStats.slice(0, 3).map((stat) => (
          <Card key={stat.functionName}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.functionName}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Calls</span>
                  <span className="font-bold">{stat.totalCalls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  {getSuccessRateBadge(stat.successRate)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Time</span>
                  <span className="text-sm">{Math.round(stat.avgExecutionTime)}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select value={filter} onValueChange={(value: 'all' | 'success' | 'error') => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={functionFilter} onValueChange={setFunctionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Functions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Functions</SelectItem>
                {uniqueFunctions.map(func => (
                  <SelectItem key={func} value={func}>{func}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={(value: '1h' | '6h' | '24h' | '7d') => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by function or correlation ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity ({filteredLogs.length} entries)
          </CardTitle>
          <CardDescription>
            Real-time edge function call monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>Loading edge function activity...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>No edge function activity found</p>
                <p className="text-xs">Try adjusting your filters or time range</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {log.details.function_name}
                      </p>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {Math.round(log.details.execution_time_ms)}ms
                      </p>
                      {log.user_id && (
                        <p className="text-xs text-muted-foreground">
                          <User className="inline h-3 w-3 mr-1" />
                          User: {log.user_id.slice(0, 8)}...
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                      </p>
                    </div>
                    {log.status === 'error' && log.details.error_message && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                        <div className="flex items-center gap-1 text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="font-medium">{log.details.error_code}</span>
                        </div>
                        <p className="text-red-600 mt-1">{log.details.error_message}</p>
                        <p className="text-red-500 mt-1">ID: {log.details.correlation_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
