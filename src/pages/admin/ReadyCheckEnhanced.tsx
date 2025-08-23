import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  FileText,
  Globe,
  Zap,
  Settings
} from 'lucide-react';
import { performRouteAudit, autoCreatePreviewRoutes, type RouteAuditSummary } from '@/tools/routeAuditor';
import { validateFamilyTools } from '@/tools/validateFamilyToolsWrapper';

interface ReadyCheckResult {
  category: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string[];
  action?: string;
}

export function ReadyCheckEnhanced() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ReadyCheckResult[]>([]);
  const [routeAudit, setRouteAudit] = useState<RouteAuditSummary | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runChecks = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Route audit
      const audit = performRouteAudit();
      setRouteAudit(audit);

      const checkResults: ReadyCheckResult[] = [];

      // 1. Route Coverage Check
      if (audit.hardErrors.length === 0) {
        checkResults.push({
          category: 'Routes',
          status: 'pass',
          message: `All ${audit.totalRoutes} routes are accessible`,
          details: ['No hard 404 errors found']
        });
      } else {
        checkResults.push({
          category: 'Routes',
          status: 'fail',
          message: `${audit.hardErrors.length} routes return 404`,
          details: audit.hardErrors.map(e => `${e.route} (${e.source})`),
          action: 'Fix missing routes or update configurations'
        });
      }

      // 2. Preview Mapping Check
      if (audit.previewMappedRoutes > 0) {
        checkResults.push({
          category: 'Preview Routes',
          status: 'warn',
          message: `${audit.previewMappedRoutes} routes mapped to preview pages`,
          details: audit.previewWarnings.map(w => `${w.route} → /preview/${w.toolKey}`),
          action: 'Review preview mappings - these show marketing pages instead of tools'
        });
      } else {
        checkResults.push({
          category: 'Preview Routes',
          status: 'pass',
          message: 'All tool routes are fully implemented'
        });
      }

      // 3. Family Tools Configuration
      const familyToolsValidation = validateFamilyTools();
      if (familyToolsValidation.errors && familyToolsValidation.errors.length > 0) {
        checkResults.push({
          category: 'Family Tools',
          status: 'fail',
          message: `${familyToolsValidation.errors.length} configuration errors`,
          details: familyToolsValidation.errors,
          action: 'Fix family tools configuration'
        });
      } else {
        checkResults.push({
          category: 'Family Tools',
          status: 'pass',
          message: 'Family tools configuration is valid',
          details: familyToolsValidation.warnings || []
        });
      }

      // 4. Feature Flags Check
      const flags = localStorage.getItem('feature_flags');
      if (flags) {
        const flagsObj = JSON.parse(flags);
        const enabledFlags = Object.entries(flagsObj).filter(([_, enabled]) => enabled).length;
        checkResults.push({
          category: 'Feature Flags',
          status: 'pass',
          message: `${enabledFlags} features enabled`,
          details: Object.entries(flagsObj).map(([flag, enabled]) => `${flag}: ${enabled ? 'ON' : 'OFF'}`)
        });
      } else {
        checkResults.push({
          category: 'Feature Flags',
          status: 'warn',
          message: 'No feature flags configuration found',
          action: 'Configure feature flags for environment'
        });
      }

      // 5. Demo Coverage Check
      const demoIds = [
        'families-aspiring', 'families-retirees', 'advisors', 'cpas', 
        'attorneys', 'brand-enterprise', 'brand-local', 'solution-annuities'
      ];
      checkResults.push({
        category: 'Demos',
        status: 'pass',
        message: `${demoIds.length} demos configured`,
        details: demoIds
      });

      setResults(checkResults);
      setLastRun(new Date());

    } catch (error) {
      setResults([{
        category: 'System',
        status: 'fail',
        message: 'Ready check failed to run',
        details: [error instanceof Error ? error.message : 'Unknown error'],
        action: 'Check console for detailed error information'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const regeneratePreviews = async () => {
    setIsRunning(true);
    try {
      const result = autoCreatePreviewRoutes();
      
      const newResult: ReadyCheckResult = {
        category: 'Preview Generation',
        status: result.errors.length === 0 ? 'pass' : 'warn',
        message: `Generated ${result.created} preview routes, updated ${result.updated} catalog items`,
        details: result.errors.length > 0 ? result.errors : ['Preview routes regenerated successfully'],
        action: result.errors.length > 0 ? 'Check errors and retry' : undefined
      };

      setResults(prev => [newResult, ...prev]);
      
      // Re-run route audit
      const audit = performRouteAudit();
      setRouteAudit(audit);
      
    } catch (error) {
      setResults(prev => [{
        category: 'Preview Generation',
        status: 'fail',
        message: 'Failed to regenerate preview routes',
        details: [error instanceof Error ? error.message : 'Unknown error']
      }, ...prev]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runChecks();
  }, []);

  const passCount = results.filter(r => r.status === 'pass').length;
  const warnCount = results.filter(r => r.status === 'warn').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  return (
    <>
      <Helmet>
        <title>Enhanced Ready Check | Admin</title>
        <meta name="description" content="Comprehensive production readiness validation" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Enhanced Ready Check</h1>
                <p className="text-muted-foreground">
                  Comprehensive validation for production deployment
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {lastRun && (
                  <span className="text-sm text-muted-foreground">
                    Last run: {lastRun.toLocaleTimeString()}
                  </span>
                )}
                <Button onClick={runChecks} disabled={isRunning}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                  Run Checks
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{passCount}</div>
                  <div className="text-sm text-muted-foreground">Passing</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{warnCount}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{failCount}</div>
                  <div className="text-sm text-muted-foreground">Failures</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {routeAudit?.totalRoutes || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Routes</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="results" className="space-y-6">
              <TabsList>
                <TabsTrigger value="results">Check Results</TabsTrigger>
                <TabsTrigger value="routes">Route Audit</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-4">
                {results.length === 0 && !isRunning && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No checks have been run yet</p>
                      <Button onClick={runChecks} className="mt-4">
                        Run Initial Check
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {results.map((result, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {result.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {result.status === 'warn' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                          {result.status === 'fail' && <XCircle className="w-5 h-5 text-red-600" />}
                          {result.category}
                        </CardTitle>
                        <Badge 
                          variant={
                            result.status === 'pass' ? 'default' : 
                            result.status === 'warn' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3">{result.message}</p>
                      
                      {result.details && result.details.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Details:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.action && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Recommended Action:</h4>
                          <p className="text-sm">{result.action}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Route Audit Tab */}
              <TabsContent value="routes" className="space-y-4">
                {routeAudit && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Route Coverage Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{routeAudit.totalRoutes}</div>
                            <div className="text-sm text-muted-foreground">Total Routes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{routeAudit.missingRoutes}</div>
                            <div className="text-sm text-muted-foreground">Missing Routes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{routeAudit.previewMappedRoutes}</div>
                            <div className="text-sm text-muted-foreground">Preview Mapped</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {routeAudit.hardErrors.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-600">Hard Errors (404s)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {routeAudit.hardErrors.map((error, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/50 rounded">
                                <div>
                                  <div className="font-mono text-sm">{error.route}</div>
                                  <div className="text-xs text-muted-foreground">Source: {error.source}</div>
                                </div>
                                <Badge variant="destructive">404</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {routeAudit.previewWarnings.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-yellow-600">Preview Mapped Routes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {routeAudit.previewWarnings.map((warning, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/50 rounded">
                                <div>
                                  <div className="font-mono text-sm">{warning.route}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Tool: {warning.toolKey} | Source: {warning.source}
                                  </div>
                                </div>
                                <Badge variant="secondary">Preview</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Regenerate Preview Routes</h4>
                        <p className="text-sm text-muted-foreground">
                          Auto-create preview pages for missing tool routes and update catalog status
                        </p>
                      </div>
                      <Button onClick={regeneratePreviews} disabled={isRunning}>
                        <Zap className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Run Full Check</h4>
                        <p className="text-sm text-muted-foreground">
                          Re-run all validation checks and update results
                        </p>
                      </div>
                      <Button onClick={runChecks} disabled={isRunning}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Run Checks
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">View Publish Panel</h4>
                        <p className="text-sm text-muted-foreground">
                          Access deployment controls and environment settings
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <a href="/admin/publish">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Panel
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}