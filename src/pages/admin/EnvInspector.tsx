import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { getFlag, FLAG_DESCRIPTIONS, getBuildInfo } from '@/config/flags';
import { getPublicEnv } from '@/lib/envInfo';
import { getFlags } from '@/lib/flagInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Monitor } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Import configs for coverage analysis
import personaConfig from '@/config/personaConfig.json';
import catalogConfig from '@/config/catalogConfig.json';
import demoConfig from '@/config/demoConfig.json';

export function EnvInspector() {
  const { userProfile } = useUser();
  const [isExporting, setIsExporting] = useState(false);

  // Check access permissions
  if (!userProfile || userProfile.role !== 'admin') {
    return <Navigate to="/client-dashboard" replace />;
  }

  if (!getFlag('ADMIN_TOOLS_ENABLED')) {
    return <Navigate to="/admin" replace />;
  }

  const buildInfo = getBuildInfo();
  const publicEnv = getPublicEnv();
  const flags = getFlags();

  // Solutions nav data (extracted from utils/configValidator.ts)
  const solutionsNav = [
    { key: 'investments', title: 'Investments' },
    { key: 'annuities', title: 'Annuities' },
    { key: 'insurance', title: 'Insurance' },
    { key: 'tax', title: 'Tax Planning' },
    { key: 'estate', title: 'Estate' },
    { key: 'health', title: 'Health & Longevity' },
    { key: 'practice', title: 'Practice Management' },
    { key: 'compliance', title: 'Compliance' },
    { key: 'nil', title: 'NIL' }
  ];

  // Config coverage analysis
  const configCoverage = {
    personas: personaConfig.length,
    solutions: solutionsNav.length,
    catalog: {
      total: catalogConfig.length,
      bySolution: solutionsNav.reduce((acc, solution) => {
        const count = catalogConfig.filter(item => 
          item.solutions?.includes(solution.key)
        ).length;
        return { ...acc, [solution.key]: count };
      }, {} as Record<string, number>)
    },
    demos: demoConfig.length
  };

  // Public routes based on flags
  const publicRoutes = [
    { path: '/discover', enabled: getFlag('PUBLIC_DISCOVER_ENABLED'), label: 'Discovery Page' },
    { path: '/solutions', enabled: getFlag('SOLUTIONS_ENABLED'), label: 'Solutions Hub' },
    { path: '/personas', enabled: getFlag('PUBLIC_CATALOG_ENABLED'), label: 'Personas Catalog' },
    { path: '/catalog', enabled: getFlag('PUBLIC_CATALOG_ENABLED'), label: 'Tool Catalog' },
    { path: '/proof', enabled: getFlag('TRUST_EXPLAINER_ENABLED'), label: 'Proof & Trust' },
    { path: '/how-it-works', enabled: getFlag('TRUST_EXPLAINER_ENABLED'), label: 'How It Works' },
    { path: '/nil', enabled: getFlag('NIL_PUBLIC_ENABLED'), label: 'NIL Landing' },
    { path: '/nil/index', enabled: getFlag('NIL_PUBLIC_ENABLED'), label: 'NIL Index' }
  ];

  const enabledRoutes = publicRoutes.filter(route => route.enabled);

  const exportData = () => {
    setIsExporting(true);
    
    const exportSnapshot = {
      timestamp: new Date().toISOString(),
      build: buildInfo,
      flags,
      env: publicEnv,
      config: {
        personas: configCoverage.personas,
        solutions: configCoverage.solutions,
        catalog: configCoverage.catalog.total,
        demos: configCoverage.demos
      },
      publicRoutes: enabledRoutes.map(r => r.path)
    };

    const blob = new Blob([JSON.stringify(exportSnapshot, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `env-snapshot-${buildInfo.flavor}-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6" style={{ color: '#D4AF37' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
              Environment Inspector
            </h1>
          </div>
          <Button
            onClick={exportData}
            disabled={isExporting}
            className="h-11"
            style={{ 
              backgroundColor: '#D4AF37',
              color: '#0B1E33'
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export JSON'}
          </Button>
        </div>

        {/* Build Information */}
        <Card>
          <CardHeader className="bg-bfo-navy">
            <CardTitle className="text-bfo-gold">Build Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Mode</span>
                <p className="text-lg font-mono">{buildInfo.mode}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Flavor</span>
                <p className="text-lg font-mono">{buildInfo.flavor}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Base URL</span>
                <p className="text-sm font-mono break-all">{buildInfo.baseUrl}</p>
              </div>
              {buildInfo.sha && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Git SHA</span>
                  <p className="text-sm font-mono">{buildInfo.sha}</p>
                </div>
              )}
              {buildInfo.builtAt && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Built At</span>
                  <p className="text-sm font-mono">{buildInfo.builtAt}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader className="bg-bfo-navy">
            <CardTitle className="text-bfo-gold">Feature Flags</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {Object.entries(flags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{key}</code>
                      <Badge variant={value ? "default" : "secondary"}>
                        {value ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {FLAG_DESCRIPTIONS[key as keyof typeof FLAG_DESCRIPTIONS] || 'No description available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Public Environment Variables */}
        <Card>
          <CardHeader className="bg-bfo-navy">
            <CardTitle className="text-bfo-gold">Public Environment (VITE_*)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {Object.keys(publicEnv).length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No VITE_ environment variables found</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(publicEnv).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                    <code className="text-sm font-mono">{key}</code>
                    <code className="text-sm font-mono text-muted-foreground">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Config Coverage */}
        <Card>
          <CardHeader className="bg-bfo-navy">
            <CardTitle className="text-bfo-gold">Configuration Coverage</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold">{configCoverage.personas}</div>
                <div className="text-sm text-muted-foreground">Personas</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold">{configCoverage.solutions}</div>
                <div className="text-sm text-muted-foreground">Solutions</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold">{configCoverage.catalog.total}</div>
                <div className="text-sm text-muted-foreground">Catalog Items</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold">{configCoverage.demos}</div>
                <div className="text-sm text-muted-foreground">Demos</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Catalog by Solution</h4>
              <div className="grid grid-cols-3 gap-2">
                {solutionsNav.map(solution => (
                  <div key={solution.key} className="flex justify-between p-2 text-sm rounded border">
                    <span>{solution.title}</span>
                    <span className="font-mono">{configCoverage.catalog.bySolution[solution.key] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Routes */}
        <Card>
          <CardHeader className="bg-bfo-navy">
            <CardTitle className="text-bfo-gold">Enabled Public Routes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {enabledRoutes.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No public routes currently enabled</p>
            ) : (
              <div className="space-y-2">
                {enabledRoutes.map(route => (
                  <div key={route.path} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <code className="text-sm font-mono">{route.path}</code>
                      <span className="text-sm text-muted-foreground ml-2">— {route.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a 
                        href={route.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}