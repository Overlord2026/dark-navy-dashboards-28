import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { validateConfigs } from '@/tools/validateConfigs';
import { validateFamilyTools } from '@/tools/validateFamilyToolsWrapper';
import { checkPublicRoutes } from '@/tools/checkPublicRoutes';
import { runDevSeed } from '@/tools/devSeed';
import { auditAllLinks, getMissingRoutes, getToolsNeedingStatusUpdate } from '@/tools/auditLinks';
import { routeExists } from '@/tools/routeMap';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import familyToolsConfig from '@/config/familyTools.json';
import { getWorkspaceTools, installTool } from '@/lib/workspaceTools';
import { useToast } from '@/hooks/use-toast';

const PUBLIC_ROUTES = [
  '/discover',
  '/solutions',
  '/solutions/annuities',
  '/solutions/investments', 
  '/nil',
  '/nil/index',
  '/start/brand',
  '/brand/home',
  '/demos/nil-athlete',
  '/demos/nil-school',
  '/demos/nil-brand',
  '/personas/families',
  '/personas/advisors',
  '/personas/insurance',
  '/personas/healthcare',
  '/personas/nil-athlete',
  '/personas/nil-school'
];

type Result = { label:string; status:'ok'|'warn'|'fail'; notes?:string[]; details?:any }

interface RouteAuditResult {
  broken: any[];
  previews: any[];
  familyToolsCoverage: {
    total: number;
    covered: number;
    missing: any[];
  };
}

