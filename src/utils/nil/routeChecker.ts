// Lightweight route availability check (marketing routes only)
// Works in browser by fetch; use HEAD where possible
export async function checkPublicRoutes(paths: string[]): Promise<{ path: string; ok: boolean; status?: number }[]> {
  const base = window.location.origin;
  const results = await Promise.all(paths.map(async (p) => {
    try {
      const res = await fetch(`${base}${p}`, { method: 'GET', cache: 'no-store' });
      return { path: p, ok: res.ok, status: res.status };
    } catch {
      return { path: p, ok: false, status: undefined };
    }
  }));
  return results;
}

export async function checkDemoData(): Promise<{ component: string; ok: boolean; message: string }[]> {
  const results = [];
  
  // Check if demo config exists
  try {
    const demoConfig = await import('@/config/demoConfig.json');
    const hasNilDemo = demoConfig.default.some((demo: any) => demo.id.includes('nil'));
    results.push({
      component: 'Demo Config',
      ok: hasNilDemo,
      message: hasNilDemo ? 'NIL demos configured' : 'No NIL demos found'
    });
  } catch {
    results.push({
      component: 'Demo Config',
      ok: false,
      message: 'Demo config file not found'
    });
  }
  
  return results;
}

export async function checkAnalyticsSetup(): Promise<{ component: string; ok: boolean; message: string }[]> {
  const results = [];
  
  // Check if analytics is available
  const hasAnalytics = typeof window !== 'undefined' && (window as any).analytics;
  results.push({
    component: 'Analytics',
    ok: hasAnalytics,
    message: hasAnalytics ? 'Analytics tracking available' : 'Analytics not configured'
  });
  
  return results;
}

export function checkEnvironmentConfig(): { component: string; ok: boolean; message: string }[] {
  const results = [];
  
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;
  results.push({
    component: 'Environment',
    ok: true,
    message: isDev ? 'Development mode' : 'Production mode'
  });
  
  return results;
}