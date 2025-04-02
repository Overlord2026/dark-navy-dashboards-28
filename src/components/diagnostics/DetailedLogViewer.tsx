
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { runDiagnostics } from "@/services/diagnosticsService";
import { LogEntry, LogLevel } from "@/types/diagnostics";
import { LogsToolbar } from "./LogsToolbar";
import { LogsList } from "./LogsList";

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
        level: results.overall as LogLevel,
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
          level: test.status as LogLevel,
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
          level: test.status as LogLevel,
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
          level: test.status as LogLevel,
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
          level: test.status as LogLevel,
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
          level: test.status as LogLevel,
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
        <LogsToolbar 
          filter={filter}
          setFilter={setFilter}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          handleRefresh={handleRefresh}
          exportLogs={exportLogs}
          runFullSystemDiagnostic={runFullSystemDiagnostic}
          isRunningFullTest={isRunningFullTest}
          logsCount={logs.length}
        />
        
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <LogsList 
            logs={filteredLogs}
            isLoading={isRunningFullTest}
            filter={filter}
            expandedLog={expandedLog}
            setExpandedLog={setExpandedLog}
            setFilter={setFilter}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
