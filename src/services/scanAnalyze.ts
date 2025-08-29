/**
 * Document Scanning and Analysis Service
 * OCR and analysis for HNW insurance documents
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface ScanResult {
  extraction_id: string;
  confidence_score: number;
  extracted_data: {
    policy_details?: {
      policy_number_band: string;
      carrier_tier: string;
      effective_date: string;
      expiry_date: string;
    };
    coverage_bands: {
      coverage_type: string;
      limit_band: string;
      deductible_band: string;
    }[];
    valuation_bands?: {
      appraised_value_band: string;
      appraisal_date: string;
      appraiser_category: string;
    };
  };
}

export interface GapAnalysis {
  coverage_gaps: {
    gap_type: 'missing_coverage' | 'underinsured' | 'coverage_overlap';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommended_limit_band: string;
  }[];
  recommendations: {
    priority: 'immediate' | 'high' | 'medium' | 'low';
    action: string;
    reasoning: string;
  }[];
}

export interface AssetAdvice {
  advice_type: 'coverage_gap' | 'underinsured' | 'overinsured' | 'missing_coverage' | 
               'appraisal_needed' | 'policy_update' | 'risk_mitigation';
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  advice_summary: string;
  detailed_analysis: any;
  recommended_actions: any[];
}

/**
 * OCR and extract data from asset documents
 */
export async function ocrDeclarations(
  vaultHash: string, 
  assetType: string
): Promise<ScanResult> {
  // Simulate OCR processing (in real implementation, would call OCR service)
  const extractedData = await simulateOCR(vaultHash, assetType);
  
  const extractionId = crypto.randomUUID();
  const confidenceScore = calculateConfidence(extractedData);

  // Store extraction results
  const { error } = await supabase
    .from('asset_extracts')
    .insert({
      id: extractionId,
      asset_doc_id: vaultHash, // Would be proper doc ID in real implementation
      extraction_type: 'coverage_bands',
      extracted_data: extractedData,
      confidence_score: confidenceScore
    });

  if (error) throw error;

  // Record Coverage-RDS
  await recordReceipt({
    type: 'Coverage-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    extraction_id: extractionId,
    asset_type: assetType,
    confidence_band: bandConfidence(confidenceScore),
    coverage_count: extractedData.coverage_bands?.length || 0,
    document_hash: await inputs_hash({ vault_hash: vaultHash })
  });

  return {
    extraction_id: extractionId,
    confidence_score: confidenceScore,
    extracted_data: extractedData
  };
}

/**
 * Analyze coverage gaps for an asset
 */
export async function gapAnalysis(
  assetId: string,
  assetType: string,
  extractedData: any
): Promise<GapAnalysis> {
  // Get existing coverage data
  const { data: existingDocs } = await supabase
    .from('asset_docs')
    .select('*, asset_extracts(*)')
    .eq('asset_id', assetId);

  // Analyze gaps based on asset type and existing coverage
  const analysis = performGapAnalysis(assetType, extractedData, existingDocs || []);
  
  // Record Explainability-RDS for the analysis
  await recordReceipt({
    type: 'Explainability-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: assetId,
    analysis_type: 'gap_analysis',
    gaps_found: analysis.coverage_gaps.length,
    recommendations_count: analysis.recommendations.length,
    severity_distribution: calculateSeverityDistribution(analysis.coverage_gaps),
    model_version: 'gap_analyzer_v1.0'
  });

  return analysis;
}

/**
 * Save advice for an asset
 */
export async function saveAdvice(
  assetId: string,
  advice: AssetAdvice
): Promise<string> {
  const { data, error } = await supabase
    .from('asset_advice')
    .insert({
      asset_id: assetId,
      ...advice
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record Advice-RDS
  await recordReceipt({
    type: 'Advice-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: assetId,
    advice_id: data.id,
    advice_type: advice.advice_type,
    priority_level: advice.priority_level,
    action_count: advice.recommended_actions?.length || 0
  });

  return data.id;
}

/**
 * Batch analyze multiple documents for an asset
 */
export async function batchAnalyze(assetId: string): Promise<{
  scan_results: ScanResult[];
  gap_analysis: GapAnalysis;
  generated_advice: string[];
}> {
  // Get all documents for the asset
  const { data: docs, error } = await supabase
    .from('asset_docs')
    .select('*')
    .eq('asset_id', assetId);

  if (error) throw error;

  const scanResults: ScanResult[] = [];
  
  // Get asset details for analysis
  const { data: asset } = await supabase
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (!asset) throw new Error('Asset not found');

  // Process each document
  for (const doc of docs || []) {
    if (['declaration', 'appraisal', 'survey'].includes(doc.document_type)) {
      const scanResult = await ocrDeclarations(doc.vault_hash, asset.asset_type);
      scanResults.push(scanResult);
    }
  }

  // Perform comprehensive gap analysis
  const combinedData = scanResults.reduce((acc, result) => ({
    ...acc,
    coverage_bands: [...(acc.coverage_bands || []), ...(result.extracted_data.coverage_bands || [])]
  }), { coverage_bands: [] });

  const gaps = await gapAnalysis(assetId, asset.asset_type, combinedData);

  // Generate advice based on findings
  const adviceIds: string[] = [];
  for (const gap of gaps.coverage_gaps) {
    if (gap.severity === 'high' || gap.severity === 'critical') {
      const advice: AssetAdvice = {
        advice_type: gap.gap_type === 'missing_coverage' ? 'missing_coverage' : 'coverage_gap',
        priority_level: gap.severity === 'critical' ? 'urgent' : 'high',
        advice_summary: gap.description,
        detailed_analysis: { gap_details: gap },
        recommended_actions: gaps.recommendations
          .filter(r => r.priority === 'immediate' || r.priority === 'high')
          .map(r => ({ action: r.action, reasoning: r.reasoning }))
      };
      
      const adviceId = await saveAdvice(assetId, advice);
      adviceIds.push(adviceId);
    }
  }

  return {
    scan_results: scanResults,
    gap_analysis: gaps,
    generated_advice: adviceIds
  };
}

/**
 * Get analysis history for asset
 */
export async function getAnalysisHistory(assetId: string): Promise<{
  extractions: any[];
  advice_history: any[];
  gap_trends: any[];
}> {
  const [extractions, advice] = await Promise.all([
    supabase
      .from('asset_extracts')
      .select('*, asset_docs(*)')
      .eq('asset_docs.asset_id', assetId)
      .order('processed_at', { ascending: false }),
    supabase
      .from('asset_advice')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false })
  ]);

  return {
    extractions: extractions.data || [],
    advice_history: advice.data || [],
    gap_trends: [] // Would calculate trends over time
  };
}

