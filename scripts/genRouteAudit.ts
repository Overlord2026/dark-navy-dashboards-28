import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { glob } from 'glob';

interface RouteInfo {
  path: string;
  title: string;
  owner: string;
  mobile_ok: boolean;
  has_404: boolean;
  file_path: string;
  component_name: string;
  is_lazy: boolean;
  has_auth: boolean;
  description: string;
}

interface RouteAuditResult {
  total_routes: number;
  missing_routes: number;
  routes_with_404: number;
  mobile_friendly: number;
  routes: RouteInfo[];
  missing_stubs: string[];
  stubs_created: string[];
}

/**
 * Generate comprehensive route audit and auto-create missing stubs
 */
export async function generateRouteAudit(): Promise<RouteAuditResult> {
  console.log('🔍 Starting Route Audit...');
  
  const result: RouteAuditResult = {
    total_routes: 0,
    missing_routes: 0,
    routes_with_404: 0,
    mobile_friendly: 0,
    routes: [],
    missing_stubs: [],
    stubs_created: []
  };

  try {
    // 1. Scan App.tsx for route definitions
    const appRoutes = await scanAppRoutes();
    
    // 2. Scan pages directory for component files
    const pageComponents = await scanPageComponents();
    
    // 3. Cross-reference and identify gaps
    const routeAnalysis = await analyzeRoutes(appRoutes, pageComponents);
    
    // 4. Check for 404s and mobile compatibility
    const auditedRoutes = await auditRouteDetails(routeAnalysis);
    
    // 5. Auto-generate missing stubs
    const stubsCreated = await createMissingStubs(auditedRoutes.filter(r => r.has_404));
    
    // 6. Generate CSV report
    await generateRouteAuditCSV(auditedRoutes);
    
    result.routes = auditedRoutes;
    result.total_routes = auditedRoutes.length;
    result.missing_routes = auditedRoutes.filter(r => r.has_404).length;
    result.routes_with_404 = auditedRoutes.filter(r => r.has_404).length;
    result.mobile_friendly = auditedRoutes.filter(r => r.mobile_ok).length;
    result.missing_stubs = auditedRoutes.filter(r => r.has_404).map(r => r.path);
    result.stubs_created = stubsCreated;
    
    console.log(`✅ Route Audit Complete:`);
    console.log(`   📊 Total routes: ${result.total_routes}`);
    console.log(`   ❌ Missing/404s: ${result.missing_routes}`);
    console.log(`   📱 Mobile friendly: ${result.mobile_friendly}`);
    console.log(`   🏗️  Stubs created: ${result.stubs_created.length}`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Route audit failed:', error);
    throw error;
  }
}

/**
 * Scan App.tsx for route definitions
 */
async function scanAppRoutes(): Promise<{ path: string; component: string; file_path?: string }[]> {
  const appPath = join(process.cwd(), 'src', 'App.tsx');
  
  if (!existsSync(appPath)) {
    throw new Error('App.tsx not found');
  }
  
  const appContent = readFileSync(appPath, 'utf-8');
  const routes: { path: string; component: string; file_path?: string }[] = [];
  
  // Extract Route definitions using regex
  const routeRegex = /<Route\s+path="([^"]+)"\s+element={[^}]*<([^>\s]+)[^}]*}/g;
  let match;
  
  while ((match = routeRegex.exec(appContent)) !== null) {
    const [, path, component] = match;
    routes.push({
      path,
      component,
      file_path: undefined // Will be resolved later
    });
  }
  
  // Extract lazy routes
  const lazyRouteRegex = /<Route\s+path="([^"]+)"\s+element={[^}]*<Suspense[^}]*<([^>\s]+)[^}]*}/g;
  while ((match = lazyRouteRegex.exec(appContent)) !== null) {
    const [, path, component] = match;
    routes.push({
      path,
      component,
      file_path: undefined
    });
  }
  
  return routes;
}

/**
 * Scan pages directory for component files
 */
async function scanPageComponents(): Promise<{ name: string; file_path: string }[]> {
  const pagesPath = join(process.cwd(), 'src', 'pages');
  const components: { name: string; file_path: string }[] = [];
  
  try {
    // Find all TypeScript/TSX files in pages directory
    const files = await glob('**/*.{ts,tsx}', { 
      cwd: pagesPath,
      ignore: ['**/*.test.*', '**/*.spec.*', '**/index.ts']
    });
    
    for (const file of files) {
      const fullPath = join(pagesPath, file);
      const content = readFileSync(fullPath, 'utf-8');
      
      // Extract default export component name
      const exportMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
      if (exportMatch) {
        components.push({
          name: exportMatch[1],
          file_path: relative(process.cwd(), fullPath)
        });
      }
    }
    
    return components;
  } catch (error) {
    console.warn('⚠️  Error scanning page components:', error);
    return [];
  }
}

/**
 * Analyze routes and cross-reference with components
 */
async function analyzeRoutes(
  appRoutes: { path: string; component: string; file_path?: string }[],
  pageComponents: { name: string; file_path: string }[]
): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = [];
  
  for (const route of appRoutes) {
    // Find matching component
    const matchingComponent = pageComponents.find(comp => 
      comp.name === route.component ||
      comp.name.toLowerCase().includes(route.component.toLowerCase()) ||
      route.component.toLowerCase().includes(comp.name.toLowerCase())
    );
    
    const routeInfo: RouteInfo = {
      path: route.path,
      title: extractTitleFromPath(route.path),
      owner: extractOwnerFromPath(route.path, matchingComponent?.file_path),
      mobile_ok: false, // Will be determined later
      has_404: !matchingComponent,
      file_path: matchingComponent?.file_path || '',
      component_name: route.component,
      is_lazy: false, // Will be determined later
      has_auth: false, // Will be determined later  
      description: generateDescription(route.path, route.component)
    };
    
    routes.push(routeInfo);
  }
  
  return routes;
}

