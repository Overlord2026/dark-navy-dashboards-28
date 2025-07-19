import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Database, 
  Zap, 
  HardDrive,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export function SystemHealthPage() {
  const { databaseHealth, backupStatus, edgeFunctionLogs } = useSystemHealth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
      case 'failed':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRefresh = () => {
    databaseHealth.refetch();
    backupStatus.refetch();
    edgeFunctionLogs.refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health Diagnostics</h1>
          <p className="text-muted-foreground">
            Comprehensive system monitoring and health checks
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {/* Database Health */}
        <AccordionItem value="database">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5" />
                <span className="font-semibold">Database Health</span>
                {databaseHealth.data && getStatusBadge((databaseHealth.data as any)?.status || 'unknown')}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {databaseHealth.isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ) : databaseHealth.data ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium">Connection Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Connections:</span>
                          <span>{(databaseHealth.data as any)?.connections || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="capitalize">{(databaseHealth.data as any)?.status || 'unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Check:</span>
                          <span>{new Date((databaseHealth.data as any)?.timestamp || Date.now()).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Storage Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Tables:</span>
                          <span>{(databaseHealth.data as any)?.tables?.total_tables || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Database Size:</span>
                          <span>{(databaseHealth.data as any)?.tables?.total_size_mb || 0} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Indexes:</span>
                          <span>{(databaseHealth.data as any)?.indexes?.total_indexes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Failed to load database health data
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Edge Functions */}
        <AccordionItem value="edge-functions">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">Edge Functions</span>
                <Badge variant={edgeFunctionLogs.data?.length === 0 ? "default" : "destructive"}>
                  {edgeFunctionLogs.data?.length || 0} errors (24h)
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {edgeFunctionLogs.isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                ) : edgeFunctionLogs.data && edgeFunctionLogs.data.length > 0 ? (
                  <div className="space-y-3">
                    {edgeFunctionLogs.data.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                        {getStatusIcon('error')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {log.event_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                          {log.details && (
                            <pre className="text-xs mt-2 bg-background p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm">No edge function errors in the last 24 hours</p>
                    <p className="text-xs">All functions operating normally</p>
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Storage & Backups */}
        <AccordionItem value="storage-backups">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5" />
                <span className="font-semibold">Storage & Backups</span>
                {backupStatus.data && getStatusBadge((backupStatus.data as any)?.status || 'unknown')}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {backupStatus.isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                ) : backupStatus.data ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium">Backup Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Backup:</span>
                          <span>{new Date((backupStatus.data as any)?.last_backup || Date.now()).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="capitalize">{(backupStatus.data as any)?.status || 'unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Backup Size:</span>
                          <span>{(backupStatus.data as any)?.size_mb || 0} MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Retention Policy</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Retention:</span>
                          <span>{(backupStatus.data as any)?.retention_days || 0} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Backup:</span>
                          <span>{new Date((backupStatus.data as any)?.next_backup || Date.now()).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Failed to load backup status
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}