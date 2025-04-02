
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCog, Download, Copy, Filter } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LogEntry {
  timestamp: string;
  level: "error" | "warning" | "info" | "debug";
  message: string;
  source?: string;
  details?: string;
  id: string;
}

interface DetailedLogViewerProps {
  initialLogs?: LogEntry[];
  maxEntries?: number;
  showFilters?: boolean;
}

export const DetailedLogViewer = ({ 
  initialLogs = [], 
  maxEntries = 100,
  showFilters = true
}: DetailedLogViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(initialLogs);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  // For a real application, this would fetch logs from an API or service
  useEffect(() => {
    // This is just a placeholder for demonstration
    // In a real app, you'd likely fetch logs from an API
    if (initialLogs.length === 0) {
      const demoLogs: LogEntry[] = [
        {
          id: "log-1",
          timestamp: new Date().toISOString(),
          level: "error",
          message: "Failed to connect to API endpoint /api/data",
          source: "ApiService",
          details: "Connection timeout after 30s. Endpoint: https://api.example.com/data"
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          level: "warning",
          message: "Slow database query detected",
          source: "DatabaseService",
          details: "Query took 4500ms to execute: SELECT * FROM large_table WHERE..."
        },
        {
          id: "log-3",
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          level: "info",
          message: "User authentication successful",
          source: "AuthService"
        },
        {
          id: "log-4",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          level: "debug",
          message: "Cache invalidated for user profile",
          source: "CacheService",
          details: "Cache keys: user_profile_123, user_settings_123"
        },
      ].map(log => ({ ...log, id: log.id }));
      
      setLogs(demoLogs);
      setFilteredLogs(demoLogs);
    } else {
      setLogs(initialLogs);
      setFilteredLogs(initialLogs);
    }
  }, [initialLogs]);
  
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(
        logs.filter(log => activeFilters.includes(log.level))
      );
    }
  }, [activeFilters, logs]);
  
  const toggleFilter = (level: string) => {
    if (activeFilters.includes(level)) {
      setActiveFilters(activeFilters.filter(f => f !== level));
    } else {
      setActiveFilters([...activeFilters, level]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      case "debug":
        return <Badge variant="outline">Debug</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };
  
  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.source ? `[${log.source}] ` : ''}${log.message}${log.details ? `\nDetails: ${log.details}` : ''}`
    ).join('\n\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Logs downloaded successfully");
  };
  
  const toggleExpandLog = (id: string) => {
    if (expandedLogId === id) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(id);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileCog className="h-5 w-5" />
            <span>Detailed System Logs</span>
          </div>
          
          <div className="flex gap-2">
            {showFilters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={() => toggleFilter("error")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm border flex items-center justify-center">
                      {activeFilters.includes("error") && <div className="w-2 h-2 bg-primary rounded-sm" />}
                    </div>
                    <span>Errors</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => toggleFilter("warning")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm border flex items-center justify-center">
                      {activeFilters.includes("warning") && <div className="w-2 h-2 bg-primary rounded-sm" />}
                    </div>
                    <span>Warnings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => toggleFilter("info")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm border flex items-center justify-center">
                      {activeFilters.includes("info") && <div className="w-2 h-2 bg-primary rounded-sm" />}
                    </div>
                    <span>Info</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => toggleFilter("debug")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm border flex items-center justify-center">
                      {activeFilters.includes("debug") && <div className="w-2 h-2 bg-primary rounded-sm" />}
                    </div>
                    <span>Debug</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadLogs}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-md max-h-[500px] overflow-y-auto">
          {filteredLogs.length > 0 ? (
            <div className="divide-y">
              {filteredLogs.slice(0, maxEntries).map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 hover:bg-muted/40 transition-colors ${
                    log.level === "error" ? "bg-red-50/30 dark:bg-red-950/10" :
                    log.level === "warning" ? "bg-yellow-50/30 dark:bg-yellow-950/10" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={
                        log.level === "error" ? "error" : 
                        log.level === "warning" ? "warning" : "success"
                      } />
                      <span className="font-medium">{log.message}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {getLevelBadge(log.level)}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(`[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-1 flex items-center text-xs text-muted-foreground gap-3">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    {log.source && <span>Source: {log.source}</span>}
                  </div>
                  
                  {log.details && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpandLog(log.id)}
                        className="mt-2 h-6 text-xs px-2"
                      >
                        {expandedLogId === log.id ? "Hide details" : "Show details"}
                      </Button>
                      
                      {expandedLogId === log.id && (
                        <div className="mt-2 text-xs p-2 bg-muted rounded-md font-mono whitespace-pre-wrap">
                          {log.details}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No logs to display</p>
              {activeFilters.length > 0 && (
                <Button 
                  variant="link" 
                  onClick={clearFilters} 
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
        
        {logs.length > maxEntries && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Showing {maxEntries} of {logs.length} log entries
          </div>
        )}
      </CardContent>
    </Card>
  );
};
