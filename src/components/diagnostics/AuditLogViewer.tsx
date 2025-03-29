
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { auditLog, AuditLogEntry, AuditAction } from "@/services/auditLog/auditLogService";
import { format } from "date-fns";
import { AlertCircle, Download, Filter, RefreshCw, Search, ShieldAlert, User } from "lucide-react";

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<number>(7); // days
  
  const fetchLogs = () => {
    let options: any = {};
    
    if (timeRange) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);
      options.startDate = startDate;
    }
    
    if (actionFilter !== "all") {
      options.action = actionFilter;
    }
    
    if (statusFilter !== "all") {
      options.status = statusFilter;
    }
    
    const fetchedLogs = auditLog.getLogs(options);
    setLogs(fetchedLogs);
    filterLogs(fetchedLogs, searchTerm);
  };

  useEffect(() => {
    fetchLogs();
    // Refresh logs every 60 seconds
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, [timeRange, actionFilter, statusFilter]);

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

  const getActionIcon = (action: AuditAction) => {
    if (action.includes('file')) {
      return <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>;
    } else if (action.includes('login') || action.includes('logout')) {
      return <User className="h-4 w-4 text-green-500" />;
    } else if (action.includes('permission') || action.includes('mfa')) {
      return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    } else {
      return <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>;
    }
  };

  const getStatusClass = (status: 'success' | 'failure') => {
    return status === 'success' 
      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
      : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
  };

  const exportLogs = () => {
    const logData = auditLog.exportLogs();
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActionLabel = (action: AuditAction) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Security Audit Logs
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
                  placeholder="Search audit logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select
                  value={actionFilter}
                  onValueChange={(value) => setActionFilter(value as AuditAction | "all")}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="file_upload">File Upload</SelectItem>
                    <SelectItem value="file_download">File Download</SelectItem>
                    <SelectItem value="file_delete">File Delete</SelectItem>
                    <SelectItem value="document_access">Document Access</SelectItem>
                    <SelectItem value="settings_change">Settings Change</SelectItem>
                    <SelectItem value="profile_update">Profile Update</SelectItem>
                    <SelectItem value="permission_change">Permission Change</SelectItem>
                    <SelectItem value="mfa_enabled">MFA Enabled</SelectItem>
                    <SelectItem value="mfa_disabled">MFA Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                      {getActionIcon(log.action)}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {getActionLabel(log.action)}
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
                          <span>User: {log.userName || log.userId}</span>
                          {log.userRole && <span>Role: {log.userRole}</span>}
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                        
                        {log.resourceId && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Resource ID: {log.resourceId}
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
                No audit logs found for the selected filters
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
