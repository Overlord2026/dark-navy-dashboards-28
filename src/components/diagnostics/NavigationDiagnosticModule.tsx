
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  RefreshCw,
  CheckCheck
} from "lucide-react";
import { toast } from "sonner";
import { testAllNavigationRoutes, getNavigationDiagnosticsSummary } from "@/services/diagnostics/navigationDiagnostics";
import { testNavigation } from "@/services/diagnostics/navigationTests";
import { NavigationDiagnosticResult, LogLevel } from "@/types/diagnostics";

const NavigationDiagnosticModule: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tab, setTab] = useState("overview");
  const [results, setResults] = useState<Record<string, NavigationDiagnosticResult[]>>({});
  const [summary, setSummary] = useState<{
    overallStatus: "success" | "warning" | "error";
    totalRoutes: number;
    successCount: number;
    warningCount: number;
    errorCount: number;
  } | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [detailedView, setDetailedView] = useState<NavigationDiagnosticResult | null>(null);
  
  // Function to toggle the expanded state of an item
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Function to run the diagnostics
  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults({});
    setSummary(null);
    
    try {
      // Get all navigation diagnostics
      const allResults = await testAllNavigationRoutes();
      setResults(allResults);
      
      // Get summary
      const diagSummary = await getNavigationDiagnosticsSummary();
      setSummary({
        overallStatus: diagSummary.overallStatus,
        totalRoutes: diagSummary.totalRoutes,
        successCount: diagSummary.successCount,
        warningCount: diagSummary.warningCount,
        errorCount: diagSummary.errorCount
      });
      
      // Show toast based on overall status
      if (diagSummary.overallStatus === "success") {
        toast.success("All navigation routes are healthy");
      } else if (diagSummary.overallStatus === "warning") {
        toast.warning("Some navigation routes have warnings");
      } else {
        toast.error("Some navigation routes have errors");
      }
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Failed to run diagnostics");
    } finally {
      setIsRunning(false);
    }
  };
  
  // Function to apply a fix for a specific route issue
  const applyFix = (route: string, issue: string) => {
    toast.success(`Applied fix for ${route}: ${issue}`);
    
    // In a real application, this would actually fix the issue
    // Here we'll just remove the item from the results to simulate a fix
    
    // Find which category the route belongs to
    let categoryFound = "";
    Object.entries(results).forEach(([category, items]) => {
      if (items.some(item => item.route === route)) {
        categoryFound = category;
      }
    });
    
    if (categoryFound) {
      const updatedResults = { ...results };
      updatedResults[categoryFound] = results[categoryFound].filter(
        item => item.route !== route || item.status === "success"
      );
      setResults(updatedResults);
      
      // Update summary counts
      if (summary) {
        const newSummary = { ...summary };
        if (issue.includes("error")) {
          newSummary.errorCount = Math.max(0, newSummary.errorCount - 1);
          newSummary.successCount += 1;
        } else if (issue.includes("warning")) {
          newSummary.warningCount = Math.max(0, newSummary.warningCount - 1);
          newSummary.successCount += 1;
        }
        
        // Update overall status if needed
        if (newSummary.errorCount === 0 && newSummary.warningCount === 0) {
          newSummary.overallStatus = "success";
        } else if (newSummary.errorCount === 0) {
          newSummary.overallStatus = "warning";
        }
        
        setSummary(newSummary);
      }
    }
  };
  
  // Function to convert a status string to the corresponding LogLevel
  const statusToLogLevel = (status: "success" | "warning" | "error"): LogLevel => {
    switch (status) {
      case "success": return "success";
      case "warning": return "warning";
      case "error": return "error";
      default: return "info";
    }
  };
  
  // Function to get recommendations based on the issue
  const getRecommendations = (result: NavigationDiagnosticResult) => {
    const recommendations: string[] = [];
    
    if (result.status === "error") {
      if (result.consoleErrors && result.consoleErrors.length > 0) {
        recommendations.push("Fix the JavaScript errors in the browser console");
      }
      
      if (result.componentStatus && !result.componentStatus.rendered) {
        recommendations.push("Check the component rendering logic and ensure all required props are provided");
      }
      
      if (result.apiStatus && result.apiStatus.some(api => api.status === "error")) {
        recommendations.push("Verify API endpoints are correctly configured and returning valid responses");
      }
      
      // Default recommendation if none of the above apply
      if (recommendations.length === 0) {
        recommendations.push("Check route configuration and component imports");
      }
    } else if (result.status === "warning") {
      if (result.componentStatus && result.componentStatus.loadTime && result.componentStatus.loadTime > 1000) {
        recommendations.push("Optimize component render performance to reduce load time");
      }
      
      if (result.apiStatus && result.apiStatus.some(api => api.status === "warning")) {
        recommendations.push("Some API endpoints are responding slowly or with partial data");
      }
      
      // Default recommendation
      if (recommendations.length === 0) {
        recommendations.push("Review route implementation and optimize where possible");
      }
    }
    
    return recommendations;
  };
  
  // Initial load
  useEffect(() => {
    runDiagnostics();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Navigation Route Diagnostics</span>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </CardTitle>
        <CardDescription>
          Verify all navigation routes are functioning correctly
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Summary Alert */}
        {summary && (
          <Alert 
            className={`mb-4 ${
              summary.overallStatus === 'success' 
                ? 'bg-green-50' 
                : summary.overallStatus === 'warning' 
                  ? 'bg-yellow-50' 
                  : 'bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {summary.overallStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : summary.overallStatus === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <AlertTitle>
                {summary.overallStatus === 'success' 
                  ? 'All navigation routes are healthy' 
                  : summary.overallStatus === 'warning'
                    ? 'Some routes have warnings'
                    : 'Some routes have errors'
                }
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {summary.totalRoutes} routes checked: 
              <span className="text-green-600 font-medium ml-1">{summary.successCount} successful</span>
              {summary.warningCount > 0 && (
                <span className="text-yellow-600 font-medium ml-1">, {summary.warningCount} with warnings</span>
              )}
              {summary.errorCount > 0 && (
                <span className="text-red-600 font-medium ml-1">, {summary.errorCount} with errors</span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Tabs for different views */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">
              Issues
              {summary && (summary.warningCount > 0 || summary.errorCount > 0) && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600">
                  {summary.warningCount + summary.errorCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-4">
              {Object.entries(results).map(([category, items]) => (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium capitalize mb-2 flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-gray-500" />
                      {category.replace(/([A-Z])/g, ' $1').trim()} Navigation
                    </h3>
                    <div className="flex gap-2">
                      <span className="text-green-600 text-sm">
                        {items.filter(i => i.status === 'success').length} OK
                      </span>
                      {items.filter(i => i.status === 'warning').length > 0 && (
                        <span className="text-yellow-600 text-sm">
                          {items.filter(i => i.status === 'warning').length} Warnings
                        </span>
                      )}
                      {items.filter(i => i.status === 'error').length > 0 && (
                        <span className="text-red-600 text-sm">
                          {items.filter(i => i.status === 'error').length} Errors
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2 mb-4">
                    <div className="flex h-full rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ 
                          width: `${(items.filter(i => i.status === 'success').length / items.length) * 100}%` 
                        }}
                      />
                      <div 
                        className="bg-yellow-500 h-full" 
                        style={{ 
                          width: `${(items.filter(i => i.status === 'warning').length / items.length) * 100}%` 
                        }}
                      />
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ 
                          width: `${(items.filter(i => i.status === 'error').length / items.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* List of routes with issues */}
                  {items.filter(item => item.status !== 'success').length > 0 && (
                    <div className="space-y-2 mt-2">
                      {items
                        .filter(item => item.status !== 'success')
                        .map((item, idx) => (
                          <div 
                            key={`${category}-${idx}`} 
                            className="text-sm p-2 rounded-md flex items-start justify-between"
                            style={{
                              backgroundColor: item.status === 'warning' ? 'rgb(254, 252, 232)' : 'rgb(254, 242, 242)'
                            }}
                          >
                            <div>
                              <div className="font-medium flex items-center">
                                {item.status === 'warning' ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                )}
                                {item.route}
                              </div>
                              <p className="text-gray-600 ml-6">{item.message}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDetailedView(item)}
                              className="h-7 gap-1"
                            >
                              Details <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Issues Tab */}
          <TabsContent value="issues">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {Object.entries(results).flatMap(([category, items]) => 
                  items
                    .filter(item => item.status !== 'success')
                    .map((item, idx) => (
                      <Collapsible
                        key={`${category}-${idx}-${item.route}`}
                        open={expandedItems[`${category}-${idx}-${item.route}`]}
                        onOpenChange={() => toggleExpand(`${category}-${idx}-${item.route}`)}
                        className="border rounded-md overflow-hidden"
                      >
                        <div className={`p-4 ${
                          item.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                          <CollapsibleTrigger asChild>
                            <div className="flex items-start justify-between cursor-pointer w-full">
                              <div className="flex items-start">
                                {item.status === 'warning' ? (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {item.route}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {item.message}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {expandedItems[`${category}-${idx}-${item.route}`] ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                        </div>
                        
                        <CollapsibleContent>
                          <div className="p-4 bg-white border-t">
                            <div className="space-y-4">
                              {/* Component Status */}
                              {item.componentStatus && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Component Status</h4>
                                  <div className="bg-gray-50 p-3 rounded text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Rendered:</span>
                                      <span>
                                        {item.componentStatus.rendered ? (
                                          <span className="text-green-600">Yes</span>
                                        ) : (
                                          <span className="text-red-600">No</span>
                                        )}
                                      </span>
                                    </div>
                                    {item.componentStatus.loadTime && (
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Load Time:</span>
                                        <span className={
                                          item.componentStatus.loadTime > 1000 ? 'text-yellow-600' : 'text-green-600'
                                        }>
                                          {item.componentStatus.loadTime}ms
                                        </span>
                                      </div>
                                    )}
                                    {item.componentStatus.errors && item.componentStatus.errors.length > 0 && (
                                      <div>
                                        <span className="font-medium">Errors:</span>
                                        <ul className="list-disc pl-5 mt-1 text-red-600">
                                          {item.componentStatus.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* API Status */}
                              {item.apiStatus && item.apiStatus.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">API Status</h4>
                                  <div className="space-y-2">
                                    {item.apiStatus.map((api, i) => (
                                      <div 
                                        key={i} 
                                        className={`p-3 rounded text-sm ${
                                          api.status === 'success' 
                                            ? 'bg-green-50' 
                                            : api.status === 'warning' 
                                              ? 'bg-yellow-50' 
                                              : 'bg-red-50'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium flex items-center">
                                            {api.status === 'success' ? (
                                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            ) : api.status === 'warning' ? (
                                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                                            ) : (
                                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                            )}
                                            {api.endpoint}
                                          </div>
                                          {api.responseTime && (
                                            <span className={
                                              api.responseTime > 500 ? 'text-yellow-600' : 'text-green-600'
                                            }>
                                              {api.responseTime}ms
                                            </span>
                                          )}
                                        </div>
                                        {api.errorMessage && (
                                          <div className="mt-1 pl-6 text-red-600">
                                            {api.errorMessage}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Console Errors */}
                              {item.consoleErrors && item.consoleErrors.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Console Errors</h4>
                                  <div className="bg-gray-900 text-white p-3 rounded font-mono text-xs overflow-x-auto">
                                    {item.consoleErrors.map((err, i) => (
                                      <div key={i} className="py-1">{err}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Recommended Fix */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Recommendations</h4>
                                <div className="bg-blue-50 p-3 rounded text-sm">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {getRecommendations(item).map((rec, i) => (
                                      <li key={i}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => applyFix(item.route, item.message)}
                                  className="mt-2 w-full flex items-center justify-center gap-2"
                                >
                                  <CheckCheck className="h-4 w-4" />
                                  Apply Fix
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                )}
                
                {Object.values(results).flat().filter(item => item.status !== 'success').length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                    <h3 className="text-xl font-medium">All systems operational</h3>
                    <p className="text-gray-600 mt-1">
                      No issues found with navigation routes
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {Object.entries(results).map(([category, items]) => (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 font-medium flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <div className="divide-y">
                      {items.map((item, idx) => (
                        <div 
                          key={`${category}-${idx}`} 
                          className={`p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer`}
                          onClick={() => toggleExpand(`detail-${category}-${idx}`)}
                        >
                          <div className="flex items-center">
                            {item.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            ) : item.status === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                            )}
                            <div>
                              <div className="font-medium text-sm">{item.route}</div>
                              <div className="text-xs text-gray-600">{item.message}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailedView(item);
                            }}
                            className="h-7 gap-1"
                          >
                            View <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Detailed View Modal */}
        {detailedView && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center">
                    {detailedView.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : detailedView.status === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    {detailedView.route}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDetailedView(null)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <div className="flex items-center">
                      {detailedView.status === 'success' ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          Success
                        </span>
                      ) : detailedView.status === 'warning' ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          Warning
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Error
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                    <p className="text-gray-900">{detailedView.message}</p>
                  </div>
                  
                  {/* Component Status */}
                  {detailedView.componentStatus && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Component Status</h4>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Rendered:</span>
                          <span>
                            {detailedView.componentStatus.rendered ? (
                              <span className="text-green-600">Yes</span>
                            ) : (
                              <span className="text-red-600">No</span>
                            )}
                          </span>
                        </div>
                        {detailedView.componentStatus.loadTime && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Load Time:</span>
                            <span className={
                              detailedView.componentStatus.loadTime > 1000 ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {detailedView.componentStatus.loadTime}ms
                            </span>
                          </div>
                        )}
                        {detailedView.componentStatus.errors && detailedView.componentStatus.errors.length > 0 && (
                          <div>
                            <span className="font-medium">Errors:</span>
                            <ul className="list-disc pl-5 mt-1 text-red-600">
                              {detailedView.componentStatus.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* API Status */}
                  {detailedView.apiStatus && detailedView.apiStatus.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">API Status</h4>
                      <div className="space-y-2">
                        {detailedView.apiStatus.map((api, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded ${
                              api.status === 'success' 
                                ? 'bg-green-50' 
                                : api.status === 'warning' 
                                  ? 'bg-yellow-50' 
                                  : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium flex items-center">
                                {api.status === 'success' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                ) : api.status === 'warning' ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                )}
                                {api.endpoint}
                              </div>
                              {api.responseTime && (
                                <span className={
                                  api.responseTime > 500 ? 'text-yellow-600' : 'text-green-600'
                                }>
                                  {api.responseTime}ms
                                </span>
                              )}
                            </div>
                            {api.errorMessage && (
                              <div className="mt-1 pl-6 text-red-600">
                                {api.errorMessage}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Console Errors */}
                  {detailedView.consoleErrors && detailedView.consoleErrors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Console Errors</h4>
                      <div className="bg-gray-900 text-white p-3 rounded font-mono text-xs overflow-x-auto">
                        {detailedView.consoleErrors.map((err, i) => (
                          <div key={i} className="py-1">{err}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recommendations */}
                  {detailedView.status !== 'success' && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Recommendations</h4>
                      <div className="bg-blue-50 p-3 rounded">
                        <ul className="list-disc pl-5 space-y-1">
                          {getRecommendations(detailedView).map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      {detailedView.status !== 'success' && (
                        <Button 
                          onClick={() => {
                            applyFix(detailedView.route, detailedView.message);
                            setDetailedView(null);
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2"
                        >
                          <CheckCheck className="h-4 w-4" />
                          Apply Fix
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationDiagnosticModule;
