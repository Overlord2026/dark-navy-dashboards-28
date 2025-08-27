/**
 * Insurance Intake Service
 * Handles personal lines intake normalization with trust rails
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface InsuranceRisk {
  type: 'home' | 'auto';
  applicant: {
    age_band: string;
    credit_band: string;
    location_zip_first3: string;
  };
  property?: {
    year_built_band: string;
    value_band: string;
    construction_type: string;
    protection_class: string;
  };
  vehicle?: {
    year_band: string;
    make_category: string;
    usage_type: string;
    safety_rating_band: string;
  };
  coverage_limits: Record<string, string>;
  deductibles: Record<string, string>;
}

export interface IntakeSubmission {
  id: string;
  risk_hash: string;
  created_at: string;
  status: 'submitted' | 'quoted' | 'bound' | 'declined';
}

/**
 * Normalize raw intake form into banded risk profile
 * NEVER store raw PII - only bands and hashes
 */
export async function normalizeRisk(rawIntake: any): Promise<InsuranceRisk> {
  // Age banding
  const age = parseInt(rawIntake.applicant?.age || '25');
  const age_band = age < 25 ? 'under_25' : 
                   age < 35 ? '25_34' :
                   age < 50 ? '35_49' :
                   age < 65 ? '50_64' : 'over_65';

  // Credit score banding
  const credit = parseInt(rawIntake.applicant?.credit_score || '700');
  const credit_band = credit < 580 ? 'poor' :
                      credit < 670 ? 'fair' :
                      credit < 740 ? 'good' :
                      credit < 800 ? 'very_good' : 'excellent';

  // Location (first 3 digits of ZIP only)
  const zip = rawIntake.applicant?.zip_code || '00000';
  const location_zip_first3 = zip.substring(0, 3);

  const risk: InsuranceRisk = {
    type: rawIntake.type,
    applicant: {
      age_band,
      credit_band,
      location_zip_first3
    },
    coverage_limits: rawIntake.coverage_limits || {},
    deductibles: rawIntake.deductibles || {}
  };

  // Type-specific risk factors
  if (rawIntake.type === 'home' && rawIntake.property) {
    const yearBuilt = parseInt(rawIntake.property.year_built || '2000');
    const value = parseInt(rawIntake.property.value || '200000');
    
    risk.property = {
      year_built_band: yearBuilt < 1970 ? 'pre_1970' :
                       yearBuilt < 1990 ? '1970_1989' :
                       yearBuilt < 2010 ? '1990_2009' : 'post_2010',
      value_band: value < 150000 ? 'under_150k' :
                  value < 300000 ? '150k_300k' :
                  value < 500000 ? '300k_500k' : 'over_500k',
      construction_type: rawIntake.property.construction_type || 'frame',
      protection_class: rawIntake.property.protection_class || 'class_4'
    };
  }

  if (rawIntake.type === 'auto' && rawIntake.vehicle) {
    const year = parseInt(rawIntake.vehicle.year || '2015');
    
    risk.vehicle = {
      year_band: year < 2010 ? 'pre_2010' :
                 year < 2015 ? '2010_2014' :
                 year < 2020 ? '2015_2019' : 'post_2020',
      make_category: categorizeMake(rawIntake.vehicle.make),
      usage_type: rawIntake.vehicle.usage || 'commute',
      safety_rating_band: rawIntake.vehicle.safety_rating || 'good'
    };
  }

  return risk;
}

function categorizeMake(make: string): string {
  const luxury = ['bmw', 'mercedes', 'audi', 'lexus', 'acura', 'infiniti'];
  const economy = ['toyota', 'honda', 'nissan', 'hyundai', 'kia'];
  const domestic = ['ford', 'chevrolet', 'dodge', 'gmc', 'buick'];
  
  const makeLower = make?.toLowerCase() || '';
  
  if (luxury.some(brand => makeLower.includes(brand))) return 'luxury';
  if (economy.some(brand => makeLower.includes(brand))) return 'economy';
  if (domestic.some(brand => makeLower.includes(brand))) return 'domestic';
  return 'other';
}

/**
 * Submit intake and generate receipt
 */
export async function submitIntake(risk: InsuranceRisk): Promise<string> {
  const riskHash = await inputs_hash(risk);
  
  const { data, error } = await supabase
    .from('insurance_submissions')
    .insert({
      risk_hash: riskHash,
      risk_profile: risk,
      status: 'submitted'
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record intake receipt
  await recordReceipt({
    type: 'Intake-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    risk_hash: riskHash,
    submission_id: data.id,
    coverage_type: risk.type
  });

  return data.id;
}

/**
 * Get submission by ID
 */
export async function getSubmission(id: string): Promise<IntakeSubmission | null> {
  const { data, error } = await supabase
    .from('insurance_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}