import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Activity, Filter, Download, Search } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  user_id: string;
  event_type: string;
  action_category: string;
  resource_type?: string;
  resource_id?: string;
  status: string;
  details: any;
  created_at: string;
}

const ACTION_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'user_management', label: 'User Management' },
  { value: 'tenant_management', label: 'Tenant Management' },
  { value: 'billing', label: 'Billing' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'resource_management', label: 'Resource Management' },
  { value: 'feature_flags', label: 'Feature Flags' },
  { value: 'invitations', label: 'Invitations' }
];

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    eventType: '',
    dateFrom: '',
    dateTo: ''
  });
  const { currentTenant } = useTenant();

  useEffect(() => {
    if (currentTenant?.id) {
      fetchAuditLogs();
    }
  }, [currentTenant, filters]);

  const fetchAuditLogs = async () => {
    if (!currentTenant?.id) return;

    setIsLoading(true);
    try {
      let query = (supabase as any)
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters.category !== 'all') {
        query = query.eq('action_category', filters.category);
      }

      if (filters.eventType) {
        query = query.ilike('event_type', `%${filters.eventType}%`);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs((data as AuditLogEntry[]) || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      const csvContent = [
        ['Timestamp', 'Event Type', 'Category', 'Status', 'Details'].join(','),
        ...logs.map(log => [
          format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
          log.event_type,
          log.action_category,
          log.status,
          JSON.stringify(log.details).replace(/"/g, '""')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Failed to export audit logs');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      user_management: 'bg-blue-100 text-blue-800',
      tenant_management: 'bg-purple-100 text-purple-800',
      billing: 'bg-green-100 text-green-800',
      compliance: 'bg-red-100 text-red-800',
      resource_management: 'bg-orange-100 text-orange-800',
      feature_flags: 'bg-indigo-100 text-indigo-800',
      invitations: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="p-6">Loading audit logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <div>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                View all administrative actions and system events
              </CardDescription>
            </div>
          </div>
          <Button onClick={exportLogs} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Search event type..."
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No audit logs found for the selected filters
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getCategoryColor(log.action_category)}>
                        {log.action_category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    <h4 className="font-medium">{log.event_type.replace('_', ' ')}</h4>
                    {log.resource_type && (
                      <p className="text-sm text-muted-foreground">
                        Resource: {log.resource_type} {log.resource_id && `(${log.resource_id})`}
                      </p>
                    )}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          View Details
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}