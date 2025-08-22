import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { CATALOG_TOOLS } from '@/data/catalogTools';

export type ValidationIssue = {
  level: 'error' | 'warn';
  where: string;
  message: string;
  ref?: string;
};

export type CoverageMatrix = {
  [personaKey: string]: {
    [solutionKey: string]: {
      count: number;
      keys: string[];
    };
  };
};

export type ValidationResult = {
  issues: ValidationIssue[];
  coverage: CoverageMatrix;
  stats: {
    totalTools: number;
    readyTools: number;
    betaTools: number;
    comingSoonTools: number;
    errorCount: number;
    warningCount: number;
  };
};

// Mock demo config - would be from actual demo config file
const DEMO_CONFIG = [
  {
    id: 'annuities-demo',
    title: 'Annuities Calculator Demo',
    steps: ['step1', 'step2', 'step3'],
    cta: 'Try Calculator'
  }
];

const SOLUTIONS = [
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

function intersect(a: string[], b: string[]): boolean {
  return a?.some(x => b?.includes(x)) || false;
}

export function validateConfigs(): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1) Validate catalog tools
  const requiredFields = ['key', 'label', 'summary', 'type', 'personas', 'solutions', 'tags', 'route', 'status'];
  
  CATALOG_TOOLS.forEach((item: any) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (item[field] == null || item[field] === '') {
        issues.push({
          level: 'error',
          where: `catalog:${item.key || '?'}`,
          message: `Missing required field: ${field}`,
          ref: item.route
        });
      }
    });

    // Check array fields
    if (!Array.isArray(item.personas) || item.personas.length === 0) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: 'No personas assigned',
        ref: item.route
      });
    }

    if (!Array.isArray(item.solutions) || item.solutions.length === 0) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: 'No solutions assigned',
        ref: item.route
      });
    }

    // Check route format
    if (item.route && !item.route.startsWith('/')) {
      issues.push({
        level: 'error',
        where: `catalog:${item.key}`,
        message: 'Route must start with /',
        ref: item.route
      });
    }

    // Check status values
    if (item.status && !['ready', 'beta', 'coming-soon'].includes(item.status)) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: `Invalid status: ${item.status}`,
        ref: item.route
      });
    }
  });

  // 2) Validate demo config
  DEMO_CONFIG.forEach((demo: any) => {
    if (!demo.id || !demo.title || !Array.isArray(demo.steps) || !demo.steps.length || !demo.cta) {
      issues.push({
        level: 'error',
        where: `demo:${demo.id || '?'}`,
        message: 'Missing required demo fields (id, title, steps[], cta)'
      });
    }
  });

  // 3) Build coverage matrix
  const personas = FAMILY_SEGMENTS.map(segment => ({
    key: segment.slug,
    title: segment.title,
    tags: [segment.slug, 'family'] // Map segment to persona tags
  }));

  const coverage: CoverageMatrix = {};
  
  personas.forEach(persona => {
    coverage[persona.key] = {};
    
    SOLUTIONS.forEach(solution => {
      const items = CATALOG_TOOLS.filter(tool => 
        intersect(tool.personas, persona.tags) && tool.solutions?.includes(solution.key as any)
      );
      
      coverage[persona.key][solution.key] = {
        count: items.length,
        keys: items.map(item => item.key)
      };

      // Warn about zero coverage for important personas/solutions
      if (items.length === 0 && ['investments', 'tax', 'estate'].includes(solution.key)) {
        issues.push({
          level: 'warn',
          where: `coverage:${persona.key}/${solution.key}`,
          message: `No tools found for ${persona.title} × ${solution.title}`
        });
      }
    });
  });

  // 4) Calculate stats
  const stats = {
    totalTools: CATALOG_TOOLS.length,
    readyTools: CATALOG_TOOLS.filter(t => t.status === 'ready').length,
    betaTools: CATALOG_TOOLS.filter(t => t.status === 'beta').length,
    comingSoonTools: CATALOG_TOOLS.filter(t => t.status === 'coming-soon').length,
    errorCount: issues.filter(i => i.level === 'error').length,
    warningCount: issues.filter(i => i.level === 'warn').length
  };

  return { issues, coverage, stats };
}

export function exportCoverageCSV(coverage: CoverageMatrix): string {
  const personas = Object.keys(coverage);
  const solutions = Object.keys(coverage[personas[0]] || {});
  
  let csv = 'Persona,' + solutions.join(',') + '\n';
  
  personas.forEach(persona => {
    const row = [persona];
    solutions.forEach(solution => {
      row.push(coverage[persona][solution]?.count?.toString() || '0');
    });
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

// Route existence checker (mock implementation)
export async function checkRouteExists(route: string): Promise<boolean> {
  // In a real implementation, this would check if the route exists in the router
  // or make a HEAD request to verify the route is accessible
  const knownRoutes = [
    '/tools/', '/solutions/', '/courses/', '/admin/', '/receipts',
    '/family/', '/discover', '/how-it-works'
  ];
  
  return knownRoutes.some(knownRoute => route.startsWith(knownRoute));
}