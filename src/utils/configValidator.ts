// Mock config files - in a real implementation these would be imported from JSON files
const personaConfig = [
  { persona: 'family', segment: 'aspiring', tags: ['family', 'aspiring'] },
  { persona: 'family', segment: 'retirees', tags: ['family', 'retirees'] },
  { persona: 'family', segment: 'hnw', tags: ['family', 'hnw'] },
  { persona: 'family', segment: 'entrepreneurs', tags: ['family', 'entrepreneurs'] },
  { persona: 'family', segment: 'physicians', tags: ['family', 'physicians'] },
  { persona: 'family', segment: 'executives', tags: ['family', 'executives'] },
  { persona: 'family', segment: 'independent_women', tags: ['family', 'independent_women'] },
  { persona: 'family', segment: 'athletes', tags: ['family', 'athletes'] }
];

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

const catalogConfig = [
  {
    key: "retirement-roadmap",
    label: "Retirement Roadmap",
    summary: "Turn assets into lifetime income with sequence-risk guardrails.",
    type: "Tool",
    personas: ["family", "retirees", "advisor"],
    solutions: ["investments"],
    tags: ["planning", "income"],
    route: "/tools/retirement-roadmap",
    status: "ready"
  },
  {
    key: "annuities-education",
    label: "Annuities 101",
    summary: "Understand SPIA, DIA, MYGA, FIA, VA—the tradeoffs in plain English.",
    type: "Guide",
    personas: ["family", "retirees", "advisor"],
    solutions: ["annuities"],
    tags: ["annuities", "education"],
    route: "/solutions/annuities/learn",
    status: "ready"
  },
  {
    key: "wealth-vault",
    label: "Wealth Vault",
    summary: "Keep wills, trusts, deeds and beneficiaries in one place.",
    type: "Tool",
    personas: ["family", "retirees", "advisor", "attorney"],
    solutions: ["estate"],
    tags: ["vault", "keep-safe", "legal-hold"],
    route: "/tools/wealth-vault",
    status: "ready"
  }
];

const demoConfig = [
  {
    id: 'annuities-demo',
    title: 'Annuities Calculator Demo',
    steps: ['step1', 'step2', 'step3'],
    cta: 'Try Calculator'
  },
  {
    id: 'retirement-demo',
    title: 'Retirement Planning Demo',
    steps: ['intro', 'setup', 'results'],
    cta: 'Start Planning'
  }
];

// Known routes in the application
const KNOWN_ROUTES = [
  '/tools/retirement-roadmap',
  '/solutions/annuities/learn',
  '/tools/wealth-vault',
  '/tools/rmd-check',
  '/tools/social-security',
  '/solutions/annuities',
  '/discover',
  '/how-it-works',
  '/solutions',
  '/admin/qa-coverage'
];

export type Issue = { 
  level: 'error' | 'warn'; 
  where: string; 
  message: string; 
  ref?: string;
};

export type CoverageData = {
  count: number;
  keys: string[];
};

export type CoverageMatrix = {
  [personaKey: string]: {
    [solutionKey: string]: CoverageData;
  };
};

function intersect(a: string[], b: string[]): boolean {
  return a?.some(x => b?.includes(x)) || false;
}

