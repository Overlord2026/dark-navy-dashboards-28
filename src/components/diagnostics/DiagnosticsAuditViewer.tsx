
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Calendar } from "lucide-react";
import { auditLog, AuditLogEntry } from "@/services/auditLog/auditLogService";

export function DiagnosticsAuditViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  
  const refreshLogs = () => {
    // Get all diagnostics-related logs
    const allLogs = auditLog.getRecentEntries(200);
    const diagnosticsLogs = allLogs.filter(log => 
      log.eventType === 'diagnostics_access' || 
      (log.eventType === 'settings_change' && 
       log.metadata?.resourceType === 'diagnostics')
    );
    setLogs(diagnosticsLogs);
  };
  
  useEffect(() => {
    refreshLogs();
    // Set up an interval to refresh logs every 10 seconds
    const interval = setInterval(refreshLogs, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Diagnostics Activity</h3>
          <Button variant="outline" size="sm" onClick={refreshLogs} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border">
          {logs.length > 0 ? (
            <div className="p-4 space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      log.metadata?.details?.action?.includes('Run')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20'
                    }`}>
                      {log.metadata?.details?.action?.includes('Run') ? (
                        <Zap className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {log.metadata?.details?.action || "Diagnostics activity"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By {log.metadata?.userName || log.userId}
                            {log.metadata?.userRole ? ` (${log.metadata.userRole})` : ''}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {log.metadata?.details?.result && (
                        <div className={`mt-2 text-sm ${
                          log.metadata.details.result === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : log.metadata.details.result === 'warning'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          Result: {log.metadata.details.result}
                        </div>
                      )}
                      
                      {log.metadata?.details?.testsConducted && (
                        <p className="text-sm mt-1">
                          Tests conducted: {log.metadata.details.testsConducted}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No diagnostics audit logs to display</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
