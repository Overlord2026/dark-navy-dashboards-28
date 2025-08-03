import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Download, Upload, UserPlus, Settings, AlertCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type VaultAccessLog = Database['public']['Tables']['vault_access_logs']['Row'];

interface VaultAuditLogProps {
  vaultId: string;
  logs: VaultAccessLog[];
}

export function VaultAuditLog({ vaultId, logs }: VaultAuditLogProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'view':
      case 'accessed':
        return <Eye className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'upload':
      case 'created':
        return <Upload className="h-4 w-4" />;
      case 'invite':
      case 'member_added':
        return <UserPlus className="h-4 w-4" />;
      case 'settings':
      case 'updated':
        return <Settings className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'view':
      case 'accessed':
        return 'bg-blue-100 text-blue-700';
      case 'download':
        return 'bg-green-100 text-green-700';
      case 'upload':
      case 'created':
        return 'bg-purple-100 text-purple-700';
      case 'invite':
      case 'member_added':
        return 'bg-orange-100 text-orange-700';
      case 'settings':
      case 'updated':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      const days = Math.floor(diffDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getAccessLevel = (level: string | null) => {
    if (!level) return null;
    
    const colors = {
      admin: 'destructive',
      editor: 'default',
      member: 'secondary'
    } as const;
    
    return colors[level as keyof typeof colors] || 'secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Audit Log
        </h2>
        <p className="text-muted-foreground">
          Track all activities and access to your family vault for security and transparency.
        </p>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action_type)}`}>
                    {getActionIcon(log.action_type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {log.user_email || 'System'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Performed action: {log.action_type}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(log.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    {log.ip_address && (
                      <div className="text-xs text-muted-foreground">
                        IP: {String(log.ip_address)}
                      </div>
                    )}
                    
                    {log.user_agent && (
                      <div className="text-xs text-muted-foreground truncate max-w-md">
                        {log.user_agent}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No audit logs yet</h3>
            <p className="text-muted-foreground">
              Activity logs will appear here as family members interact with your vault.
            </p>
          </CardContent>
        </Card>
      )}
      
      {logs.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {logs.length} recent activities. 
            Older logs are archived for security compliance.
          </p>
        </div>
      )}
    </div>
  );
}