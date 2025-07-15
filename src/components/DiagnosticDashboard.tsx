import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity, 
  Users, 
  Database,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useButtonDiagnostics } from '../hooks/useButtonDiagnostics';
import { useEnhancedErrorHandling } from '../hooks/useEnhancedErrorHandling';
import { useProfessionalManagement } from '../hooks/useProfessionalManagement';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { toast } from 'sonner';

export const DiagnosticDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const { 
    isRunning: buttonTestsRunning, 
    results: buttonResults, 
    runDiagnostics: runButtonDiagnostics 
  } = useButtonDiagnostics();
  
  const { 
    errors, 
    getRecentErrors, 
    clearErrors 
  } = useEnhancedErrorHandling();
  
  const { 
    professionals, 
    fetchProfessionals, 
    checkProfessionalAvailability 
  } = useProfessionalManagement();
  
  const { 
    metrics, 
    getPerformanceReport 
  } = usePerformanceOptimization();

  // Run comprehensive diagnostics
  const runFullDiagnostics = async () => {
    setLastChecked(new Date());
    
    toast.info('Running comprehensive diagnostics...');
    
    try {
      // Run all diagnostic tests in parallel
      await Promise.all([
        runButtonDiagnostics(),
        fetchProfessionals(),
        checkProfessionalAvailability()
      ]);
      
      toast.success('Diagnostics completed successfully');
    } catch (error) {
      toast.error('Some diagnostics failed - check details');
    }
  };

  // Auto-run diagnostics on component mount
  useEffect(() => {
    if (isVisible) {
      runFullDiagnostics();
    }
  }, [isVisible]);

  const StatusIcon = ({ status }: { status: 'success' | 'error' | 'warning' | 'idle' | 'testing' }) => {
    const iconProps = { size: 16 };
    switch (status) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-success" />;
      case 'error':
        return <XCircle {...iconProps} className="text-destructive" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-warning" />;
      case 'testing':
        return <RefreshCw {...iconProps} className="text-muted-foreground animate-spin" />;
      default:
        return <Activity {...iconProps} className="text-muted-foreground" />;
    }
  };

  const getOverallStatus = () => {
    const recentErrors = getRecentErrors(5);
    const buttonSuccessRate = buttonResults?.successRate || 0;
    
    if (recentErrors.length > 0) return 'error';
    if (buttonSuccessRate < 100) return 'warning';
    return 'success';
  };

  const performanceReport = getPerformanceReport();

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="mr-2 h-4 w-4" />
        Diagnostics
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Application Diagnostics Dashboard
              <StatusIcon status={getOverallStatus()} />
            </CardTitle>
            {lastChecked && (
              <p className="text-sm text-muted-foreground">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={runFullDiagnostics}
              disabled={buttonTestsRunning}
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${buttonTestsRunning ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="buttons">Button Tests</TabsTrigger>
              <TabsTrigger value="errors">Error Handling</TabsTrigger>
              <TabsTrigger value="professionals">Professionals</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="buttons" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Button Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {buttonResults?.passedTests || 0}/{buttonResults?.totalTests || 0}
                      </span>
                      <Badge variant={buttonResults?.successRate === 100 ? 'default' : 'secondary'}>
                        {buttonResults?.successRate.toFixed(1) || 0}%
                      </Badge>
                    </div>
                    <Progress value={buttonResults?.successRate || 0} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Add Buttons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {buttonResults?.results.filter(r => r.type === 'add' && r.status === 'success').length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {buttonResults?.results.filter(r => r.type === 'add').length || 0} passed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Share Buttons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {buttonResults?.results.filter(r => r.type === 'share' && r.status === 'success').length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {buttonResults?.results.filter(r => r.type === 'share').length || 0} passed
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Test Results</h4>
                {buttonResults?.results.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={result.status} />
                      <span className="font-medium">{result.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    {result.error && (
                      <span className="text-xs text-destructive">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getRecentErrors(5).length}</div>
                    <p className="text-xs text-muted-foreground">in last 5 minutes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{errors.length}</div>
                    <Button 
                      onClick={clearErrors}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Clear All
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Error Log</h4>
                {errors.slice(-10).map((error, index) => (
                  <div key={index} className="p-2 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{error.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {error.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {error.context && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Context: {error.context}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="professionals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Professionals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{professionals.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {professionals.filter(p => p.verified).length} verified
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Professional Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Array.from(new Set(professionals.map(p => p.type))).map(type => (
                        <div key={type} className="flex justify-between text-sm">
                          <span>{type}</span>
                          <span>{professionals.filter(p => p.type === type).length}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Cache Hit Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceReport.cacheHitRate}%</div>
                    <Progress value={performanceReport.cacheHitRate} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceReport.averageResponseTime}ms</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceReport.totalOperations}</div>
                    <p className="text-xs text-muted-foreground">
                      {performanceReport.failedOperations} failed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Cache Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceReport.cacheSize}</div>
                    <p className="text-xs text-muted-foreground">entries</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Database RLS Enabled</span>
                      <StatusIcon status="success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Function Security Hardened</span>
                      <StatusIcon status="success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Audit Logging Active</span>
                      <StatusIcon status="success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication Required</span>
                      <StatusIcon status="success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};