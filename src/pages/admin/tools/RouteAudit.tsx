import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface RouteStatus {
  path: string;
  status: 'loading' | 'success' | '404' | 'error';
  statusCode?: number;
}

const KNOWN_ROUTES = [
  '/',
  '/pros/advisors',
  '/pros/cpas', 
  '/pros/attorneys',
  '/pros/providers',
  '/personas/family-retiree',
  '/personas/aspiring-retiree',
  '/estate/healthcare-diy-wizard',
  '/estate/estate-diy-wizard',
  '/estate/estate-workbench',
  '/retirement/scorecard',
  '/retirement/planning',
  '/financial/calculator',
  '/financial/portfolio',
  '/calendar',
  '/dashboard',
  '/settings',
  '/admin',
  '/admin/tools',
  '/integration',
  '/integration/projects',
  '/integration/architecture',
  '/integration/api',
  '/integration/plugins'
];

export default function RouteAudit() {
  const [routes, setRoutes] = useState<RouteStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkRoutes = async () => {
    setIsChecking(true);
    const routeStatuses: RouteStatus[] = KNOWN_ROUTES.map(path => ({
      path,
      status: 'loading'
    }));
    
    setRoutes(routeStatuses);

    // Check each route
    for (let i = 0; i < KNOWN_ROUTES.length; i++) {
      const path = KNOWN_ROUTES[i];
      try {
        const response = await fetch(path, { method: 'HEAD' });
        const newStatus: RouteStatus = {
          path,
          status: response.status === 404 ? '404' : 'success',
          statusCode: response.status
        };
        
        setRoutes(prev => prev.map((route, index) => 
          index === i ? newStatus : route
        ));
      } catch (error) {
        const newStatus: RouteStatus = {
          path,
          status: 'error',
          statusCode: 0
        };
        
        setRoutes(prev => prev.map((route, index) => 
          index === i ? newStatus : route
        ));
      }
      
      // Small delay to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsChecking(false);
  };

  const downloadCSV = () => {
    const headers = ['Route', 'Status', 'Status Code', '404?'];
    const rows = routes.map(route => [
      route.path,
      route.status,
      route.statusCode?.toString() || '',
      route.status === '404' ? 'true' : 'false'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Route_Audit.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    checkRoutes();
  }, []);

  const has404s = routes.some(route => route.status === '404');
  const completedRoutes = routes.filter(route => route.status !== 'loading').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Route Audit</h1>
            <p className="text-muted-foreground mt-2">
              Check all application routes for 404 errors before deployment
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={checkRoutes} 
              disabled={isChecking}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Re-check Routes
            </Button>
            <Button 
              onClick={downloadCSV}
              disabled={routes.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Route_Audit.csv
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-card border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {completedRoutes}/{routes.length}
              </div>
              <div className="text-sm text-muted-foreground">Routes Checked</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${has404s ? 'text-destructive' : 'text-green-500'}`}>
                {has404s ? <AlertTriangle className="h-8 w-8 mx-auto" /> : <CheckCircle className="h-8 w-8 mx-auto" />}
              </div>
              <div className="text-sm text-muted-foreground">
                {has404s ? '404 Errors Found' : 'All Routes OK'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {routes.filter(r => r.status === '404').length}
              </div>
              <div className="text-sm text-muted-foreground">404 Count</div>
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <h2 className="text-lg font-semibold">Route Status</h2>
          </div>
          <div className="divide-y">
            {routes.map((route, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {route.path}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  {route.statusCode && (
                    <span className="text-sm text-muted-foreground">
                      {route.statusCode}
                    </span>
                  )}
                  <Badge 
                    variant={
                      route.status === 'loading' ? 'secondary' :
                      route.status === 'success' ? 'success' :
                      route.status === '404' ? 'destructive' : 'warning'
                    }
                  >
                    {route.status === 'loading' && 'Checking...'}
                    {route.status === 'success' && 'OK'}
                    {route.status === '404' && '404 Error'}
                    {route.status === 'error' && 'Error'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {has404s && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Action Required</span>
            </div>
            <p className="text-sm">
              404 errors detected. Fix route stubs before proceeding with Phase 1 visual work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}