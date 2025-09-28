import React, { useState, useEffect } from 'react';

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'checking';
  message: string;
}

export default function Health() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: 'Environment Variables', status: 'checking', message: 'Checking...' },
    { name: 'Component Imports', status: 'checking', message: 'Checking...' },
    { name: 'Page Anchors', status: 'checking', message: 'Checking...' },
  ]);

  useEffect(() => {
    const runHealthChecks = async () => {
      const newChecks: HealthCheck[] = [];

      // Check 1: Environment Variables
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl) {
          newChecks.push({ 
            name: 'Environment Variables', 
            status: 'fail', 
            message: 'VITE_SUPABASE_URL is missing' 
          });
        } else if (!supabaseKey) {
          newChecks.push({ 
            name: 'Environment Variables', 
            status: 'fail', 
            message: 'VITE_SUPABASE_ANON_KEY is missing' 
          });
        } else {
          const maskedKey = supabaseKey.length > 8 
            ? `${supabaseKey.substring(0, 4)}${'*'.repeat(supabaseKey.length - 8)}${supabaseKey.substring(supabaseKey.length - 4)}`
            : supabaseKey;
          newChecks.push({ 
            name: 'Environment Variables', 
            status: 'pass', 
            message: `URL: ${supabaseUrl}, KEY: ${maskedKey}` 
          });
        }
      } catch (error) {
        newChecks.push({ 
          name: 'Environment Variables', 
          status: 'fail', 
          message: `Error checking env vars: ${error}` 
        });
      }

      // Check 2: Component Imports
      try {
        // Test dynamic imports without rendering
        const pricingImport = import('@/components/pricing/PricingTableSite');
        const legacyImport = import('@/pages/admin/LegacyKpisDashboard');
        
        await Promise.all([pricingImport, legacyImport]);
        
        newChecks.push({ 
          name: 'Component Imports', 
          status: 'pass', 
          message: 'PricingTableSite and LegacyKpisDashboard importable' 
        });
      } catch (error) {
        newChecks.push({ 
          name: 'Component Imports', 
          status: 'fail', 
          message: `Import failed: ${error}` 
        });
      }

      // Check 3: Page Anchors 
      try {
        const expectedAnchors = ['#families', '#advisor', '#ria', '#legacy'];
        const foundAnchors: string[] = [];
        
        expectedAnchors.forEach(anchor => {
          const element = document.querySelector(anchor);
          if (element) {
            foundAnchors.push(anchor);
          }
        });

        if (foundAnchors.length === expectedAnchors.length) {
          newChecks.push({ 
            name: 'Page Anchors', 
            status: 'pass', 
            message: `Found all anchors: ${foundAnchors.join(', ')}` 
          });
        } else {
          const missing = expectedAnchors.filter(anchor => !foundAnchors.includes(anchor));
          newChecks.push({ 
            name: 'Page Anchors', 
            status: 'fail', 
            message: `Missing anchors: ${missing.join(', ')} | Found: ${foundAnchors.join(', ')}` 
          });
        }
      } catch (error) {
        newChecks.push({ 
          name: 'Page Anchors', 
          status: 'fail', 
          message: `Error checking anchors: ${error}` 
        });
      }

      setChecks(newChecks);
    };

    runHealthChecks();
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'pass':
        return '✅';
      case 'fail':
        return '❌';
      case 'checking':
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Health Check</h1>
        
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 border rounded-lg bg-card"
            >
              <span className="text-2xl">
                {getStatusIcon(check.status)}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">{check.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {check.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Health Check Details</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Environment Variables: Checks for required Supabase configuration</li>
            <li>• Component Imports: Verifies PricingTableSite and LegacyKpisDashboard can be loaded</li>
            <li>• Page Anchors: Looks for #families, #advisor, #ria, #legacy anchors on current page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}