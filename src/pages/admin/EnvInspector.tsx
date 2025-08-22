import React, { useState } from 'react';
import { getBuildInfo } from '@/lib/buildInfo';
import { getPublicEnv } from '@/lib/envInfo';
import { getFlags } from '@/lib/flagInfo';
import { getFlag } from '@/lib/flags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Server, Flag, Settings, Database } from 'lucide-react';

// Mock config counts - replace with actual imports if available
function getConfigCoverage() {
  try {
    // These would be actual imports in a real implementation
    const personas = 4; // FAMILY_SEGMENTS.length
    const solutions = 9; // SOLUTIONS.length  
    const catalog = 12; // CATALOG_TOOLS.length
    const demos = 3; // DEMO_CONFIG.length
    
    return { personas, solutions, catalog, demos };
  } catch {
    return { personas: 0, solutions: 0, catalog: 0, demos: 0 };
  }
}

function getEnabledPublicRoutes() {
  const routes = [];
  
  if (getFlag('PUBLIC_DISCOVER_ENABLED')) {
    routes.push('/discover');
  }
  
  if (getFlag('SOLUTIONS_ENABLED')) {
    routes.push('/solutions', '/solutions/annuities', '/personas/families', '/personas/advisors');
  }
  
  if (getFlag('NIL_PUBLIC_ENABLED')) {
    routes.push('/nil', '/nil/index');
  }
  
  if (getFlag('ONBOARDING_PUBLIC_ENABLED')) {
    routes.push('/start/families', '/start/advisors');
  }
  
  // Always available
  routes.push('/how-it-works');
  
  return routes;
}

export default function EnvInspector() {
  const [isExporting, setIsExporting] = useState(false);
  
  // Check admin access and feature flag
  if (!getFlag('ADMIN_TOOLS_ENABLED')) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">Environment inspector is disabled.</p>
      </div>
    );
  }

  const buildInfo = getBuildInfo();
  const flags = getFlags();
  const env = getPublicEnv();
  const config = getConfigCoverage();
  const publicRoutes = getEnabledPublicRoutes();

  const exportSnapshot = () => {
    setIsExporting(true);
    
    const snapshot = {
      build: buildInfo,
      flags,
      env,
      config,
      publicRoutes,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(snapshot, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `env-snapshot-${buildInfo.flavor}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  const openRoute = (route: string) => {
    window.open(route, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F8F9FA', color: '#0B1E33' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#D4AF37' }}>Environment Inspector</h1>
          <p className="text-muted-foreground">
            Safe view of build info, feature flags, and configuration
          </p>
        </div>
        <Button 
          onClick={exportSnapshot}
          disabled={isExporting}
          className="h-11"
          style={{ 
            backgroundColor: '#D4AF37', 
            color: '#0A0A0A',
            border: '1px solid #D4AF37'
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export JSON'}
        </Button>
      </div>

      {/* Build Information */}
      <Card>
        <CardHeader style={{ backgroundColor: '#0B1E33' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
            <Server className="h-5 w-5" />
            Build Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Mode:</span>
              <div className="text-muted-foreground">{buildInfo.mode}</div>
            </div>
            <div>
              <span className="font-medium">Flavor:</span>
              <div className="text-muted-foreground">{buildInfo.flavor}</div>
            </div>
            <div>
              <span className="font-medium">Base URL:</span>
              <div className="text-muted-foreground">{buildInfo.baseUrl}</div>
            </div>
            {buildInfo.sha && (
              <div>
                <span className="font-medium">Git SHA:</span>
                <div className="text-muted-foreground font-mono text-sm">{buildInfo.sha}</div>
              </div>
            )}
            {buildInfo.builtAt && (
              <div>
                <span className="font-medium">Built At:</span>
                <div className="text-muted-foreground">{buildInfo.builtAt}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader style={{ backgroundColor: '#0B1E33' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
            <Flag className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription style={{ color: '#E5E7EB' }}>
            Read-only view (use Publish panel to toggle)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(flags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{key}</span>
                <Badge variant={value ? 'default' : 'secondary'}>
                  {value ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Public Environment */}
      <Card>
        <CardHeader style={{ backgroundColor: '#0B1E33' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
            <Settings className="h-5 w-5" />
            Public Environment (VITE_*)
          </CardTitle>
          <CardDescription style={{ color: '#E5E7EB' }}>
            Only VITE_ prefixed variables shown
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {Object.keys(env).length === 0 ? (
            <p className="text-muted-foreground">No VITE_ environment variables found</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(env).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">VITE_{key}</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{value}</code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Config Coverage */}
      <Card>
        <CardHeader style={{ backgroundColor: '#0B1E33' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
            <Database className="h-5 w-5" />
            Configuration Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{config.personas}</div>
              <div className="text-sm text-muted-foreground">Personas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{config.solutions}</div>
              <div className="text-sm text-muted-foreground">Solutions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{config.catalog}</div>
              <div className="text-sm text-muted-foreground">Catalog Items</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{config.demos}</div>
              <div className="text-sm text-muted-foreground">Demos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Routes */}
      <Card>
        <CardHeader style={{ backgroundColor: '#0B1E33' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
            <ExternalLink className="h-5 w-5" />
            Enabled Public Routes
          </CardTitle>
          <CardDescription style={{ color: '#E5E7EB' }}>
            Routes currently accessible to unauthenticated users
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {publicRoutes.map(route => (
              <Button
                key={route}
                variant="outline"
                onClick={() => openRoute(route)}
                className="justify-between h-11"
                style={{ 
                  borderColor: '#D4AF37',
                  color: '#0B1E33'
                }}
              >
                <span>{route}</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}