/**
 * Simulate OCR processing (placeholder for real OCR service)
 */
async function simulateOCR(vaultHash: string, assetType: string): Promise<any> {
  // In real implementation, would call actual OCR service
  const baseData = {
    policy_details: {
      policy_number_band: 'standard_format',
      carrier_tier: 'tier_1',
      effective_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    coverage_bands: []
  };

  // Asset-specific coverage patterns
  switch (assetType) {
    case 'home_high_value':
      baseData.coverage_bands = [
        { coverage_type: 'dwelling', limit_band: '1m_5m', deductible_band: '10k_50k' },
        { coverage_type: 'personal_property', limit_band: '500k_1m', deductible_band: '5k_25k' },
        { coverage_type: 'liability', limit_band: '1m_5m', deductible_band: 'none' }
      ];
      break;
    case 'fine_art':
      baseData.coverage_bands = [
        { coverage_type: 'scheduled_art', limit_band: '100k_500k', deductible_band: 'none' }
      ];
      (baseData as any).valuation_bands = {
        appraised_value_band: '100k_500k',
        appraisal_date: '2023-01-01',
        appraiser_category: 'certified'
      };
      break;
    case 'marine_yacht':
      baseData.coverage_bands = [
        { coverage_type: 'hull', limit_band: '1m_5m', deductible_band: '25k_100k' },
        { coverage_type: 'liability', limit_band: '1m_5m', deductible_band: 'none' },
        { coverage_type: 'crew', limit_band: '100k_500k', deductible_band: '5k_25k' }
      ];
      break;
  }

  return baseData;
}

/**
 * Calculate confidence score for OCR results
 */
function calculateConfidence(extractedData: any): number {
  let score = 0.5; // Base score
  
  if (extractedData.policy_details) score += 0.2;
  if (extractedData.coverage_bands?.length > 0) score += 0.2;
  if (extractedData.valuation_bands) score += 0.1;
  
  return Math.min(score, 1.0);
}

/**
 * Perform gap analysis logic
 */
function performGapAnalysis(assetType: string, extractedData: any, existingDocs: any[]): GapAnalysis {
  const gaps = [];
  const recommendations = [];

  // Standard coverage requirements by asset type
  const requiredCoverages = getRequiredCoverages(assetType);
  const existingCoverages = extractedData.coverage_bands || [];

  for (const required of requiredCoverages) {
    const existing = existingCoverages.find(c => c.coverage_type === required.type);
    
    if (!existing) {
      gaps.push({
        gap_type: 'missing_coverage' as const,
        severity: required.critical ? 'critical' as const : 'high' as const,
        description: `Missing ${required.type} coverage`,
        recommended_limit_band: required.recommended_band
      });
    } else if (compareLimitBands(existing.limit_band, required.recommended_band) < 0) {
      gaps.push({
        gap_type: 'underinsured' as const,
        severity: 'medium' as const,
        description: `${required.type} coverage may be insufficient`,
        recommended_limit_band: required.recommended_band
      });
    }
  }

  // Generate recommendations
  if (gaps.length > 0) {
    recommendations.push({
      priority: 'high' as const,
      action: 'Review and update coverage limits',
      reasoning: 'Multiple coverage gaps identified'
    });
  }

  return { coverage_gaps: gaps, recommendations };
}

/**
 * Get required coverages by asset type
 */
function getRequiredCoverages(assetType: string) {
  const coverageRequirements = {
    'home_high_value': [
      { type: 'dwelling', recommended_band: '1m_5m', critical: true },
      { type: 'personal_property', recommended_band: '500k_1m', critical: true },
      { type: 'liability', recommended_band: '1m_5m', critical: true }
    ],
    'fine_art': [
      { type: 'scheduled_art', recommended_band: '100k_500k', critical: true }
    ],
    'marine_yacht': [
      { type: 'hull', recommended_band: '1m_5m', critical: true },
      { type: 'liability', recommended_band: '1m_5m', critical: true }
    ]
  };

  return coverageRequirements[assetType] || [];
}

/**
 * Compare limit bands (-1: first < second, 0: equal, 1: first > second)
 */
function compareLimitBands(band1: string, band2: string): number {
  const bandOrder = [
    'under_100k', '100k_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m'
  ];
  
  const index1 = bandOrder.indexOf(band1);
  const index2 = bandOrder.indexOf(band2);
  
  return index1 - index2;
}

/**
 * Band confidence score for privacy
 */
function bandConfidence(score: number): string {
  if (score < 0.3) return 'low';
  if (score < 0.7) return 'medium';
  return 'high';
}

/**
 * Calculate severity distribution for explainability
 */
function calculateSeverityDistribution(gaps: any[]): Record<string, number> {
  return gaps.reduce((acc, gap) => {
    acc[gap.severity] = (acc[gap.severity] || 0) + 1;
    return acc;
  }, {});
}