export function validateConfigs(): { issues: Issue[]; coverage: CoverageMatrix } {
  const issues: Issue[] = [];

  // 1) Catalog fields validation
  const mustHaveFields = ['key', 'label', 'summary', 'type', 'personas', 'solutions', 'tags', 'route', 'status'];
  
  catalogConfig.forEach((item: any) => {
    mustHaveFields.forEach(field => {
      if (item[field] == null) {
        issues.push({
          level: 'error',
          where: `catalog:${item.key || '?'}`,
          message: `Missing ${field}`,
          ref: item.route
        });
      }
    });

    if (!Array.isArray(item.personas) || item.personas.length === 0) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: 'No personas',
        ref: item.route
      });
    }

    if (!Array.isArray(item.solutions) || item.solutions.length === 0) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: 'No solutions',
        ref: item.route
      });
    }

    // Check route existence
    if (item.route && !KNOWN_ROUTES.includes(item.route)) {
      issues.push({
        level: 'warn',
        where: `catalog:${item.key}`,
        message: `Route not found: ${item.route}`,
        ref: item.route
      });
    }
  });

  // 2) Demo fields validation
  demoConfig.forEach((demo: any) => {
    if (!demo.id || !demo.title || !Array.isArray(demo.steps) || !demo.steps.length || !demo.cta) {
      issues.push({
        level: 'error',
        where: `demo:${demo.id || '?'}`,
        message: 'Missing fields (id, title, steps[], cta)'
      });
    }
  });

  // 3) Coverage matrix generation
  const personas = personaConfig.map((p: any) => ({
    key: [p.persona, p.segment].filter(Boolean).join(':'),
    title: p.segment || p.persona,
    tags: p.tags
  }));

  const coverage: CoverageMatrix = {};

  personas.forEach((persona: any) => {
    coverage[persona.key] = {};
    
    solutionsNav.forEach((solution: any) => {
      const items = catalogConfig.filter((catalogItem: any) => 
        intersect(catalogItem.personas, persona.tags) && 
        catalogItem.solutions?.includes(solution.key)
      );
      
      coverage[persona.key][solution.key] = {
        count: items.length,
        keys: items.map((item: any) => item.key)
      };

      // Warn about zero coverage for important combinations
      if (items.length === 0) {
        issues.push({
          level: 'warn',
          where: `coverage:${persona.key}/${solution.key}`,
          message: `No public items found for ${persona.title} × ${solution.title}`
        });
      }
    });
  });

  return { issues, coverage };
}

// Route existence checker using HEAD requests
export async function checkRouteExists(route: string): Promise<boolean> {
  try {
    // First check against known routes
    if (KNOWN_ROUTES.includes(route)) {
      return true;
    }

    // For production, you could make HEAD requests
    // const response = await fetch(route, { method: 'HEAD' });
    // return response.status === 200;
    
    return false;
  } catch {
    return false;
  }
}

// Enhanced route checking for all catalog items
export async function validateRoutes(): Promise<Issue[]> {
  const issues: Issue[] = [];
  
  for (const item of catalogConfig) {
    if (item.route) {
      const exists = await checkRouteExists(item.route);
      if (!exists) {
        issues.push({
          level: 'error',
          where: `route:${item.key}`,
          message: `Route does not exist: ${item.route}`,
          ref: item.route
        });
      }
    }
  }
  
  return issues;
}

// Export coverage matrix as CSV
export function exportCoverageCSV(coverage: CoverageMatrix): string {
  const personas = Object.keys(coverage);
  const solutions = Object.keys(coverage[personas[0]] || {});
  
  let csv = 'Persona,' + solutions.join(',') + '\\n';
  
  personas.forEach(persona => {
    const row = [persona];
    solutions.forEach(solution => {
      row.push(coverage[persona][solution]?.count?.toString() || '0');
    });
    csv += row.join(',') + '\\n';
  });
  
  return csv;
}

// Detailed coverage report with tool names
export function exportDetailedCSV(coverage: CoverageMatrix): string {
  const personas = Object.keys(coverage);
  const solutions = Object.keys(coverage[personas[0]] || {});
  
  let csv = 'Persona,Solution,Count,Tools\\n';
  
  personas.forEach(persona => {
    solutions.forEach(solution => {
      const data = coverage[persona][solution];
      const tools = data?.keys?.join('; ') || '';
      csv += `${persona},${solution},${data?.count || 0},"${tools}"\\n`;
    });
  });
  
  return csv;
}

// Get validation summary stats
export function getValidationStats(issues: Issue[]) {
  return {
    totalIssues: issues.length,
    errorCount: issues.filter(i => i.level === 'error').length,
    warningCount: issues.filter(i => i.level === 'warn').length,
    catalogIssues: issues.filter(i => i.where.startsWith('catalog:')).length,
    demoIssues: issues.filter(i => i.where.startsWith('demo:')).length,
    coverageIssues: issues.filter(i => i.where.startsWith('coverage:')).length,
    routeIssues: issues.filter(i => i.where.startsWith('route:')).length
  };
}