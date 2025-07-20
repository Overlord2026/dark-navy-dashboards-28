
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, TrendingUp, Users, Clock, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';

interface ErrorLogEntry {
  id: string;
  event_type: string;
  status: string;
  created_at: string;
  details: {
    function_name: string;
    error_code: string;
    error_message: string;
    error_category: string;
    correlation_id: string;
    user_message: string;
    retryable: boolean;
  };
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  affectedUsers: number;
  avgResolutionTime: number;
}

export function ErrorDashboard() {
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>([]);
  const [errorStats, setErrorStats] = useState<ErrorStats>({
    totalErrors: 0,
    criticalErrors: 0,
    affectedUsers: 0,
    avgResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchErrorLogs = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('event_type', 'edge_function_error')
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply time range filter
      const now = new Date();
      let startTime: Date;
      switch (timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      query = query.gte('created_at', startTime.toISOString());

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching error logs:', error);
        return;
      }

      let filteredData = data || [];

      // Apply category filter
      if (categoryFilter !== 'all') {
        filteredData = filteredData.filter(log => 
          log.details?.error_category === categoryFilter
        );
      }

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(log =>
          log.details?.function_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details?.error_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details?.correlation_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setErrorLogs(filteredData);

      // Calculate stats
      const stats: ErrorStats = {
        totalErrors: filteredData.length,
        criticalErrors: filteredData.filter(log => 
          log.details?.error_category === 'server' || 
          log.details?.error_category === 'external_api'
        ).length,
        affectedUsers: new Set(filteredData.map(log => log.user_id).filter(Boolean)).size,
        avgResolutionTime: 0 // Would need resolution tracking to calculate
      };

      setErrorStats(stats);
    } catch (err) {
      console.error('Error in fetchErrorLogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [timeRange, categoryFilter, searchTerm]);

  const getCategoryColor = (category: string) => {
    const colors = {
      authentication: 'bg-yellow-100 text-yellow-800',
      validation: 'bg-blue-100 text-blue-800',
      network: 'bg-orange-100 text-orange-800',
      external_api: 'bg-purple-100 text-purple-800',
      rate_limit: 'bg-indigo-100 text-indigo-800',
      server: 'bg-red-100 text-red-800',
      unknown: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.unknown;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Error Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze edge function errors</p>
        </div>
        <Button onClick={fetchErrorLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.totalErrors}</div>
            <p className="text-xs text-gray-500">In selected time range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorStats.criticalErrors}</div>
            <p className="text-xs text-gray-500">Server & API errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Users</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.affectedUsers}</div>
            <p className="text-xs text-gray-500">Unique users impacted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-gray-500">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="external_api">External API</SelectItem>
                <SelectItem value="rate_limit">Rate Limit</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by function, message, or correlation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <CardDescription>
            Detailed view of edge function errors with traceability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading error logs...</div>
          ) : errorLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No errors found for the selected criteria
            </div>
          ) : (
            <div className="space-y-4">
              {errorLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(log.details?.error_category || 'unknown')}>
                        {log.details?.error_category || 'Unknown'}
                      </Badge>
                      <span className="font-medium">{log.details?.function_name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium text-red-600">{log.details?.error_message}</p>
                    <p className="text-gray-600">{log.details?.user_message}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Correlation ID: {log.details?.correlation_id}</span>
                    <span>Code: {log.details?.error_code}</span>
                    {log.details?.retryable && (
                      <Badge variant="outline" className="text-xs">Retryable</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
