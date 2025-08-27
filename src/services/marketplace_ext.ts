/**
 * Marketplace Extension Service
 * Agent specialties and HNW marketplace features
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface AgentProfile {
  id: string;
  user_id: string;
  business_name?: string;
  display_name: string;
  specialties: string[];
  credentials: string[];
  years_experience?: number;
  hnw_certifications: string[];
  service_areas: string[];
  minimum_premium: number;
  rating: number;
  review_count: number;
  profile_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpecialtyFilter {
  specialty_types?: string[];
  minimum_experience?: number;
  certifications?: string[];
  service_areas?: string[];
  minimum_rating?: number;
  minimum_premium_band?: string;
}

/**
 * List specialists with filters
 */
export async function listSpecialists(filters: SpecialtyFilter = {}): Promise<AgentProfile[]> {
  let query = supabase
    .from('advisor_profiles')
    .select('*')
    .eq('profile_verified', true)
    .order('rating', { ascending: false });

  // Apply specialty filters
  if (filters.specialty_types?.length) {
    query = query.overlaps('specialties', filters.specialty_types);
  }

  if (filters.minimum_experience) {
    query = query.gte('years_experience', filters.minimum_experience);
  }

  if (filters.minimum_rating) {
    query = query.gte('rating', filters.minimum_rating);
  }

  if (filters.service_areas?.length) {
    query = query.overlaps('service_areas', filters.service_areas);
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;

  // Additional filtering for certifications (client-side for complex jsonb queries)
  let filteredData = data || [];
  
  if (filters.certifications?.length) {
    filteredData = filteredData.filter(agent => 
      filters.certifications?.some(cert => 
        agent.hnw_certifications?.includes(cert)
      )
    );
  }

  if (filters.minimum_premium_band) {
    const minimumValue = getPremiumBandValue(filters.minimum_premium_band);
    filteredData = filteredData.filter(agent => 
      agent.minimum_premium >= minimumValue
    );
  }

  return filteredData;
}

/**
 * Update agent specialties with receipts
 */
export async function updateAgentSpecialties(
  agentId: string, 
  specialties: string[],
  certifications?: string[],
  serviceAreas?: string[]
): Promise<void> {
  const updates: any = { specialties };
  
  if (certifications) updates.hnw_certifications = certifications;
  if (serviceAreas) updates.service_areas = serviceAreas;

  const { error } = await supabase
    .from('advisor_profiles')
    .update(updates)
    .eq('user_id', agentId);

  if (error) throw error;

  // Record Publish-RDS for profile update
  await recordReceipt({
    type: 'Publish-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    agent_id: agentId,
    update_type: 'specialties',
    specialties_count: specialties.length,
    certifications_count: certifications?.length || 0,
    service_areas_count: serviceAreas?.length || 0,
    profile_hash: await inputs_hash({ 
      specialties, 
      certifications: certifications || [],
      service_areas: serviceAreas || []
    })
  });

  // Record Rules-Export-RDS for marketplace visibility rules
  await recordReceipt({
    type: 'Rules-Export-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    agent_id: agentId,
    rule_type: 'marketplace_visibility',
    specialties: specialties,
    filters_affected: ['specialty_search', 'certification_search', 'area_search'],
    visibility_scope: 'public_marketplace'
  });
}

/**
 * Get agent profile with HNW badges
 */
export async function getAgentProfile(agentId: string): Promise<{
  profile: AgentProfile;
  hnw_badges: string[];
  recent_cases: number;
  avg_case_value_band: string;
}> {
  const { data: profile, error } = await supabase
    .from('advisor_profiles')
    .select('*')
    .eq('user_id', agentId)
    .single();

  if (error) throw error;

  // Calculate HNW badges based on specialties and experience
  const hnwBadges = calculateHNWBadges(profile);
  
  // Get recent case statistics (simplified)
  const recentCases = await getRecentCaseStats(agentId);

  return {
    profile,
    hnw_badges: hnwBadges,
    recent_cases: recentCases.count,
    avg_case_value_band: recentCases.avg_value_band
  };
}

/**
 * Search agents by specialty and location
 */
export async function searchAgents(
  searchQuery: string,
  location?: string,
  specialtyFilters?: string[]
): Promise<{
  agents: AgentProfile[];
  total_count: number;
  specialty_counts: Record<string, number>;
}> {
  let query = supabase
    .from('advisor_profiles')
    .select('*', { count: 'exact' })
    .eq('profile_verified', true);

  // Text search in name and business name
  if (searchQuery) {
    query = query.or(`display_name.ilike.%${searchQuery}%,business_name.ilike.%${searchQuery}%`);
  }

  // Location filter
  if (location) {
    query = query.contains('service_areas', [location]);
  }

  // Specialty filters
  if (specialtyFilters?.length) {
    query = query.overlaps('specialties', specialtyFilters);
  }

  const { data, error, count } = await query
    .order('rating', { ascending: false })
    .limit(20);

  if (error) throw error;

  // Calculate specialty distribution
  const specialtyCounts = calculateSpecialtyCounts(data || []);

  return {
    agents: data || [],
    total_count: count || 0,
    specialty_counts: specialtyCounts
  };
}

/**
 * Get marketplace analytics for agent
 */
export async function getMarketplaceAnalytics(agentId: string): Promise<{
  profile_views: number;
  inquiry_count: number;
  conversion_rate: number;
  avg_response_time_hours: number;
  specialty_performance: Record<string, number>;
}> {
  // In real implementation, would query analytics tables
  // For now, return placeholder data
  return {
    profile_views: 156,
    inquiry_count: 23,
    conversion_rate: 0.18,
    avg_response_time_hours: 2.4,
    specialty_performance: {
      'high_value_home': 8,
      'fine_art': 5,
      'marine': 3,
      'cyber': 7
    }
  };
}

/**
 * Submit agent inquiry with tracking
 */
export async function submitAgentInquiry(
  agentId: string,
  inquirerInfo: {
    name: string;
    email: string;
    phone?: string;
    asset_types: string[];
    value_band: string;
    message: string;
  }
): Promise<string> {
  const inquiryId = crypto.randomUUID();
  
  // Store inquiry (privacy-preserving)
  const { error } = await supabase
    .from('agent_inquiries')
    .insert({
      id: inquiryId,
      agent_id: agentId,
      inquirer_hash: await inputs_hash({ 
        email: inquirerInfo.email,
        phone: inquirerInfo.phone || '' 
      }),
      asset_types: inquirerInfo.asset_types,
      value_band: inquirerInfo.value_band,
      status: 'pending'
    });

  if (error) throw error;

  // Record inquiry receipt
  await recordReceipt({
    type: 'Inquiry-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    inquiry_id: inquiryId,
    agent_id: agentId,
    asset_types: inquirerInfo.asset_types,
    value_band: inquirerInfo.value_band,
    inquirer_hash: await inputs_hash({ email: inquirerInfo.email })
  });

  return inquiryId;
}

/**
 * Calculate HNW badges for agent
 */
function calculateHNWBadges(profile: AgentProfile): string[] {
  const badges = [];

  // Experience badges
  if (profile.years_experience >= 10) badges.push('veteran');
  if (profile.years_experience >= 20) badges.push('master');

  // Specialty badges
  const hnwSpecialties = [
    'high_value_home', 'fine_art', 'marine', 'cyber', 
    'kidnap_ransom', 'private_client'
  ];
  
  const hnwCount = profile.specialties?.filter(s => 
    hnwSpecialties.includes(s)
  ).length || 0;

  if (hnwCount >= 3) badges.push('hnw_specialist');
  if (hnwCount >= 5) badges.push('hnw_expert');

  // Certification badges
  const premiumCerts = [
    'CPCU', 'ARM', 'CIC', 'CRM', 'CPIA', 'AINS'
  ];
  
  const certCount = profile.hnw_certifications?.filter(c => 
    premiumCerts.includes(c)
  ).length || 0;

  if (certCount >= 2) badges.push('certified');
  if (certCount >= 4) badges.push('elite_certified');

  // Performance badges
  if (profile.rating >= 4.5) badges.push('top_rated');
  if (profile.review_count >= 50) badges.push('trusted');

  return badges;
}

/**
 * Get recent case statistics (placeholder)
 */
async function getRecentCaseStats(agentId: string): Promise<{
  count: number;
  avg_value_band: string;
}> {
  // Would query actual case data in real implementation
  return {
    count: 15,
    avg_value_band: '1m_5m'
  };
}

/**
 * Calculate specialty distribution
 */
function calculateSpecialtyCounts(agents: AgentProfile[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  agents.forEach(agent => {
    agent.specialties?.forEach(specialty => {
      counts[specialty] = (counts[specialty] || 0) + 1;
    });
  });

  return counts;
}

/**
 * Convert premium band to numeric value for filtering
 */
function getPremiumBandValue(band: string): number {
  const bandValues = {
    'under_5k': 2500,
    '5k_25k': 15000,
    '25k_100k': 62500,
    '100k_500k': 300000,
    'over_500k': 750000
  };
  
  return bandValues[band] || 0;
}

/**
 * Get available specialties list
 */
export function getAvailableSpecialties(): Record<string, string> {
  return {
    'high_value_home': 'High-Value Homeowners',
    'fine_art': 'Fine Art & Collectibles',
    'marine': 'Marine (Boats & Yachts)',
    'cyber': 'Cyber Liability',
    'kidnap_ransom': 'Kidnap & Ransom',
    'private_client': 'Private Client Services',
    'umbrella': 'Umbrella Coverage',
    'flood': 'Flood Insurance',
    'earthquake': 'Earthquake Coverage',
    'exotic_auto': 'Exotic Automobiles',
    'aviation': 'Aviation Insurance',
    'commercial_real_estate': 'Commercial Real Estate',
    'entity_coverage': 'Entity-Owned Assets'
  };
}

/**
 * Get available certifications
 */
export function getAvailableCertifications(): Record<string, string> {
  return {
    'CPCU': 'Chartered Property Casualty Underwriter',
    'ARM': 'Associate in Risk Management',
    'CIC': 'Certified Insurance Counselor',
    'CRM': 'Certified Risk Manager',
    'CPIA': 'Certified Professional Insurance Agent',
    'AINS': 'Associate in General Insurance',
    'AIM': 'Associate in Marine Insurance',
    'API': 'Associate in Personal Insurance',
    'AAI': 'Accredited Adviser in Insurance'
  };
}