/**
 * Audit route details for 404s, mobile compatibility, etc.
 */
async function auditRouteDetails(routes: RouteInfo[]): Promise<RouteInfo[]> {
  return routes.map(route => {
    // Check mobile compatibility based on component patterns
    route.mobile_ok = checkMobileCompatibility(route);
    
    // Check if it's a lazy component
    route.is_lazy = route.component_name.includes('lazy') || route.file_path.includes('React.lazy');
    
    // Check for authentication requirements
    route.has_auth = checkAuthRequirements(route);
    
    return route;
  });
}

/**
 * Create missing stub components
 */
async function createMissingStubs(missingRoutes: RouteInfo[]): Promise<string[]> {
  const stubsCreated: string[] = [];
  const stubsDir = join(process.cwd(), 'src', 'pages', 'stubs');
  
  // Ensure stubs directory exists
  if (!existsSync(stubsDir)) {
    mkdirSync(stubsDir, { recursive: true });
  }
  
  for (const route of missingRoutes) {
    if (route.has_404 && route.path !== '*') {
      try {
        const stubContent = generateStubComponent(route);
        const stubFileName = `${route.component_name}.tsx`;
        const stubPath = join(stubsDir, stubFileName);
        
        if (!existsSync(stubPath)) {
          writeFileSync(stubPath, stubContent, 'utf-8');
          stubsCreated.push(relative(process.cwd(), stubPath));
          console.log(`🏗️  Created stub: ${stubFileName}`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to create stub for ${route.path}:`, error);
      }
    }
  }
  
  return stubsCreated;
}

/**
 * Generate CSV report
 */
async function generateRouteAuditCSV(routes: RouteInfo[]): Promise<void> {
  const csvPath = join(process.cwd(), 'out', 'demo', 'Route_Audit.csv');
  
  // Ensure output directory exists
  const outDir = dirname(csvPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  
  const headers = [
    'Path',
    'Title', 
    'Owner',
    'Mobile OK',
    'Has 404',
    'File Path',
    'Component',
    'Is Lazy',
    'Has Auth',
    'Description'
  ];
  
  const csvContent = [
    headers.join(','),
    ...routes.map(route => [
      `"${route.path}"`,
      `"${route.title}"`,
      `"${route.owner}"`,
      route.mobile_ok ? 'Yes' : 'No',
      route.has_404 ? 'Yes' : 'No',
      `"${route.file_path}"`,
      `"${route.component_name}"`,
      route.is_lazy ? 'Yes' : 'No',
      route.has_auth ? 'Yes' : 'No',
      `"${route.description}"`
    ].join(','))
  ].join('\n');
  
  writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`📊 Route audit CSV saved to: ${relative(process.cwd(), csvPath)}`);
}

/**
 * Helper functions
 */
function extractTitleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractOwnerFromPath(path: string, filePath?: string): string {
  if (filePath) {
    const pathSegments = filePath.split('/');
    if (pathSegments.length > 2) {
      return pathSegments[2]; // Usually src/pages/{owner}/...
    }
  }
  
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0) {
    return segments[0];
  }
  
  return 'app';
}

function checkMobileCompatibility(route: RouteInfo): boolean {
  // Heuristic checks for mobile compatibility
  const mobileFriendlyPatterns = [
    'responsive',
    'mobile',
    'adaptive',
    'fluid'
  ];
  
  const content = route.file_path + route.component_name + route.description;
  return mobileFriendlyPatterns.some(pattern => 
    content.toLowerCase().includes(pattern)
  );
}

function checkAuthRequirements(route: RouteInfo): boolean {
  const authPatterns = [
    'auth',
    'login',
    'protected',
    'private',
    'admin',
    'dashboard'
  ];
  
  const content = route.path + route.component_name;
  return authPatterns.some(pattern => 
    content.toLowerCase().includes(pattern)
  );
}

function generateDescription(path: string, component: string): string {
  const pathParts = path.split('/').filter(Boolean);
  const action = pathParts[pathParts.length - 1] || 'index';
  const entity = pathParts.length > 1 ? pathParts[pathParts.length - 2] : pathParts[0] || 'main';
  
  return `${action.charAt(0).toUpperCase() + action.slice(1)} page for ${entity}`;
}

function generateStubComponent(route: RouteInfo): string {
  const componentName = route.component_name;
  const title = route.title;
  const description = route.description;
  
  return `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Auto-generated stub component for ${route.path}
 * TODO: Implement actual functionality
 */
export default function ${componentName}() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Construction className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">${title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            ${description}
          </p>
          <p className="text-sm text-muted-foreground">
            This page is under construction. The component needs to be implemented.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg text-left">
            <h4 className="font-semibold mb-2">Development Info:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Route:</strong> ${route.path}</li>
              <li><strong>Component:</strong> ${componentName}</li>
              <li><strong>File:</strong> ${route.file_path || 'Not found'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;
}

// Execute if run directly
if (require.main === module) {
  generateRouteAudit()
    .then(result => {
      console.log('✅ Route audit completed successfully');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('❌ Route audit failed:', error);
      process.exit(1);
    });
}