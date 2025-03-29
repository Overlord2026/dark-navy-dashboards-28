
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LogEntry, LogLevel } from "@/services/diagnostics/types";
import { logger, LogLevels } from "@/services/logging/loggingService";
import { AlertCircle, Bug, Download, Filter, Info, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";

export const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<number>(24); // hours
  
  const fetchLogs = () => {
    const since = timeRange ? new Date(Date.now() - timeRange * 60 * 60 * 1000) : undefined;
    const level = levelFilter !== "all" ? levelFilter as LogLevel : undefined;
    const fetchedLogs = logger.getLogs(level, since);
    setLogs(fetchedLogs);
    filterLogs(fetchedLogs, searchTerm);
  };

  useEffect(() => {
    fetchLogs();
    // Refresh logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [timeRange, levelFilter]);

  useEffect(() => {
    filterLogs(logs, searchTerm);
  }, [searchTerm]);

  const filterLogs = (logsToFilter: LogEntry[], term: string) => {
    if (!term) {
      setFilteredLogs(logsToFilter);
      return;
    }
    
    const filtered = logsToFilter.filter(log => 
      log.message.toLowerCase().includes(term.toLowerCase()) ||
      (log.source && log.source.toLowerCase().includes(term.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(term.toLowerCase())) ||
      (log.stackTrace && log.stackTrace.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredLogs(filtered);
  };

  const getLogLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getLogLevelClass = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800";
      case 'warning':
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
      case 'error':
        return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
      case 'critical':
        return "bg-red-100 border-red-300 dark:bg-red-950/50 dark:border-red-900";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/30 dark:border-gray-800";
    }
  };

  const exportLogs = () => {
    const logData = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
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
            <Bug className="h-5 w-5" />
            System Logs
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
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select
                  value={levelFilter}
                  onValueChange={(value) => setLevelFilter(value as LogLevel | "all")}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value={LogLevels.INFO}>Info</SelectItem>
                    <SelectItem value={LogLevels.WARNING}>Warning</SelectItem>
                    <SelectItem value={LogLevels.ERROR}>Error</SelectItem>
                    <SelectItem value={LogLevels.CRITICAL}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select
                  value={timeRange.toString()}
                  onValueChange={(value) => setTimeRange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last hour</SelectItem>
                    <SelectItem value="24">Last 24 hours</SelectItem>
                    <SelectItem value="72">Last 3 days</SelectItem>
                    <SelectItem value="168">Last week</SelectItem>
                    <SelectItem value="0">All logs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'} found
          </div>

          <ScrollArea className="h-[500px] rounded border">
            {filteredLogs.length > 0 ? (
              <div className="space-y-2 p-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-md border ${getLogLevelClass(log.level)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getLogLevelIcon(log.level)}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{log.message}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        
                        {log.source && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Source: {log.source}
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
                        
                        {log.stackTrace && (
                          <div className="mt-2 text-sm">
                            <div className="font-medium text-xs mb-1">Stack Trace:</div>
                            <pre className="bg-background/50 p-2 rounded text-xs overflow-x-auto">
                              {log.stackTrace}
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
                No logs found for the selected filters
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
