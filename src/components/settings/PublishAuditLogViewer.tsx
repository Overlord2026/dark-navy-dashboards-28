
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { auditLog, AuditLogEntry } from "@/services/auditLog/auditLogService";
import { format } from "date-fns";
import { AlertCircle, Download, Filter, RefreshCw, Search, FileCode, User2 } from "lucide-react";

interface PublishAuditLogProps {
  className?: string;
}

export const PublishAuditLogViewer = ({ className }: PublishAuditLogProps) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<number>(30); // days
  
  const fetchLogs = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    // Filter only for publish-related actions
    const publishActions = ['settings_change', 'document_access', 'api_access'];
    
    const fetchedLogs = auditLog.getLogs({
      startDate: timeRange ? startDate : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined
    });
    
    // Further filter for publish-related actions and those containing "publish" in details
    const publishLogs = fetchedLogs.filter(log => 
      publishActions.includes(log.action) || 
      (log.details && 
        typeof log.details === 'object' && 
        log.details.action && 
        log.details.action.toLowerCase().includes('publish'))
    );
    
    setLogs(publishLogs);
    filterLogs(publishLogs, searchTerm);
  };

  useEffect(() => {
    fetchLogs();
    // Refresh logs every 60 seconds
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, [timeRange, statusFilter]);

  useEffect(() => {
    filterLogs(logs, searchTerm);
  }, [searchTerm]);

  const filterLogs = (logsToFilter: AuditLogEntry[], term: string) => {
    if (!term) {
      setFilteredLogs(logsToFilter);
      return;
    }
    
    const filtered = logsToFilter.filter(log => 
      (log.userId && log.userId.toLowerCase().includes(term.toLowerCase())) ||
      (log.userName && log.userName.toLowerCase().includes(term.toLowerCase())) ||
      (log.resourceId && log.resourceId.toLowerCase().includes(term.toLowerCase())) ||
      (log.resourceType && log.resourceType.toLowerCase().includes(term.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(term.toLowerCase())) ||
      (log.reason && log.reason.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredLogs(filtered);
  };

  const getStatusClass = (status: 'success' | 'failure') => {
    return status === 'success' 
      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
      : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
  };

  const exportLogs = () => {
    const logData = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publish-audit-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const has2FADetails = (log: AuditLogEntry) => {
    return log.details && 
           typeof log.details === 'object' && 
           (log.details.twoFactorVerified !== undefined || 
            log.details.authMethod !== undefined);
  };

  const hasCodeChanges = (log: AuditLogEntry) => {
    return log.details && 
           typeof log.details === 'object' && 
           (log.details.changedFiles !== undefined || 
            log.details.diff !== undefined);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Publishing Audit Logs
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publish logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-32">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as "all" | "success" | "failure")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select
                  value={timeRange.toString()}
                  onValueChange={(value) => setTimeRange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last week</SelectItem>
                    <SelectItem value="30">Last month</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="180">Last 6 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'publish action' : 'publish actions'} found
          </div>

          <ScrollArea className="h-[500px] rounded border">
            {filteredLogs.length > 0 ? (
              <div className="space-y-2 p-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-md border ${getStatusClass(log.status)}`}
                  >
                    <div className="flex items-start gap-2">
                      <FileCode className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Publish Action
                            {log.resourceType && ` - ${log.resourceType}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              log.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}>
                              {log.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                          <div className="flex items-center gap-1">
                            <User2 className="h-3 w-3" />
                            <span>User: {log.userName || log.userId}</span>
                          </div>
                          {log.userRole && <span>Role: {log.userRole}</span>}
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                        
                        {log.resourceId && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Resource ID: {log.resourceId}
                          </div>
                        )}
                        
                        {has2FADetails(log) && (
                          <div className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                            2FA Verification: {log.details?.twoFactorVerified ? 'Confirmed' : 'Not Verified'}
                            {log.details?.authMethod && ` (Method: ${log.details.authMethod})`}
                          </div>
                        )}
                        
                        {log.reason && (
                          <div className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            Reason: {log.reason}
                          </div>
                        )}
                        
                        {hasCodeChanges(log) && (
                          <div className="mt-2 text-sm">
                            <div className="font-medium text-xs mb-1">Code Changes:</div>
                            <div className="bg-background/50 p-2 rounded text-xs">
                              {log.details?.changedFiles && (
                                <div className="mb-2">
                                  <span className="font-medium">Changed Files: </span>
                                  {Array.isArray(log.details.changedFiles) 
                                    ? log.details.changedFiles.join(', ')
                                    : log.details.changedFiles}
                                </div>
                              )}
                              {log.details?.diff && (
                                <details>
                                  <summary className="cursor-pointer hover:text-blue-500 transition-colors">
                                    View Code Diff
                                  </summary>
                                  <pre className="mt-2 overflow-x-auto text-xs whitespace-pre-wrap">
                                    {typeof log.details.diff === 'object' 
                                      ? JSON.stringify(log.details.diff, null, 2)
                                      : log.details.diff}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {log.details && !hasCodeChanges(log) && !has2FADetails(log) && (
                          <div className="mt-2 text-sm">
                            <div className="font-medium text-xs mb-1">Details:</div>
                            <pre className="bg-background/50 p-2 rounded text-xs overflow-x-auto">
                              {typeof log.details === 'object' 
                                ? JSON.stringify(log.details, null, 2)
                                : log.details}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 text-muted-foreground">
                No publish audit logs found for the selected filters
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
