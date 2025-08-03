import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Shield,
  Upload,
  Download,
  Share,
  Trash2,
  Eye,
  Users,
  Settings,
  AlertTriangle,
  Filter,
  Search,
  Clock,
  MapPin,
  Smartphone,
  Monitor
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface AuditLogEntry {
  id: string;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface VaultAuditLogsProps {
  vaultId: string;
}

type ActionType = 'upload' | 'download' | 'share' | 'delete' | 'view' | 'invite' | 'role_change' | 'settings_change' | 'all';

export function VaultAuditLogs({ vaultId }: VaultAuditLogsProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionType>('all');
  const [dateRange, setDateRange] = useState('7'); // days
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [vaultId, dateRange]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const { data, error } = await supabase
        .from('vault_access_logs')
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('vault_id', vaultId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Map the data to match our interface
      const mappedLogs = (data || []).map(log => ({
        ...log,
        resource_type: log.action_type || 'vault',
        details: (log.metadata as Record<string, any>) || {},
        ip_address: (log.ip_address as string) || '',
        user_agent: (log.user_agent as string) || ''
      }));
      
      setLogs(mappedLogs as AuditLogEntry[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action type filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action_type === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload':
        return <Upload className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'share':
        return <Share className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'invite':
        return <Users className="h-4 w-4" />;
      case 'role_change':
        return <Shield className="h-4 w-4" />;
      case 'settings_change':
        return <Settings className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'upload':
        return 'bg-green-100 text-green-700';
      case 'download':
        return 'bg-blue-100 text-blue-700';
      case 'share':
        return 'bg-purple-100 text-purple-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'view':
        return 'bg-gray-100 text-gray-700';
      case 'invite':
        return 'bg-yellow-100 text-yellow-700';
      case 'role_change':
        return 'bg-orange-100 text-orange-700';
      case 'settings_change':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityBadge = (action: string) => {
    const highRiskActions = ['delete', 'role_change', 'settings_change'];
    const mediumRiskActions = ['share', 'invite'];
    
    if (highRiskActions.includes(action)) {
      return <Badge variant="destructive" className="text-xs">High Risk</Badge>;
    } else if (mediumRiskActions.includes(action)) {
      return <Badge variant="secondary" className="text-xs">Medium Risk</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Low Risk</Badge>;
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return { type: 'unknown', info: 'Unknown Device' };
    
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    if (isTablet) {
      return { type: 'tablet', info: 'Tablet Device' };
    } else if (isMobile) {
      return { type: 'mobile', info: 'Mobile Device' };
    } else {
      return { type: 'desktop', info: 'Desktop Computer' };
    }
  };

  const formatLogDetails = (log: AuditLogEntry) => {
    const details = log.details || {};
    
    switch (log.action_type) {
      case 'upload':
        return `Uploaded "${details.filename || 'file'}" (${details.fileSize || 'unknown size'})`;
      case 'download':
        return `Downloaded "${details.filename || 'file'}"`;
      case 'share':
        return `Shared "${details.itemTitle || 'item'}" with ${details.recipientCount || 1} recipient(s)`;
      case 'delete':
        return `Deleted "${details.itemTitle || details.filename || 'item'}"`;
      case 'view':
        return `Viewed "${details.itemTitle || 'item'}"`;
      case 'invite':
        return `Invited ${details.email || 'user'} as ${details.role || 'member'}`;
      case 'role_change':
        return `Changed ${details.targetUser || 'user'} role from ${details.oldRole || 'unknown'} to ${details.newRole || 'unknown'}`;
      case 'settings_change':
        return `Modified vault settings: ${details.settingChanged || 'unknown setting'}`;
      default:
        return log.action_type.replace('_', ' ').toLowerCase();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity & Audit Logs</h2>
          <p className="text-muted-foreground">
            Track all actions performed in this vault for security and compliance.
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={(value: ActionType) => setActionFilter(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="upload">Uploads</SelectItem>
                <SelectItem value="download">Downloads</SelectItem>
                <SelectItem value="share">Shares</SelectItem>
                <SelectItem value="delete">Deletions</SelectItem>
                <SelectItem value="view">Views</SelectItem>
                <SelectItem value="invite">Invitations</SelectItem>
                <SelectItem value="role_change">Role Changes</SelectItem>
                <SelectItem value="settings_change">Settings</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uploads</p>
                <p className="text-xl font-semibold">
                  {filteredLogs.filter(log => log.action_type === 'upload').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="text-xl font-semibold">
                  {filteredLogs.filter(log => log.action_type === 'view').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Share className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shares</p>
                <p className="text-xl font-semibold">
                  {filteredLogs.filter(log => log.action_type === 'share').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-xl font-semibold">
                  {filteredLogs.filter(log => ['delete', 'role_change', 'settings_change'].includes(log.action_type)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Activity Timeline ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No activities found matching your filters.
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log) => {
                const deviceInfo = getDeviceInfo(log.user_agent);
                const userProfile = (log as any).profiles;
                
                return (
                  <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-full ${getActionColor(log.action_type)}`}>
                          {getActionIcon(log.action_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {userProfile ? 
                                `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.email
                                : 'Unknown User'
                              }
                            </p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {log.action_type.replace('_', ' ')}
                            </Badge>
                            {getSeverityBadge(log.action_type)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatLogDetails(log)}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                            </div>
                            
                            {log.ip_address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{log.ip_address}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              {deviceInfo.type === 'mobile' ? (
                                <Smartphone className="h-3 w-3" />
                              ) : (
                                <Monitor className="h-3 w-3" />
                              )}
                              <span>{deviceInfo.info}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}