export default function ReadyCheck() {
  const { toast } = useToast();
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<Result[]>([]);
  const [routes, setRoutes] = React.useState<{path:string; ok:boolean; status?:number}[]>([]);
  const [seedMsg, setSeedMsg] = React.useState<string>('');
  const [missingRoutes, setMissingRoutes] = React.useState<ReturnType<typeof getMissingRoutes>>([]);
  const [routeAudit, setRouteAudit] = React.useState<RouteAuditResult | null>(null);
  const [fixingPreviews, setFixingPreviews] = React.useState(false);
  const [installingTools, setInstallingTools] = React.useState(false);

  // Enhanced route audit function
  const performRouteAudit = () => {
    const allLinks = auditAllLinks();
    const missing = getMissingRoutes();
    
    // Check family tools coverage
    const familyToolsLinks: any[] = [];
    Object.entries(familyToolsConfig).forEach(([segment, config]) => {
      (config as any).tabs?.forEach((tab: any) => {
        tab.cards?.forEach((card: any) => {
          if (card.toolKey) {
            const catalogItem = CATALOG_TOOLS.find(item => item.key === card.toolKey);
            if (catalogItem) {
              familyToolsLinks.push({
                toolKey: card.toolKey,
                route: catalogItem.route,
                segment,
                tab: tab.key,
                exists: routeExists(catalogItem.route)
              });
            }
          }
        });
      });
      
      (config as any).quickActions?.forEach((action: any) => {
        if (action.route) {
          familyToolsLinks.push({
            route: action.route,
            segment,
            type: 'quickAction',
            exists: routeExists(action.route)
          });
        }
      });
    });

    // NIL tools removed - skip coverage check
    const nilToolsLinks: any[] = [];

    return {
      broken: allLinks.filter(link => !link.exists && !missing.some(m => m.route === link.route)),
      previews: missing,
      familyToolsCoverage: {
        total: familyToolsLinks.length,
        covered: familyToolsLinks.filter(link => link.exists).length,
        missing: familyToolsLinks.filter(link => !link.exists)
      }
    };
  };

  async function runAll() {
    setRunning(true);
    const res: Result[] = [];

    // 1) Config validation
    const cfg = validateConfigs();
    const cfgStatus = cfg.issues.some(i => i.level === 'error') ? 'fail'
                      : cfg.issues.length ? 'warn' : 'ok';
    res.push({ label:'Configs (catalog + demos)', status: cfgStatus,
               notes: cfg.issues.map(i=> `${i.level.toUpperCase()} ${i.where}: ${i.message}`) });

    // 2) Family tools linkage
    const fam = validateFamilyTools?.();
    if (fam) {
      const famStatus = fam.errors?.length ? 'fail' : fam.warnings?.length ? 'warn' : 'ok';
      res.push({ label:'Family tools config', status: famStatus,
                 notes: [...(fam.errors||[]), ...(fam.warnings||[])] });
    }

    // 3) NIL tools removed - skip validation

    // 4) Public routes reachable
    const rt = await checkPublicRoutes(PUBLIC_ROUTES);
    setRoutes(rt);
    const bad = rt.filter(r => !r.ok);
    res.push({ label:'Public routes', status: bad.length ? 'warn' : 'ok',
               notes: bad.map(b=> `${b.path} -> ${b.status||'ERR'}`) });

    // 5) Enhanced route audit
    const audit = performRouteAudit();
    setRouteAudit(audit);
    setMissingRoutes(audit.previews);

    // Broken routes (should be 0 after F-ROUTES)
    res.push({
      label: 'Broken routes (hard 404s)',
      status: audit.broken.length > 0 ? 'fail' : 'ok',
      notes: audit.broken.length > 0 ? 
        [`${audit.broken.length} broken routes found`, ...audit.broken.slice(0, 5).map(b => `${b.route} (${b.source})`)] :
        ['No broken routes - all links work'],
      details: audit.broken
    });

    // Preview mappings - show count from auditLinks
    const previewMappedCount = audit.previews.length;
    res.push({
      label: `Preview-mapped routes (${previewMappedCount} found)`,
      status: previewMappedCount > 0 ? 'warn' : 'ok',
      notes: previewMappedCount > 0 ? 
        [`${previewMappedCount} routes mapped to previews`, ...audit.previews.slice(0, 5).map(p => `${p.route} → /preview/${p.toolKey || 'unknown'}`)] :
        ['All routes have implementations'],
      details: audit.previews
    });

    // Family tools coverage - OK if all toolKeys resolve to private route or preview
    const familyCoveragePercent = Math.round((audit.familyToolsCoverage.covered / audit.familyToolsCoverage.total) * 100);
    const familyMissingButPreviewable = audit.familyToolsCoverage.missing.filter(m => 
      audit.previews.some(p => p.toolKey === m.toolKey)
    );
    const familyActuallyMissing = audit.familyToolsCoverage.missing.filter(m => 
      !audit.previews.some(p => p.toolKey === m.toolKey)
    );
    
    res.push({
      label: 'Family tools coverage',
      status: familyActuallyMissing.length > 0 ? 'warn' : 'ok',
      notes: [
        `${audit.familyToolsCoverage.covered}/${audit.familyToolsCoverage.total} tools have routes (${familyCoveragePercent}%)`,
        `${familyMissingButPreviewable.length} missing tools have preview fallbacks`,
        `${familyActuallyMissing.length} tools completely unreachable`,
        ...familyActuallyMissing.slice(0, 3).map(m => `Missing: ${m.route} (${m.segment}/${m.tab || m.type})`)
      ],
      details: { 
        ...audit.familyToolsCoverage, 
        previewFallbacks: familyMissingButPreviewable.length,
        actuallyMissing: familyActuallyMissing.length 
      }
    });

    // NIL tools coverage - removed
    res.push({
      label: 'NIL tools coverage',
      status: 'ok',
      notes: ['NIL functionality removed from platform']
    });

    // Workspace tools status
    const workspace = getWorkspaceTools();
    res.push({
      label: 'Installed tools (this workspace)',
      status: 'ok',
      notes: [
        `${workspace.installed.length} tools installed`,
        `Persona: ${workspace.persona || 'not set'}`,
        `Segment: ${workspace.segment || 'not set'}`,
        ...workspace.installed.slice(0, 5).map(tool => `✓ ${tool}`)
      ],
      details: workspace
    });

    setResults(res);
    setRunning(false);
  }

  async function seed(kind:'nil'|'family') {
    const out = await runDevSeed(kind);
    setSeedMsg(out === 'ok' ? 'Seeded demo receipts.' : out === 'noop' ? 'Seed skipped in prod.' : 'Seed failed.');
    setTimeout(()=>setSeedMsg(''), 3000);
  }

  const regeneratePreviews = async () => {
    setFixingPreviews(true);
    try {
      // Re-run the route audit to catch any new missing routes
      const audit = performRouteAudit();
      setRouteAudit(audit);
      setMissingRoutes(audit.previews);
      
      toast({
        title: "Previews regenerated",
        description: `Found ${audit.previews.length} routes mapped to previews`,
      });
    } catch (error) {
      toast({
        title: "Error regenerating previews",
        description: "Failed to regenerate preview mappings",
        variant: "destructive"
      });
    }
    setFixingPreviews(false);
  };

  const installAllRecommended = async () => {
    setInstallingTools(true);
    try {
      // Default recommended tools for demo workspace
      const recommendedTools = [
        'retirement-roadmap',
        'wealth-vault', 
        'longevity-hub',
        'taxhub-diy',
        'annuities-review'
      ];
      
      let installed = 0;
      for (const toolKey of recommendedTools) {
        try {
          await installTool(toolKey, true); // Install with seed data
          installed++;
        } catch (error) {
          console.warn(`Failed to install ${toolKey}:`, error);
        }
      }
      
      toast({
        title: "Tools installed",
        description: `Installed ${installed} of ${recommendedTools.length} recommended tools`,
      });
      
      // Re-run checks to update workspace tools status
      runAll();
    } catch (error) {
      toast({
        title: "Installation failed",
        description: "Failed to install recommended tools",
        variant: "destructive"
      });
    }
    setInstallingTools(false);
  };

  const exportCSV = () => {
    if (!routeAudit) return;
    
    const csvData = [
      ['Type', 'Route', 'Status', 'Source', 'Tool Key', 'Notes'],
      ...routeAudit.broken.map(item => ['Broken', item.route, 'FAIL', item.source, item.toolKey || '', 'Hard 404']),
      ...routeAudit.previews.map(item => ['Preview', item.route, 'WARN', item.source, item.toolKey || '', 'Mapped to preview']),
      ...routeAudit.familyToolsCoverage.missing.map(item => ['Family Tool', item.route, 'WARN', `${item.segment}/${item.tab || item.type}`, item.toolKey || '', 'Missing from family tools'])
    ];
    
    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ready-check-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV exported",
      description: "Ready check results exported to CSV",
    });
  };

  const getStatusIcon = (status: Result['status']) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warn': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const statusColor: Record<Result['status'], string> = {
    ok:   '#10B981', // mint
    warn: '#F59E0B',
    fail: '#DC2626'
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ready-Check</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive config & route validation, preview management, and export tools.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {routeAudit && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportCSV}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={regeneratePreviews}
                disabled={fixingPreviews}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${fixingPreviews ? 'animate-spin' : ''}`} />
                Regenerate Previews
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Run checks and seed development data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              disabled={running} 
              onClick={runAll}
              size="lg"
              className="flex items-center gap-2"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running…
                </>
              ) : (
                'Run All Checks'
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => seed('nil')}
              className="flex items-center gap-2"
            >
              Seed NIL (dev)
            </Button>
            <Button 
              variant="outline"
              onClick={() => seed('family')}
              className="flex items-center gap-2"
            >
              Seed Family (dev)
            </Button>
            <Button 
              variant="outline"
              onClick={installAllRecommended}
              disabled={installingTools}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${installingTools ? 'animate-spin' : ''}`} />
              Install All Recommended
            </Button>
            {seedMsg && (
              <Alert className="flex-1 max-w-sm">
                <AlertDescription>{seedMsg}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((r, i) => (
            <Card key={i} className={`border-l-4`} style={{borderLeftColor: statusColor[r.status]}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(r.status)}
                    {r.label}
                  </CardTitle>
                  <Badge 
                    variant={r.status === 'ok' ? 'default' : r.status === 'warn' ? 'secondary' : 'destructive'}
                  >
                    {r.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              {r.notes && r.notes.length > 0 && (
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {r.notes.slice(0, 10).map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                    {r.notes.length > 10 && (
                      <li className="text-muted-foreground italic">
                        …{r.notes.length - 10} more items
                      </li>
                    )}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Route Information */}
      {routes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Public Routes Status</CardTitle>
            <CardDescription>Accessibility check for public routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {routes.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {r.ok ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <a 
                      href={r.path} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono text-sm hover:underline"
                    >
                      {r.path}
                    </a>
                  </div>
                  {typeof r.status !== 'undefined' && (
                    <Badge variant="outline" className="font-mono">
                      {r.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Mappings Detail */}
      {missingRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Preview-Mapped Routes ({missingRoutes.length})
            </CardTitle>
            <CardDescription>
              Routes that are mapped to preview pages instead of real implementations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {missingRoutes.map((miss, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <a 
                      href={miss.route} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono text-sm hover:underline"
                    >
                      {miss.route}
                    </a>
                    {miss.toolKey && (
                      <Badge variant="outline" className="text-xs">
                        → /preview/{miss.toolKey}
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {miss.source}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Footer */}
      <Alert>
        <CheckCircle className="w-4 h-4" />
        <AlertDescription>
          <strong>Tip:</strong> After publishing, run this again in production with feature flags enabled. 
          Aim for all checks showing "OK" status. Preview mappings are acceptable as warnings.
        </AlertDescription>
      </Alert>
    </div>
  );
}