import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  Database,
  Globe,
  Settings,
  Zap
} from 'lucide-react';
import { checkPublicRoutes, checkDemoData, checkAnalyticsSetup, checkEnvironmentConfig } from '@/utils/nil/routeChecker';
import { validateNil, validateConfigs, validateFamilyTools } from '@/utils/nil/validateNil';
import { runDevSeed, seedAllDemoData } from '@/utils/nil/devSeeder';
import { seedNilProofs } from '@/tools/seedNilProofs';
import { useToast } from '@/hooks/use-toast';

interface CheckResult {
  component: string;
  ok: boolean;
  message: string;
  status?: number;
}

export default function NilReadyCheckPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    routes: CheckResult[];
    demos: CheckResult[];
    analytics: CheckResult[];
    environment: CheckResult[];
    validation: CheckResult[];
  } | null>(null);
  const { toast } = useToast();

  const nilPublicRoutes = [
    '/nil',
    '/nil/index',
    '/nil/a/demo-athlete'
  ];

  const runReadyCheck = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      // Run all checks in parallel
      const [routeResults, demoResults, analyticsResults, envResults] = await Promise.all([
        checkPublicRoutes(nilPublicRoutes),
        checkDemoData(),
        checkAnalyticsSetup(),
        Promise.resolve(checkEnvironmentConfig())
      ]);

      // Run validation checks
      const nilValidation = validateNil();
      const configValidation = validateConfigs();
      const familyValidation = validateFamilyTools();

      // Combine validation results
      const validationResults: CheckResult[] = [
        {
          component: 'NIL Configuration',
          ok: nilValidation.errors.length === 0,
          message: nilValidation.errors.length > 0 ? 
            nilValidation.errors.join('; ') : 
            `${nilValidation.warnings.length} warnings`
        },
        {
          component: 'Config Files',
          ok: configValidation.errors.length === 0,
          message: configValidation.errors.length > 0 ? 
            configValidation.errors.join('; ') : 
            'All configs valid'
        },
        {
          component: 'Family Tools',
          ok: familyValidation.errors.length === 0,
          message: familyValidation.errors.length > 0 ? 
            familyValidation.errors.join('; ') : 
            'Family tools configured'
        }
      ];

      // Transform route results to match CheckResult interface
      const transformedRouteResults = routeResults.map(r => ({
        component: r.path,
        ok: r.ok,
        message: r.ok ? `Status ${r.status}` : 'Failed to load',
        status: r.status
      }));

      setResults({
        routes: transformedRouteResults,
        demos: demoResults,
        analytics: analyticsResults,
        environment: envResults,
        validation: validationResults
      });

      toast({
        title: "Ready Check Complete",
        description: "All systems checked. Review results below.",
      });
    } catch (error) {
      toast({
        title: "Ready Check Failed",
        description: "An error occurred during the check process.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const seedDemoData = async () => {
    try {
      const results = await seedAllDemoData();
      const successCount = Object.values(results).filter(r => r === 'ok').length;
      toast({
        title: "Demo Data Seeded",
        description: `Successfully seeded ${successCount} proof categories.`,
      });
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: "Failed to create demo proof slips.",
        variant: "destructive",
      });
    }
  };

  const seedNilOnly = () => {
    try {
      seedNilProofs();
      toast({
        title: "NIL Proofs Seeded",
        description: "NIL proof slips have been created for testing.",
      });
    } catch (error) {
      toast({
        title: "NIL Seeding Failed",
        description: "Failed to create NIL proof slips.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (ok: boolean) => {
    if (ok) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getOverallStatus = () => {
    if (!results) return { status: 'pending', message: 'Not checked' };
    
    const allResults = [
      ...results.routes,
      ...results.demos,
      ...results.analytics,
      ...results.environment,
      ...results.validation
    ];
    
    const allOk = allResults.every(r => r.ok);
    const hasWarnings = allResults.some(r => !r.ok);
    
    if (allOk) return { status: 'success', message: 'All systems ready' };
    if (hasWarnings) return { status: 'warning', message: 'Issues detected' };
    return { status: 'error', message: 'Critical issues' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NIL Ready Check & Seeder</h1>
          <p className="text-muted-foreground">
            Validate configuration, routes, and seed demo data before publishing
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runReadyCheck} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running Check...' : 'Run Ready Check'}
          </Button>
          <Button 
            onClick={seedNilOnly}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Seed NIL Only
          </Button>
          <Button 
            onClick={seedDemoData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Seed All Demo Data
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Overall Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {overallStatus.status === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
            {overallStatus.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
            {overallStatus.status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            <span className="font-semibold">{overallStatus.message}</span>
            <Badge 
              variant={overallStatus.status === 'success' ? 'default' : 'destructive'}
              className="ml-auto"
            >
              {overallStatus.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Public Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Public Routes
              </CardTitle>
              <CardDescription>
                Checking NIL public pages availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.routes.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.ok)}
                    <code className="text-sm">{result.component}</code>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Demo Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Demo Configuration
              </CardTitle>
              <CardDescription>
                Checking demo data and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.demos.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.ok)}
                    <span className="text-sm">{result.component}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Checking analytics configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.analytics.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.ok)}
                    <span className="text-sm">{result.component}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Environment
              </CardTitle>
              <CardDescription>
                Current environment configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.environment.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.ok)}
                    <span className="text-sm">{result.component}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Configuration Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration Validation
              </CardTitle>
              <CardDescription>
                Validating NIL and system configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.validation.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.ok)}
                    <span className="text-sm">{result.component}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pre-Publish Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Publish Checklist</CardTitle>
          <CardDescription>
            Manual verification steps before publishing NIL platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="routes" />
              <label htmlFor="routes" className="text-sm">✅ All public routes load successfully</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="tabs" />
              <label htmlFor="tabs" className="text-sm">✅ Dashboard tabs work and modals close (ESC + focus trap)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="proofs" />
              <label htmlFor="proofs" className="text-sm">✅ Proof slips visible for seed actions</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="lighthouse" />
              <label htmlFor="lighthouse" className="text-sm">✅ Lighthouse A11y ≥95, Performance ≥85</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="analytics" />
              <label htmlFor="analytics" className="text-sm">✅ Analytics events tracking (nil.*, share.*)</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}