import { Entitlement } from '@/features/calculators/catalog';
import { Persona } from '@/types/goal';

export type ReportCategory = 'foundational' | 'advanced';
export type ReportType = 'chart' | 'table' | 'summary' | 'detailed' | 'analysis';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  entitlement: Entitlement;
  type: ReportType;
  icon: string;
  route: string;
  tags: string[];
  estimatedTime: string;
  dataSource: string[];
  exportFormats: ('pdf' | 'excel' | 'csv')[];
  persona?: Persona;
  popular?: boolean;
}

const reportsConfig: Report[] = [
  // Foundational Reports (Basic Tier)
  {
    id: 'net-worth',
    title: 'Net Worth Statement',
    description: 'Complete overview of assets, liabilities, and net worth trends',
    category: 'foundational',
    entitlement: 'basic',
    type: 'summary',
    icon: 'TrendingUp',
    route: '/reports/net-worth',
    tags: ['assets', 'liabilities', 'wealth', 'tracking'],
    estimatedTime: '2 min',
    dataSource: ['accounts', 'investments', 'real_estate', 'liabilities'],
    exportFormats: ['pdf', 'excel'],
    popular: true
  },
  {
    id: 'spending',
    title: 'Spending Analysis',
    description: 'Detailed breakdown of spending patterns and trends by category',
    category: 'foundational',
    entitlement: 'basic',
    type: 'analysis',
    icon: 'PieChart',
    route: '/reports/spending',
    tags: ['spending', 'categories', 'budgeting', 'trends'],
    estimatedTime: '3 min',
    dataSource: ['transactions', 'budget', 'categories'],
    exportFormats: ['pdf', 'excel', 'csv'],
    popular: true
  },
  {
    id: 'goals-progress',
    title: 'Goals Progress Report',
    description: 'Track progress toward financial goals and milestones',
    category: 'foundational',
    entitlement: 'basic',
    type: 'chart',
    icon: 'Target',
    route: '/reports/goals-progress',
    tags: ['goals', 'progress', 'savings', 'milestones'],
    estimatedTime: '2 min',
    dataSource: ['goals', 'contributions', 'accounts'],
    exportFormats: ['pdf', 'excel'],
    popular: true
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Statement',
    description: 'Monthly and annual cash flow analysis with projections',
    category: 'foundational',
    entitlement: 'basic',
    type: 'detailed',
    icon: 'ArrowUpDown',
    route: '/reports/cash-flow',
    tags: ['cash-flow', 'income', 'expenses', 'projections'],
    estimatedTime: '4 min',
    dataSource: ['transactions', 'income', 'budget'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'investment-performance',
    title: 'Investment Performance',
    description: 'Portfolio performance, allocation, and returns analysis',
    category: 'foundational',
    entitlement: 'premium',
    type: 'analysis',
    icon: 'BarChart3',
    route: '/reports/investment-performance',
    tags: ['investments', 'performance', 'returns', 'allocation'],
    estimatedTime: '5 min',
    dataSource: ['investments', 'portfolio', 'benchmarks'],
    exportFormats: ['pdf', 'excel']
  },

  // Advanced Reports (Premium/Elite Tier)
  {
    id: 'entity-trust-map',
    title: 'Entity & Trust Mapping',
    description: 'Comprehensive view of legal entities, trusts, and ownership structures',
    category: 'advanced',
    entitlement: 'elite',
    type: 'detailed',
    icon: 'Network',
    route: '/reports/entity-trust-map',
    tags: ['entities', 'trusts', 'ownership', 'structure', 'estate'],
    estimatedTime: '8 min',
    dataSource: ['entities', 'trusts', 'ownership', 'legal_documents'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'k1-list',
    title: 'K-1 Partnership Summary',
    description: 'Consolidated view of all K-1 partnerships and their tax implications',
    category: 'advanced',
    entitlement: 'elite',
    type: 'table',
    icon: 'FileText',
    route: '/reports/k1-list',
    tags: ['k1', 'partnerships', 'tax', 'entities', 'investments'],
    estimatedTime: '6 min',
    dataSource: ['k1_documents', 'partnerships', 'tax_data'],
    exportFormats: ['pdf', 'excel', 'csv']
  },
  {
    id: 're-equity-rollup',
    title: 'Real Estate & Equity Rollup',
    description: 'Comprehensive analysis of real estate holdings and equity positions',
    category: 'advanced',
    entitlement: 'elite',
    type: 'analysis',
    icon: 'Building',
    route: '/reports/re-equity-rollup',
    tags: ['real-estate', 'equity', 'properties', 'investments', 'valuation'],
    estimatedTime: '10 min',
    dataSource: ['real_estate', 'equity_positions', 'valuations', 'market_data'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'charitable-summary',
    title: 'Charitable Giving Summary',
    description: 'Track charitable contributions, tax benefits, and DAF activity',
    category: 'advanced',
    entitlement: 'premium',
    type: 'summary',
    icon: 'Heart',
    route: '/reports/charitable-summary',
    tags: ['charity', 'giving', 'tax-benefits', 'daf', 'donations'],
    estimatedTime: '5 min',
    dataSource: ['charitable_giving', 'tax_deductions', 'daf_activity'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning Report',
    description: 'Annual tax planning analysis with optimization strategies',
    category: 'advanced',
    entitlement: 'premium',
    type: 'analysis',
    icon: 'Calculator',
    route: '/reports/tax-planning',
    tags: ['tax', 'planning', 'optimization', 'strategies', 'deductions'],
    estimatedTime: '12 min',
    dataSource: ['tax_data', 'investments', 'income', 'deductions'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning Overview',
    description: 'Comprehensive estate planning analysis and recommendations',
    category: 'advanced',
    entitlement: 'elite',
    type: 'detailed',
    icon: 'Landmark',
    route: '/reports/estate-planning',
    tags: ['estate', 'planning', 'trusts', 'inheritance', 'tax-efficiency'],
    estimatedTime: '15 min',
    dataSource: ['estate_documents', 'trusts', 'beneficiaries', 'tax_projections'],
    exportFormats: ['pdf', 'excel']
  },
  {
    id: 'family-office-dashboard',
    title: 'Family Office Dashboard',
    description: 'Executive summary for family office operations and performance',
    category: 'advanced',
    entitlement: 'elite',
    type: 'summary',
    icon: 'Crown',
    route: '/reports/family-office-dashboard',
    tags: ['family-office', 'executive', 'performance', 'consolidated'],
    estimatedTime: '7 min',
    dataSource: ['all_accounts', 'entities', 'performance', 'compliance'],
    exportFormats: ['pdf', 'excel']
  }
];

export interface ReportAccessResult {
  hasAccess: boolean;
  userTier: Entitlement;
  requiredTier: Entitlement;
  upgradeUrl?: string;
}

// Foundational reports list
export const foundationalReports = ['net-worth', 'spending', 'goals-progress'];

// Advanced reports list  
export const advancedReports = ['entity-trust-map', 'k1-list', 're-equity-rollup', 'charitable-summary'];

export function getReportsConfig(): Report[] {
  return reportsConfig;
}

export function getFoundationalReports(): Report[] {
  return reportsConfig.filter(report => foundationalReports.includes(report.id));
}

export function getAdvancedReports(): Report[] {
  return reportsConfig.filter(report => advancedReports.includes(report.id));
}

export function getReportsByCategory(category: ReportCategory): Report[] {
  return reportsConfig.filter(report => report.category === category);
}

export function getReportsByTier(tier: Entitlement): Report[] {
  const tierHierarchy: Record<Entitlement, Entitlement[]> = {
    basic: ['basic'],
    premium: ['basic', 'premium'],
    elite: ['basic', 'premium', 'elite']
  };
  
  return reportsConfig.filter(report => 
    tierHierarchy[tier].includes(report.entitlement)
  );
}

export function getReportsByPersona(persona: Persona): Report[] {
  return reportsConfig.filter(report => 
    !report.persona || report.persona === persona
  );
}

export function getPopularReports(): Report[] {
  return reportsConfig.filter(report => report.popular);
}

export function getReportById(id: string): Report | undefined {
  return reportsConfig.find(report => report.id === id);
}

export function checkReportAccess(
  reportId: string, 
  userTier: Entitlement
): ReportAccessResult {
  const report = getReportById(reportId);
  
  if (!report) {
    return {
      hasAccess: false,
      userTier,
      requiredTier: 'basic'
    };
  }

  const tierHierarchy: Record<Entitlement, number> = {
    basic: 1,
    premium: 2,
    elite: 3
  };

  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[report.entitlement];
  
  const result: ReportAccessResult = {
    hasAccess,
    userTier,
    requiredTier: report.entitlement
  };

  if (!hasAccess) {
    result.upgradeUrl = `/pricing?feature=${report.id}&tier=${report.entitlement}`;
  }

  return result;
}

export function getUpgradeUrl(feature: string, requiredTier: Entitlement): string {
  return `/pricing?feature=${feature}&tier=${requiredTier}`;
}

export function searchReports(query: string): Report[] {
  const searchTerm = query.toLowerCase();
  return reportsConfig.filter(report => 
    report.title.toLowerCase().includes(searchTerm) ||
    report.description.toLowerCase().includes(searchTerm) ||
    report.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getReportsByTag(tag: string): Report[] {
  return reportsConfig.filter(report => 
    report.tags.includes(tag.toLowerCase())
  );
}

export function getReportsByType(type: ReportType): Report[] {
  return reportsConfig.filter(report => report.type === type);
}

// Analytics event helpers
export function trackReportAccess(reportId: string, userTier: Entitlement) {
  const report = getReportById(reportId);
  if (!report) return;

  // Track report access event
  console.log('Analytics: report.accessed', {
    reportId,
    reportTitle: report.title,
    category: report.category,
    userTier,
    requiredTier: report.entitlement,
    timestamp: new Date().toISOString()
  });
}

export function trackReportGeneration(reportId: string, format: string, duration: number) {
  const report = getReportById(reportId);
  if (!report) return;

  // Track report generation event
  console.log('Analytics: report.generated', {
    reportId,
    reportTitle: report.title,
    format,
    duration,
    timestamp: new Date().toISOString()
  });
}

export function trackFeatureGated(reportId: string, userTier: Entitlement, requiredTier: Entitlement) {
  const report = getReportById(reportId);
  if (!report) return;

  // Track feature gating event
  console.log('Analytics: feature.gated', {
    feature: reportId,
    featureType: 'report',
    userTier,
    requiredTier,
    upgradeUrl: getUpgradeUrl(reportId, requiredTier),
    timestamp: new Date().toISOString()
  });
}