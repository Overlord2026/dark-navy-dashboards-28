import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditLog, AuditLogEntry } from "@/services/auditLog/auditLogService";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SupabaseAuditLogViewer } from "./SupabaseAuditLogViewer";

export function PublishAuditLogViewer() {
  // Use in-memory logs for backwards compatibility
  const [useSupabase, setUseSupabase] = useState(true);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const refreshLogs = () => {
    setLogs(auditLog.getRecentEntries(100));
  };
  
  useEffect(() => {
    refreshLogs();
    // Set up an interval to refresh logs every 30 seconds
    const interval = setInterval(refreshLogs, 30000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logs);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = logs.filter(log => 
      log.userId.toLowerCase().includes(term) ||
      log.eventType.toLowerCase().includes(term) ||
      (log.metadata?.userName || '').toLowerCase().includes(term) ||
      (log.metadata?.resourceId || '').toLowerCase().includes(term) ||
      (log.metadata?.resourceType || '').toLowerCase().includes(term) ||
      JSON.stringify(log.metadata?.details || {}).toLowerCase().includes(term) ||
      (log.metadata?.reason || '').toLowerCase().includes(term)
    );
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);
  
  const exportLogs = () => {
    const logsJson = JSON.stringify(logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Use the Supabase viewer component if enabled
  if (useSupabase) {
    return <SupabaseAuditLogViewer />;
  }
  
  // Otherwise fall back to the old in-memory version
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Publication Audit Logs</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
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
        
        <div className="rounded-md border">
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-2 text-left align-middle font-medium">Time</th>
                  <th className="h-10 px-2 text-left align-middle font-medium">User</th>
                  <th className="h-10 px-2 text-left align-middle font-medium">Event</th>
                  <th className="h-10 px-2 text-left align-middle font-medium">Status</th>
                  <th className="h-10 px-2 text-left align-middle font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-2 align-middle text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2 align-middle">
                        <div className="font-medium text-sm">{log.userId}</div>
                        {log.metadata?.userName && (
                          <div className="text-xs text-muted-foreground">{log.metadata.userName}</div>
                        )}
                        {log.metadata?.userRole && (
                          <div className="text-xs text-muted-foreground">Role: {log.metadata.userRole}</div>
                        )}
                        {log.metadata?.ipAddress && (
                          <div className="text-xs text-muted-foreground">IP: {log.metadata.ipAddress}</div>
                        )}
                      </td>
                      <td className="p-2 align-middle">
                        <div className="font-medium text-sm">
                          {log.eventType.replace(/_/g, ' ')}
                        </div>
                        {log.metadata?.resourceId && (
                          <div className="text-xs text-muted-foreground">
                            Resource: {log.metadata.resourceId}
                          </div>
                        )}
                      </td>
                      <td className="p-2 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-2 align-middle text-sm">
                        {log.metadata?.details && (
                          <div>
                            {log.metadata.details.action && (
                              <div className="font-medium">{log.metadata.details.action}</div>
                            )}
                            {log.metadata.details.result && (
                              <div className={`text-xs ${
                                log.metadata.details.result === 'success'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                Result: {log.metadata.details.result}
                              </div>
                            )}
                            {log.metadata.reason && (
                              <div className="text-xs text-red-600 mt-1">
                                Reason: {log.metadata.reason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="h-24 text-center">
                      No matching audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
