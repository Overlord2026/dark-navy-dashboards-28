import { Persona, ComplexityTier } from '@/features/personalization/types';

export interface ReportConfig {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'tax' | 'estate' | 'entity';
  tier: ComplexityTier;
  personas?: Persona[];
}

/**
 * Available reports configuration
 */
export const AVAILABLE_REPORTS: ReportConfig[] = [
  // Foundational reports
  {
    id: 'netWorth',
    title: 'Net Worth Statement',
    description: 'Comprehensive overview of assets and liabilities',
    category: 'financial',
    tier: 'foundational'
  },
  {
    id: 'spending',
    title: 'Spending Analysis',
    description: 'Monthly and annual spending breakdown by category',
    category: 'financial',
    tier: 'foundational'
  },
  {
    id: 'goalsProgress',
    title: 'Goals Progress Report',
    description: 'Track progress toward your financial objectives',
    category: 'financial',
    tier: 'foundational'
  },
  
  // Advanced reports
  {
    id: 'entityTrustMap',
    title: 'Entity & Trust Mapping',
    description: 'Visual representation of entity structures and relationships',
    category: 'entity',
    tier: 'advanced'
  },
  {
    id: 'k1List',
    title: 'K-1 Summary Report',
    description: 'Consolidated view of all partnership distributions',
    category: 'tax',
    tier: 'advanced'
  },
  {
    id: 'reEquityRollup',
    title: 'Real Estate & Equity Rollup',
    description: 'Portfolio analysis of RE investments and equity positions',
    category: 'financial',
    tier: 'advanced'
  },
  {
    id: 'charitableSummary',
    title: 'Charitable Giving Summary',
    description: 'Tax-efficient giving strategies and impact analysis',
    category: 'tax',
    tier: 'advanced'
  }
];

/**
 * Gets available reports based on persona and complexity tier
 */
export function getReports(persona: Persona, tier: ComplexityTier): string[] {
  let reports = AVAILABLE_REPORTS
    .filter(report => {
      // Include if report's tier matches or is lower than user's tier
      if (tier === 'foundational' && report.tier === 'advanced') {
        return false;
      }
      
      // Include if no persona restriction or persona matches
      if (report.personas && !report.personas.includes(persona)) {
        return false;
      }
      
      return true;
    })
    .map(report => report.id);

  // Sort foundational first, then advanced
  const foundationalReports = reports.filter(id => 
    AVAILABLE_REPORTS.find(r => r.id === id)?.tier === 'foundational'
  );
  const advancedReports = reports.filter(id => 
    AVAILABLE_REPORTS.find(r => r.id === id)?.tier === 'advanced'
  );

  return [...foundationalReports, ...advancedReports];
}

/**
 * Gets report configuration by ID
 */
export function getReportConfig(reportId: string): ReportConfig | undefined {
  return AVAILABLE_REPORTS.find(report => report.id === reportId);
}

/**
 * Gets reports by category
 */
export function getReportsByCategory(
  persona: Persona, 
  tier: ComplexityTier, 
  category: ReportConfig['category']
): string[] {
  return getReports(persona, tier).filter(reportId => {
    const config = getReportConfig(reportId);
    return config?.category === category;
  });
}