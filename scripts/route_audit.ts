#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RouteInfo {
  path: string;
  title: string;
  owner: string;
  mobile_ok: boolean;
  has_404: boolean;
  component?: string;
  fileExists: boolean;
}

interface NavRoute {
  path: string;
  title: string;
  owner: string;
}

// Extract routes from App.tsx
function extractRoutesFromApp(): RouteInfo[] {
  const appPath = path.join(__dirname, '../src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  
  const routes: RouteInfo[] = [];
  const routeRegex = /<Route\s+path="([^"]+)"[^>]*element={[^}]*<([^/\s>]+)[^>]*\/?>.*?}/g;
  
  let match;
  while ((match = routeRegex.exec(appContent)) !== null) {
    const [, routePath, componentName] = match;
    
    routes.push({
      path: routePath,
      title: inferTitle(routePath),
      owner: inferOwner(routePath),
      mobile_ok: checkMobileSupport(componentName),
      has_404: false, // Will be checked later
      component: componentName,
      fileExists: true
    });
  }
  
  return routes;
}

// Infer page title from route path
function inferTitle(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  
  const lastSegment = segments[segments.length - 1];
  
  // Handle parameterized routes
  if (lastSegment.startsWith(':')) {
    const prevSegment = segments[segments.length - 2];
    return prevSegment ? formatTitle(prevSegment) : 'Dynamic Page';
  }
  
  return formatTitle(lastSegment);
}

function formatTitle(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Infer page owner from route path
function inferOwner(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Marketing';
  
  const firstSegment = segments[0].toLowerCase();
  
  const ownerMap: { [key: string]: string } = {
    'admin': 'CTO',
    'advisor': 'CTO',
    'advisors': 'CTO', 
    'family': 'CPO',
    'families': 'CPO',
    'personas': 'CPO',
    'nil': 'CTO',
    'athlete': 'CTO',
    'insurance': 'CTO',
    'attorney': 'CTO',
    'attorneys': 'CTO',
    'cpa': 'CTO',
    'cpas': 'CTO',
    'healthcare': 'CTO',
    'onboarding': 'CPO',
    'start': 'CPO',
    'learn': 'CPO',
    'demos': 'CPO',
    'solutions': 'Marketing',
    'pricing': 'Marketing',
    'about': 'Marketing',
    'contact': 'Marketing',
    'help': 'CPO',
    'settings': 'CTO',
    'auth': 'CTO',
    'login': 'CTO',
    'signup': 'CTO'
  };
  
  return ownerMap[firstSegment] || 'CPO';
}

// Check mobile support heuristically
function checkMobileSupport(componentName: string): boolean {
  // Admin pages are typically desktop-first
  if (componentName.toLowerCase().includes('admin')) return false;
  
  // Dashboard pages may not be mobile-optimized
  if (componentName.toLowerCase().includes('dashboard')) return false;
  
  // Assume most other pages have mobile support
  return true;
}

// Check if component file exists
function checkComponentExists(componentName: string): boolean {
  const possiblePaths = [
    `../src/pages/${componentName}.tsx`,
    `../src/components/${componentName}.tsx`,
    `../src/pages/${componentName}/index.tsx`
  ];
  
  return possiblePaths.some(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    return fs.existsSync(fullPath);
  });
}

// Get navigation routes that should exist
function getNavigationRoutes(): NavRoute[] {
  return [
    { path: '/', title: 'Home', owner: 'Marketing' },
    { path: '/families', title: 'Families', owner: 'Marketing' },
    { path: '/pros', title: 'Professionals', owner: 'Marketing' },
    { path: '/solutions', title: 'Solutions', owner: 'Marketing' },
    { path: '/pricing', title: 'Pricing', owner: 'Marketing' },
    { path: '/about', title: 'About', owner: 'Marketing' },
    { path: '/contact', title: 'Contact', owner: 'Marketing' },
    { path: '/help', title: 'Help', owner: 'CPO' },
    { path: '/login', title: 'Login', owner: 'CTO' },
    { path: '/signup', title: 'Sign Up', owner: 'CTO' },
    { path: '/dashboard', title: 'Dashboard', owner: 'CPO' },
    { path: '/onboarding', title: 'Onboarding', owner: 'CPO' },
    { path: '/admin', title: 'Admin Portal', owner: 'CTO' },
    { path: '/admin/hq', title: 'HQ Dashboard', owner: 'CTO' },
  ];
}

// Create stub component for missing route
function createStub(routePath: string, title: string): void {
  const componentName = generateComponentName(routePath);
  const filePath = path.join(__dirname, `../src/pages/${componentName}.tsx`);
  
  // Don't overwrite existing files
  if (fs.existsSync(filePath)) return;
  
  const stubContent = `import React from 'react';
import { NoContentStub } from '@/components/util/NoContentStub';

export default function ${componentName}() {
  return (
    <NoContentStub 
      title="${title}"
      route="${routePath}"
    />
  );
}`;

  fs.writeFileSync(filePath, stubContent);
  console.log(`Created stub: ${filePath}`);
}

function generateComponentName(routePath: string): string {
  if (routePath === '/') return 'HomePage';
  
  return routePath
    .split('/')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('') + 'Page';
}

// Generate CSV output
function generateCSV(routes: RouteInfo[]): string {
  const headers = ['path', 'title', 'owner', 'mobile_ok', 'has_404'];
  const rows = routes.map(route => [
    route.path,
    route.title,
    route.owner,
    route.mobile_ok.toString(),
    route.has_404.toString()
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

// Main audit function
async function runRouteAudit(): Promise<void> {
  console.log('🔍 Starting route audit...\n');
  
  // Extract existing routes from App.tsx
  const existingRoutes = extractRoutesFromApp();
  
  // Get required navigation routes
  const navRoutes = getNavigationRoutes();
  
  // Check for missing routes
  const existingPaths = new Set(existingRoutes.map(r => r.path));
  const missingRoutes: RouteInfo[] = [];
  
  for (const navRoute of navRoutes) {
    if (!existingPaths.has(navRoute.path)) {
      missingRoutes.push({
        ...navRoute,
        mobile_ok: true,
        has_404: true,
        fileExists: false
      });
      
      // Create stub for missing route
      createStub(navRoute.path, navRoute.title);
    }
  }
  
  // Combine all routes
  const allRoutes = [...existingRoutes, ...missingRoutes];
  
  // Check for 404s (component files don't exist)
  allRoutes.forEach(route => {
    if (route.component && !checkComponentExists(route.component)) {
      route.has_404 = true;
      route.fileExists = false;
    }
  });
  
  // Ensure output directory exists
  const outDir = path.join(__dirname, '../out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Generate CSV
  const csvContent = generateCSV(allRoutes);
  const csvPath = path.join(outDir, 'Route_Audit.csv');
  fs.writeFileSync(csvPath, csvContent);
  
  // Print summary
  const total = allRoutes.length;
  const has404 = allRoutes.filter(r => r.has_404).length;
  const mobileReady = allRoutes.filter(r => r.mobile_ok).length;
  const stubsCreated = missingRoutes.length;
  
  console.log('📊 Route Audit Summary:');
  console.log(`   Total routes: ${total}`);
  console.log(`   404 errors: ${has404}`);
  console.log(`   Mobile ready: ${mobileReady}/${total}`);
  console.log(`   Stubs created: ${stubsCreated}`);
  console.log(`   Report saved: ${csvPath}\n`);
  
  if (has404 > 0) {
    console.log('❌ FAILURE: Routes with 404 errors detected');
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: No 404 errors found');
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  runRouteAudit().catch(console.error);
}