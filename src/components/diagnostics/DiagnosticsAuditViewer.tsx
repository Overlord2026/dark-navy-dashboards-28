
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { auditLog, AuditLogEntry } from "@/services/auditLog/auditLogService";
import { format } from "date-fns";
import { AlertCircle, Download, Filter, RefreshCw, Search, Activity, ShieldCheck } from "lucide-react";

export const DiagnosticsAuditViewer = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<number>(7); // days
  
  const fetchLogs = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    // Get diagnostics specific logs
    const fetchedLogs = auditLog.getLogs({
      startDate: timeRange ? startDate : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined
    });
    
    // Filter for diagnostics-related actions
    const diagnosticsLogs = fetchedLogs.filter(log => 
      (log.resourceType === 'diagnostics' || 
      log.resourceType === 'systemDiagnostics' || 
      log.resourceType === 'quickDiagnostics' || 
      log.resourceType === 'developerAccess' ||
      (log.details && typeof log.details === 'object' && 
        log.details.action && (
          log.details.action.includes('diagnostic') || 
          log.details.action.includes('system health')
        )
      ))
    );
    
    setLogs(diagnosticsLogs);
    filterLogs(diagnosticsLogs, searchTerm);
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
      (log.userRole && log.userRole.toLowerCase().includes(term.toLowerCase())) ||
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

  const getActionIcon = (log: AuditLogEntry) => {
    if (log.resourceType === 'developerAccess' || log.action === 'permission_change') {
      return <ShieldCheck className="h-4 w-4 text-purple-500" />;
    } else {
      return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const exportLogs = () => {
    const logData = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-audit-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Diagnostics Access Audit Logs
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
                  placeholder="Search diagnostics logs..."
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
                    <SelectItem value="1">Last 24h</SelectItem>
                    <SelectItem value="7">Last week</SelectItem>
                    <SelectItem value="30">Last month</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="0">All logs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'} found
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
                      {getActionIcon(log)}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {log.resourceType === 'developerAccess' ? 'Developer Permission Change' : 'Diagnostics Access'}
                            {log.resourceType && log.resourceType !== 'developerAccess' && ` - ${log.resourceType}`}
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
                          <span>User: {log.userName || log.userId}</span>
                          {log.userRole && <span>Role: {log.userRole}</span>}
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                        
                        {log.resourceId && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {log.resourceType === 'developerAccess' ? 'Developer ID' : 'Resource ID'}: {log.resourceId}
                          </div>
                        )}
                        
                        {log.reason && (
                          <div className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            Reason: {log.reason}
                          </div>
                        )}
                        
                        {log.details && (
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
                No diagnostics audit logs found for the selected filters
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
