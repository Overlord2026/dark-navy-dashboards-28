
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ArrowDownUp, AlertCircle, Info, Bug, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import { runDiagnostics } from "@/services/diagnosticsService";

// Define the log entry type with specific level types
interface LogEntry {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug" | "success";
  message: string;
  source: string;
  details?: string;
}

export const DetailedLogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [isRunningFullTest, setIsRunningFullTest] = useState(false);
  
  // Simulate fetching logs
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchLogs = () => {
      const sampleLogs: LogEntry[] = [
        {
          id: "log-1",
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: "error",
          message: "Failed to connect to API endpoint",
          source: "ApiService",
          details: "Connection timeout after 30 seconds. Endpoint: /api/v1/data. Response code: 504."
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 180000).toISOString(),
          level: "warning",
          message: "User session expired",
          source: "AuthService",
          details: "User session timed out after period of inactivity. User ID: USR-12345"
        },
        {
          id: "log-3",
          timestamp: new Date(Date.now() - 240000).toISOString(),
          level: "info",
          message: "User completed onboarding flow",
          source: "OnboardingService"
        },
        {
          id: "log-4",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: "debug",
          message: "Rendering component with props",
          source: "DashboardComponent",
          details: "Props: { userId: 'USR-12345', showWelcome: true, notifications: 3 }"
        },
        {
          id: "log-5",
          timestamp: new Date(Date.now() - 360000).toISOString(),
          level: "error",
          message: "Invalid data format received",
          source: "DataProcessor",
          details: "Expected JSON object but received array. Data: [1, 2, 3]"
        }
      ];
      
      setLogs(sampleLogs);
    };
    
    fetchLogs();
  }, []);
  
  // Run a full system diagnostic test
  const runFullSystemDiagnostic = async () => {
    setIsRunningFullTest(true);
    toast.info("Running comprehensive system diagnostic test...");
    
    try {
      // Run the diagnostics
      const results = await runDiagnostics();
      
      // Generate detailed logs from the diagnostic results
      const newLogs: LogEntry[] = [];
      
      // Add an overall summary log
      newLogs.push({
        id: `diagnostic-summary-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: results.overall as "error" | "warning" | "info" | "success",
        message: `System Diagnostic Test: Overall status is ${results.overall}`,
        source: "DiagnosticService",
        details: `Completed full diagnostic scan at ${new Date().toLocaleString()}. Found ${
          Object.values(results).flat().filter((test: any) => test.status === "error").length
        } errors and ${
          Object.values(results).flat().filter((test: any) => test.status === "warning").length
        } warnings.`
      });
      
      // Add logs for security tests
      results.securityTests?.forEach((test: any, index: number) => {
        newLogs.push({
          id: `security-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: test.status as "error" | "warning" | "info" | "debug",
          message: `Security Test: ${test.name}`,
          source: "SecurityService",
          details: `${test.message}${test.severity ? ` | Severity: ${test.severity}` : ''}${
            test.remediation ? ` | Remediation: ${test.remediation}` : ''
          }`
        });
      });
      
      // Add logs for API integration tests
      results.apiIntegrationTests?.forEach((test: any, index: number) => {
        newLogs.push({
          id: `api-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: test.status as "error" | "warning" | "info" | "debug",
          message: `API Test: ${test.service} (${test.endpoint})`,
          source: "ApiService",
          details: `${test.message} | Response Time: ${test.responseTime}ms${
            test.authStatus ? ` | Auth Status: ${test.authStatus}` : ''
          }`
        });
      });
      
      // Add logs for navigation tests
      results.navigationTests?.forEach((test: any, index: number) => {
        newLogs.push({
          id: `nav-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: test.status as "error" | "warning" | "info" | "debug",
          message: `Navigation Test: ${test.route}`,
          source: "RouterService",
          details: test.message
        });
      });
      
      // Add logs for permission tests
      results.permissionsTests?.forEach((test: any, index: number) => {
        newLogs.push({
          id: `perm-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: test.status as "error" | "warning" | "info" | "debug",
          message: `Permission Test: ${test.role} - ${test.permission}`,
          source: "AuthorizationService",
          details: test.message
        });
      });
      
      // Add logs for performance tests
      results.performanceTests?.forEach((test: any, index: number) => {
        newLogs.push({
          id: `perf-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: test.status as "error" | "warning" | "info" | "debug",
          message: `Performance Test: ${test.name}`,
          source: "PerformanceService",
          details: `${test.message} | Response Time: ${test.responseTime}ms | CPU: ${test.cpuUsage}% | Memory: ${test.memoryUsage}MB`
        });
      });
      
      // Set the new logs
      setLogs(newLogs);
      
      toast.success("System diagnostic test completed", {
        description: "Check the logs for detailed results"
      });
    } catch (error) {
      toast.error("Failed to run diagnostic test", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      
      // Add error log
      setLogs([
        {
          id: `diagnostic-error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: "error",
          message: "Failed to run system diagnostic test",
          source: "DiagnosticService",
          details: error instanceof Error ? error.message : "An unknown error occurred"
        },
        ...logs
      ]);
    } finally {
      setIsRunningFullTest(false);
    }
  };
  
  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => 
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.source.toLowerCase().includes(filter.toLowerCase()) ||
      log.level.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortDesc ? timeB - timeA : timeA - timeB;
    });
  
  // Toggle log details
  const toggleLogDetails = (logId: string) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };
  
  // Get icon for log level
  const getLogLevelIcon = (level: "error" | "warning" | "info" | "debug" | "success") => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "debug":
        return <Bug className="h-4 w-4 text-gray-500" />;
      case "success":
        return <Info className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get badge for log level
  const getLogLevelBadge = (level: "error" | "warning" | "info" | "debug" | "success") => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Warning</Badge>;
      case "info":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Info</Badge>;
      case "debug":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500">Debug</Badge>;
      case "success":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Success</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Refresh logs
  const handleRefresh = () => {
    // In a real app, this would re-fetch logs from the API
    toast.success("Refreshing logs...");
    // For now, just shuffle the order a bit to simulate refresh
    setLogs(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Export logs as JSON for backend developers
  const exportLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-diagnostic-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Logs exported successfully", {
      description: "Diagnostic data has been saved as JSON file"
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">System Logs</CardTitle>
        <CardDescription>Detailed logs for system diagnostics and debugging</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter logs..."
                className="pl-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDesc(!sortDesc)}
              title={sortDesc ? "Newest first" : "Oldest first"}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              title="Refresh logs"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runFullSystemDiagnostic} 
              disabled={isRunningFullTest}
              className="gap-2"
            >
              {isRunningFullTest ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Full Diagnostic...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4" />
                  Run System-Wide Diagnostic
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={exportLogs}
              className="gap-2"
              disabled={logs.length === 0 || isRunningFullTest}
            >
              <FileText className="h-4 w-4" />
              Export For Developers
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {isRunningFullTest ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-center font-medium">Running Comprehensive System Diagnostics</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment as we test all system components...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleLogDetails(log.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getLogLevelIcon(log.level)}</div>
                      <div>
                        <div className="font-medium">{log.message}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()} • Source: {log.source}
                        </div>
                      </div>
                    </div>
                    <div>
                      {getLogLevelBadge(log.level)}
                    </div>
                  </div>
                  
                  {expandedLog === log.id && log.details && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <div className="font-medium mb-1">Details:</div>
                      <div className="bg-muted p-2 rounded font-mono text-xs overflow-x-auto">
                        {log.details}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              {filter ? (
                <>
                  <p>No logs matching "{filter}"</p>
                  <Button variant="link" onClick={() => setFilter("")}>Clear filter</Button>
                </>
              ) : (
                <p>No logs available. Run a system-wide diagnostic to generate logs.</p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
