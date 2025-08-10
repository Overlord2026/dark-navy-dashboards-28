import { supabase } from '@/integrations/supabase/client';
import { calculatePM3Score } from '@/engines/portfolio/pm3';
import { scoreLiquidity } from './liquidityIQ';

export interface DDPackageInput {
  userId: string;
  fundId: string;
}

export interface DDPackageResult {
  packageId: string;
  pdfUrl: string;
  zipUrl: string;
}

export interface DDSnapshot {
  fundId: string;
  generatedAt: string;
  pm3Score: any;
  liquidityScore: any;
  performanceSummary: any;
  feeStructure: any;
  documentsList: string[];
  complianceChecks: any[];
  riskMetrics: any;
  managerInfo: any;
}

export async function buildDDPackage(input: DDPackageInput): Promise<DDPackageResult> {
  const { userId, fundId } = input;

  try {
    // Gather all DD components
    const snapshot = await compileDDSnapshot(fundId);
    
    // Generate artifacts
    const pdfUrl = await generateDDPdf(fundId, snapshot);
    const zipUrl = await generateDDZip(fundId, snapshot);
    
    // Persist to database
    const { data, error } = await supabase
      .from('dd_packages')
      .insert({
        user_id: userId,
        fund_id: fundId,
        snapshot: JSON.stringify(snapshot),
        artifact_urls: JSON.stringify({ pdfUrl, zipUrl })
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to persist DD package: ${error.message}`);
    }

    return {
      packageId: data.id,
      pdfUrl,
      zipUrl
    };
  } catch (error) {
    console.error('DD package generation failed:', error);
    throw new Error(`DD package generation failed: ${error.message}`);
  }
}

async function compileDDSnapshot(fundId: string): Promise<DDSnapshot> {
  // Gather PM3 score
  let pm3Score = null;
  try {
    // Mock PM3 input - in production this would come from fund data
    const pm3Input = {
      performanceData: {
        returns: [0.08, 0.12, -0.03, 0.15, 0.09],
        benchmarkReturns: [0.06, 0.08, -0.01, 0.10, 0.07],
        fees: 0.02
      },
      managerData: {
        experience: 15,
        aum: 2500000000,
        trackRecord: 8
      },
      marketData: {
        correlations: { spy: 0.3, bonds: -0.1 },
        volatility: 0.18
      }
    };
    pm3Score = await calculatePM3Score(pm3Input);
  } catch (error) {
    console.warn('Failed to calculate PM3 score:', error);
  }

  // Gather liquidity score
  let liquidityScore = null;
  try {
    const liquidityResult = await scoreLiquidity({ fundId });
    liquidityScore = liquidityResult;
  } catch (error) {
    console.warn('Failed to calculate liquidity score:', error);
  }

  // Mock other components - in production these would come from various data sources
  const snapshot: DDSnapshot = {
    fundId,
    generatedAt: new Date().toISOString(),
    pm3Score,
    liquidityScore,
    performanceSummary: {
      annualizedReturn: 12.5,
      volatility: 18.2,
      sharpeRatio: 0.85,
      maxDrawdown: -8.3,
      calmarRatio: 1.52,
      trackRecord: '8 years'
    },
    feeStructure: {
      managementFee: 2.0,
      performanceFee: 20.0,
      hurdle: 8.0,
      highWaterMark: true,
      redemptionFee: 1.0
    },
    documentsList: [
      'Private Placement Memorandum',
      'Limited Partnership Agreement',
      'Subscription Documents',
      'AIMA Due Diligence Questionnaire',
      'Audited Financial Statements (2Y)',
      'Marketing Presentation',
      'Risk Management Framework',
      'Compliance Manual'
    ],
    complianceChecks: [
      { check: 'SEC Registration', status: 'Compliant', notes: 'Registered Investment Adviser' },
      { check: 'AIMA Standards', status: 'Compliant', notes: 'Follows AIMA best practices' },
      { check: 'Audit Firm', status: 'Compliant', notes: 'Big Four auditor' },
      { check: 'Prime Brokerage', status: 'Compliant', notes: 'Tier 1 prime broker' },
      { check: 'Administrator', status: 'Compliant', notes: 'Independent third-party' }
    ],
    riskMetrics: {
      var95: -12.5,
      var99: -18.7,
      expectedShortfall: -15.2,
      correlationTradFunds: 0.65,
      concentrationRisk: 'Medium',
      liquidityRisk: 'Low'
    },
    managerInfo: {
      firmName: `Fund Manager for ${fundId}`,
      foundingYear: 2015,
      aum: 2.5,
      employees: 45,
      keyPersonnel: [
        'Managing Partner (15y experience)',
        'CIO (12y experience)', 
        'Head of Risk (10y experience)'
      ]
    }
  };

  return snapshot;
}

async function generateDDPdf(fundId: string, snapshot: DDSnapshot): Promise<string> {
  // In production, this would use a PDF generation library
  // For now, we'll create a URL that represents where the PDF would be stored
  const filename = `dd-package-${fundId}-${Date.now()}.pdf`;
  const pdfUrl = `/public/dd/${filename}`;
  
  // Mock PDF generation - in production would use libraries like jsPDF, Puppeteer, etc.
  console.log('Generated DD PDF:', pdfUrl);
  
  return pdfUrl;
}

async function generateDDZip(fundId: string, snapshot: DDSnapshot): Promise<string> {
  // In production, this would bundle all documents into a ZIP file
  const filename = `dd-package-${fundId}-${Date.now()}.zip`;
  const zipUrl = `/public/dd/${filename}`;
  
  // Mock ZIP generation - in production would bundle PDFs, Excel files, etc.
  console.log('Generated DD ZIP:', zipUrl);
  
  return zipUrl;
}

// Get existing DD packages for a user/fund
export async function getDDPackages(userId: string, fundId?: string) {
  let query = supabase
    .from('dd_packages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch DD packages: ${error.message}`);
  }

  return data || [];
}