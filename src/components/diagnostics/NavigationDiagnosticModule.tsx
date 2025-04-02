
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogsList } from "@/components/diagnostics/LogsList";
import { LogsToolbar } from "@/components/diagnostics/LogsToolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, AlertTriangle, AlertCircle, CheckCircle, 
  Navigation, MonitorSmartphone, LayoutDashboard, Timer 
} from "lucide-react";
import { LogEntry, NavigationDiagnosticResult, DiagnosticSummary } from "@/types/diagnostics";
import { v4 as uuidv4 } from "uuid";
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems
} from "@/components/navigation/NavigationConfig";
import { toast } from "sonner";

const NavigationDiagnosticModule: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);
  
  // Function to simulate running diagnostics on a specific route
  const runRouteCheck = async (route: string, tabName: string): Promise<NavigationDiagnosticResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Generate random outcome (in a real app, this would be actual testing logic)
    const randomStatus = Math.random();
    
    if (randomStatus > 0.85) { // 15% chance of error
      return {
        route,
        status: "error",
        message: `Failed to load "${tabName}" tab at route ${route}`,
        componentStatus: {
          rendered: false,
          errors: ["Component failed to mount", "React error boundary triggered"]
        },
        apiStatus: [
          {
            endpoint: `api/data/${route.replace(/\//g, '_')}`,
            status: "error",
            responseTime: 2345,
            errorMessage: "API request timeout after 2000ms"
          }
        ],
        consoleErrors: [
          "TypeError: Cannot read property 'data' of undefined",
          "React error: Maximum update depth exceeded"
        ]
      };
    } else if (randomStatus > 0.65) { // 20% chance of warning
      return {
        route,
        status: "warning",
        message: `"${tabName}" tab loaded with warnings`,
        componentStatus: {
          rendered: true,
          loadTime: 1250,
          errors: ["Non-critical UI elements failed to render"]
        },
        apiStatus: [
          {
            endpoint: `api/data/${route.replace(/\//g, '_')}`,
            status: "warning",
            responseTime: 1650,
            errorMessage: "Slow response time (>1500ms)"
          }
        ],
        consoleErrors: [
          "Warning: componentWillMount is deprecated"
        ]
      };
    } else { // 65% chance of success
      return {
        route,
        status: "success",
        message: `"${tabName}" tab loaded successfully`,
        componentStatus: {
          rendered: true,
          loadTime: 420 + Math.random() * 300
        },
        apiStatus: [
          {
            endpoint: `api/data/${route.replace(/\//g, '_')}`,
            status: "success",
            responseTime: 320 + Math.random() * 200
          }
        ]
      };
    }
  };

  // Function to run diagnostics on all navigation items
  const runNavigationDiagnostics = async () => {
    setIsLoading(true);
    setLogs([]);
    setSummary(null);
    
    try {
      // Log the start of diagnostics
      const startLog: LogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Starting navigation diagnostics",
        source: "NavigationDiagnosticModule"
      };
      
      setLogs(prev => [startLog]);
      
      // Get all navigation items to test
      const allNavItems = [
        ...homeNavItems,
        ...educationSolutionsNavItems,
        ...familyWealthNavItems,
        ...collaborationNavItems
      ];
      
      // Create a counter for summary statistics
      let totalTests = 0;
      let successTests = 0;
      let warningTests = 0;
      let errorTests = 0;

      // Test each navigation item
      for (const navItem of allNavItems) {
        totalTests++;
        
        // Create a processing log entry
        const processingLog: LogEntry = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Testing navigation to ${navItem.title}`,
          source: "NavigationTest",
          related: {
            route: navItem.href,
            navigationTab: navItem.title,
          }
        };
        
        setLogs(prev => [...prev, processingLog]);
        
        // Run the diagnostic
        const result = await runRouteCheck(navItem.href, navItem.title);
        
        // Update counters
        if (result.status === "success") successTests++;
        else if (result.status === "warning") warningTests++;
        else if (result.status === "error") errorTests++;
        
        // Create log entry based on result
        const resultLog: LogEntry = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          level: result.status as LogLevel,
          message: result.message,
          source: "NavigationTest",
          details: JSON.stringify(result, null, 2),
          related: {
            route: result.route,
            navigationTab: navItem.title,
            component: navItem.title + "Component"
          },
          recommendations: getRecommendations(result)
        };
        
        setLogs(prev => [...prev, resultLog]);
        
        // Simulate a slight delay between checks
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Create a summary
      const completionLog: LogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Navigation diagnostics completed",
        source: "NavigationDiagnosticModule",
        details: `Tests completed: ${totalTests}. Success: ${successTests}, Warnings: ${warningTests}, Errors: ${errorTests}`
      };
      
      setLogs(prev => [...prev, completionLog]);
      
      // Set summary
      const overallStatus = errorTests > 0 
        ? "error" 
        : warningTests > 0 
          ? "warning" 
          : "success";
          
      setSummary({
        overall: overallStatus,
        total: totalTests,
        success: successTests,
        warnings: warningTests,
        errors: errorTests,
        timestamp: new Date().toISOString()
      });
      
      // Show toast notification
      if (overallStatus === "success") {
        toast.success("All navigation checks passed", {
          description: `${successTests} routes verified successfully`
        });
      } else if (overallStatus === "warning") {
        toast.warning("Navigation checks completed with warnings", {
          description: `${warningTests} warnings found in ${totalTests} routes`
        });
      } else {
        toast.error("Navigation checks failed", {
          description: `${errorTests} errors found in ${totalTests} routes`
        });
      }
    } catch (error) {
      console.error("Error running navigation diagnostics:", error);
      
      const errorLog: LogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Failed to complete navigation diagnostics",
        source: "NavigationDiagnosticModule",
        details: error instanceof Error ? error.message : "Unknown error"
      };
      
      setLogs(prev => [...prev, errorLog]);
      
      toast.error("Diagnostic process failed", {
        description: "Could not complete navigation health checks"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate recommendations based on diagnostic results
  const getRecommendations = (result: NavigationDiagnosticResult): string[] => {
    const recommendations: string[] = [];
    
    if (result.status === "error") {
      recommendations.push("Check component render functions for errors");
      recommendations.push("Verify all required props are being passed");
      
      if (result.apiStatus?.some(api => api.status === "error")) {
        recommendations.push("Check API endpoint connectivity and authentication");
        recommendations.push("Verify data structure matches component expectations");
      }
      
      if (result.consoleErrors?.length) {
        recommendations.push("Review console errors for detailed debugging information");
      }
    }
    
    if (result.status === "warning") {
      recommendations.push("Review component performance metrics");
      
      if (result.apiStatus?.some(api => api.status === "warning")) {
        recommendations.push("Optimize API response time or implement caching");
      }
      
      if (result.componentStatus?.loadTime && result.componentStatus.loadTime > 1000) {
        recommendations.push("Optimize component rendering to improve load time");
      }
    }
    
    return recommendations;
  };
  
  // Handle refreshing the diagnostics
  const handleRefresh = () => {
    runNavigationDiagnostics();
  };
  
  // Export logs as JSON for developers
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `navigation-diagnostics-${new Date().toISOString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast.success("Diagnostics exported successfully", {
        description: "JSON file has been downloaded"
      });
    } catch (error) {
      console.error("Error exporting diagnostics:", error);
      toast.error("Failed to export diagnostics", {
        description: "Could not generate export file"
      });
    }
  };
  
  // Filter logs based on log level
  const getFilteredLogs = () => {
    let filtered = logs;
    
    if (activeTab !== "all") {
      filtered = logs.filter(log => log.level === activeTab);
    }
    
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(lowerFilter) ||
        log.source.toLowerCase().includes(lowerFilter) ||
        (log.details && log.details.toLowerCase().includes(lowerFilter))
      );
    }
    
    // Sort logs by timestamp
    return filtered.sort((a, b) => {
      if (sortDesc) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
    });
  };
  
  // Automatically run diagnostics when component mounts
  useEffect(() => {
    runNavigationDiagnostics();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              <CardTitle>Navigation Health Check</CardTitle>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              disabled={isLoading} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Test all navigation routes and components for proper functionality
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {summary && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Overall Status</div>
                <div className="flex items-center justify-center">
                  {summary.overall === "success" && <CheckCircle className="h-8 w-8 text-green-500" />}
                  {summary.overall === "warning" && <AlertTriangle className="h-8 w-8 text-yellow-500" />}
                  {summary.overall === "error" && <AlertCircle className="h-8 w-8 text-red-500" />}
                </div>
                <div className="mt-2 font-semibold">
                  {summary.overall === "success" && "All Checks Passed"}
                  {summary.overall === "warning" && "Some Warnings"}
                  {summary.overall === "error" && "Issues Detected"}
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Components</div>
                <div className="flex items-center justify-center">
                  <MonitorSmartphone className="h-6 w-6 text-blue-500" />
                </div>
                <div className="mt-2 text-xl font-semibold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Routes Checked</div>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Route Status</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">{summary.success}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">{summary.warnings}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-red-600 dark:text-red-400">{summary.errors}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  {summary.errors === 0 && summary.warnings === 0 ? (
                    <span className="text-green-600 dark:text-green-400">All routes healthy</span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      {summary.errors > 0 ? "Critical issues" : "Performance warnings"}
                    </span>
                  )}
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Last Run</div>
                <div className="flex items-center justify-center">
                  <Timer className="h-6 w-6 text-purple-500" />
                </div>
                <div className="mt-2 text-sm font-medium">
                  {new Date(summary.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(summary.timestamp).toLocaleDateString()}
                </div>
              </Card>
            </div>
          )}
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4">
            <LogsToolbar
              filter={filter}
              setFilter={setFilter}
              sortDesc={sortDesc}
              setSortDesc={setSortDesc}
              handleRefresh={handleRefresh}
              exportLogs={exportLogs}
              runFullSystemDiagnostic={runNavigationDiagnostics}
              isRunningFullTest={isLoading}
              logsCount={logs.length}
            />
            
            <div className="mt-4">
              <LogsList
                logs={getFilteredLogs()}
                isLoading={isLoading}
                filter={filter}
                expandedLog={expandedLog}
                setExpandedLog={setExpandedLog}
                setFilter={setFilter}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground">
          Self-diagnostic tools should be used before deploying updates to ensure navigation integrity.
        </CardFooter>
      </Card>
    </div>
  );
};

export default NavigationDiagnosticModule;
