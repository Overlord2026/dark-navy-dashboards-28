
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger, LogEntry, LogLevel } from "@/services/logging/loggingService";

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<LogLevel | 'all'>('all');
  
  const refreshLogs = () => {
    if (activeTab === 'all') {
      setLogs(logger.getRecentLogs(100));
    } else {
      setLogs(logger.getLogsByLevel(activeTab as LogLevel, 100));
    }
  };
  
  useEffect(() => {
    refreshLogs();
    // Set up an interval to refresh logs every 10 seconds
    const interval = setInterval(refreshLogs, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as LogLevel | 'all');
  };
  
  const exportLogs = () => {
    try {
      const logsJson = JSON.stringify(logs, null, 2);
      const blob = new Blob([logsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
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
  
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'debug': return 'text-blue-600 dark:text-blue-400';
      case 'info': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-1 rounded';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>System Logs</CardTitle>
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
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              <span>Filter</span>
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[400px] rounded-md border">
              {logs.length > 0 ? (
                <div className="p-4 space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={getLevelColor(log.level)}>{log.level.toUpperCase()}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      {log.source && (
                        <p className="text-xs text-muted-foreground mt-1">Source: {log.source}</p>
                      )}
                      {log.data && (
                        <pre className="mt-1 text-xs p-2 bg-muted rounded-sm overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No logs to display</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
