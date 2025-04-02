
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { auditLog, AuditLogEntry, AuditEventType } from "@/services/auditLog/auditLogService";

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  
  const refreshLogs = () => {
    setLogs(auditLog.getRecentEntries(100));
  };
  
  useEffect(() => {
    refreshLogs();
    // Set up an interval to refresh logs every 10 seconds
    const interval = setInterval(refreshLogs, 10000);
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
      JSON.stringify(log.metadata).toLowerCase().includes(term)
    );
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);
  
  const exportLogs = () => {
    try {
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
    } catch (error) {
      console.error("Error exporting logs:", error);
    }
  };
  
  const getEventTypeColor = (type: AuditEventType) => {
    switch (type) {
      case 'login':
      case 'logout':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'document_access':
      case 'document_modification':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'password_change':
      case 'profile_update':
      case 'settings_change':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'permission_change':
      case 'system_change':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'diagnostics_access':
      case 'api_access':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getResultBadge = (result: 'success' | 'failure') => {
    return result === 'success' 
      ? <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">Success</span>
      : <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">Failure</span>;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4" />
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
        
        <ScrollArea className="h-[400px] rounded-md border">
          {filteredLogs.length > 0 ? (
            <div className="p-4 space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getEventTypeColor(log.eventType)}`}>
                        {log.eventType.replace('_', ' ')}
                      </span>
                      {getResultBadge(log.result)}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">User: {log.userId}</p>
                      {log.metadata?.userName && (
                        <p className="text-xs text-muted-foreground">
                          {log.metadata.userName} {log.metadata.userRole ? `(${log.metadata.userRole})` : ''}
                        </p>
                      )}
                    </div>
                    {log.metadata?.resourceType && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {log.metadata.resourceType}
                      </span>
                    )}
                  </div>
                  {log.metadata?.details && (
                    <div className="mt-1">
                      <p className="text-xs">
                        {log.metadata.details.action}
                      </p>
                      {log.result === 'failure' && log.metadata.reason && (
                        <p className="text-xs text-red-500 mt-1">
                          Reason: {log.metadata.reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No audit logs to display</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
