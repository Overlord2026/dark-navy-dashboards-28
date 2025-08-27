/**
 * Insurance Rating Stub Service
 * Produces banded premium worksheets without real carrier integration
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';
import { InsuranceRisk } from './insuranceIntake';

export interface QuoteWorksheet {
  id: string;
  submission_id: string;
  premium_band: string;
  coverage_summary: Record<string, string>;
  rating_factors: {
    base_premium_band: string;
    age_factor: number;
    credit_factor: number;
    location_factor: number;
    property_factor?: number;
    vehicle_factor?: number;
  };
  effective_date: string;
  quoted_at: string;
}

/**
 * Generate rating worksheet with banded outputs
 */
export async function generateQuote(submissionId: string, risk: InsuranceRisk): Promise<QuoteWorksheet> {
  // Calculate base premium band
  const basePremium = calculateBasePremium(risk);
  const premiumBand = bandPremium(basePremium);
  
  // Rating factors (for transparency)
  const ratingFactors = {
    base_premium_band: premiumBand,
    age_factor: getAgeFactor(risk.applicant.age_band),
    credit_factor: getCreditFactor(risk.applicant.credit_band),
    location_factor: getLocationFactor(risk.applicant.location_zip_first3),
    ...(risk.property && { property_factor: getPropertyFactor(risk.property) }),
    ...(risk.vehicle && { vehicle_factor: getVehicleFactor(risk.vehicle) })
  };

  const worksheet: QuoteWorksheet = {
    id: crypto.randomUUID(),
    submission_id: submissionId,
    premium_band: premiumBand,
    coverage_summary: buildCoverageSummary(risk),
    rating_factors: ratingFactors,
    effective_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    quoted_at: new Date().toISOString()
  };

  // Store worksheet
  const { error } = await supabase
    .from('insurance_quotes')
    .insert({
      id: worksheet.id,
      submission_id: submissionId,
      premium_band: premiumBand,
      coverage_summary: worksheet.coverage_summary,
      rating_factors: ratingFactors,
      effective_date: worksheet.effective_date,
      status: 'quoted'
    });

  if (error) throw error;

  // Update submission status
  await supabase
    .from('insurance_submissions')
    .update({ status: 'quoted' })
    .eq('id', submissionId);

  // Record Quote-RDS
  const quoteHash = await inputs_hash({
    risk_hash: await inputs_hash(risk),
    rating_factors: ratingFactors,
    premium_band: premiumBand
  });

  await recordReceipt({
    type: 'Quote-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    submission_id: submissionId,
    quote_id: worksheet.id,
    quote_hash: quoteHash,
    premium_band: premiumBand,
    coverage_type: risk.type
  });

  return worksheet;
}

function calculateBasePremium(risk: InsuranceRisk): number {
  let base = 800; // Base annual premium
  
  // Apply risk factors
  if (risk.type === 'home' && risk.property) {
    // Property-specific adjustments
    const valueBandMultiplier = {
      'under_150k': 0.8,
      '150k_300k': 1.0,
      '300k_500k': 1.3,
      'over_500k': 1.6
    }[risk.property.value_band] || 1.0;
    
    base *= valueBandMultiplier;
    
    if (risk.property.year_built_band === 'pre_1970') base *= 1.2;
    if (risk.property.construction_type === 'masonry') base *= 0.9;
  }
  
  if (risk.type === 'auto' && risk.vehicle) {
    // Vehicle-specific adjustments
    const yearBandMultiplier = {
      'pre_2010': 0.7,
      '2010_2014': 0.8,
      '2015_2019': 1.0,
      'post_2020': 1.2
    }[risk.vehicle.year_band] || 1.0;
    
    base *= yearBandMultiplier;
    
    if (risk.vehicle.make_category === 'luxury') base *= 1.4;
    if (risk.vehicle.usage_type === 'business') base *= 1.3;
  }
  
  return Math.round(base);
}

function bandPremium(premium: number): string {
  if (premium < 600) return 'under_600';
  if (premium < 1000) return '600_1000';
  if (premium < 1500) return '1000_1500';
  if (premium < 2500) return '1500_2500';
  return 'over_2500';
}

function getAgeFactor(ageBand: string): number {
  const factors = {
    'under_25': 1.3,
    '25_34': 1.1,
    '35_49': 1.0,
    '50_64': 0.9,
    'over_65': 1.0
  };
  return factors[ageBand] || 1.0;
}

function getCreditFactor(creditBand: string): number {
  const factors = {
    'poor': 1.4,
    'fair': 1.2,
    'good': 1.0,
    'very_good': 0.9,
    'excellent': 0.8
  };
  return factors[creditBand] || 1.0;
}

function getLocationFactor(zipFirst3: string): number {
  // Simplified location-based rating
  const highRiskZips = ['900', '100', '110', '200']; // CA, NY metro areas
  return highRiskZips.includes(zipFirst3) ? 1.2 : 1.0;
}

function getPropertyFactor(property: any): number {
  let factor = 1.0;
  if (property.protection_class === 'class_1') factor *= 0.9;
  if (property.protection_class === 'class_9') factor *= 1.2;
  return factor;
}

function getVehicleFactor(vehicle: any): number {
  let factor = 1.0;
  if (vehicle.safety_rating_band === 'excellent') factor *= 0.9;
  if (vehicle.safety_rating_band === 'poor') factor *= 1.2;
  return factor;
}

function buildCoverageSummary(risk: InsuranceRisk): Record<string, string> {
  const summary: Record<string, string> = {};
  
  if (risk.type === 'home') {
    summary.dwelling = risk.coverage_limits.dwelling || 'Standard';
    summary.personal_property = risk.coverage_limits.personal_property || '75% of dwelling';
    summary.liability = risk.coverage_limits.liability || '$300,000';
    summary.deductible = risk.deductibles.all_other_perils || '$1,000';
  }
  
  if (risk.type === 'auto') {
    summary.bodily_injury = risk.coverage_limits.bodily_injury || '$250,000/$500,000';
    summary.property_damage = risk.coverage_limits.property_damage || '$100,000';
    summary.collision_deductible = risk.deductibles.collision || '$500';
    summary.comprehensive_deductible = risk.deductibles.comprehensive || '$500';
  }
  
  return summary;
}

/**
 * Get quote by ID
 */
export async function getQuote(id: string): Promise<QuoteWorksheet | null> {
  const { data, error } = await supabase
    .from('insurance_quotes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  
  return {
    id: data.id,
    submission_id: data.submission_id,
    premium_band: data.premium_band,
    coverage_summary: data.coverage_summary,
    rating_factors: data.rating_factors,
    effective_date: data.effective_date,
    quoted_at: data.created_at
  };
}