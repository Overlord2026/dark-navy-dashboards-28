/**
 * Marketplace Extension Service
 * Agent specialties and HNW marketplace features
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

// Break deep types at boundaries
type DbRow = any;

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
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('role', 'insurance_agent')
    .order('rating', { ascending: false });

  if (error) throw error;

  const profiles = data as DbRow[];
  return profiles.map(row => ({
    id: row.id,
    user_id: row.user_id || row.id,
    business_name: row.business_name,
    display_name: row.display_name || row.name || 'Agent',
    specialties: row.specialties || [],
    credentials: row.certifications || [],
    years_experience: row.years_experience || 5,
    hnw_certifications: row.certifications || [],
    service_areas: row.service_areas || [],
    minimum_premium: row.minimum_premium || 0,
    rating: row.rating || 4.5,
    review_count: row.review_count || 0,
    profile_verified: row.profile_verified || true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  })) as AgentProfile[];
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

  const { error } = await (supabase as any)
    .from('profiles')
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
  const { data: profile, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('user_id', agentId)
    .single();

  if (error) throw error;

  const row = profile as DbRow;
  const agentProfile: AgentProfile = {
    id: row.id,
    user_id: row.user_id || row.id,
    business_name: row.business_name,
    display_name: row.display_name || row.name || 'Agent',
    specialties: row.specialties || [],
    credentials: row.certifications || [],
    years_experience: row.years_experience || 5,
    hnw_certifications: row.certifications || [],
    service_areas: row.service_areas || [],
    minimum_premium: row.minimum_premium || 0,
    rating: row.rating || 4.5,
    review_count: row.review_count || 0,
    profile_verified: row.profile_verified || true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  };

  // Calculate HNW badges based on specialties and experience
  const hnwBadges = calculateHNWBadges(agentProfile);
  
  // Get recent case statistics (simplified)
  const recentCases = await getRecentCaseStats(agentId);

  return {
    profile: agentProfile,
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
  const { data, error, count } = await (supabase as any)
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'insurance_agent')
    .order('rating', { ascending: false })
    .limit(20);

  if (error) throw error;

  const profiles = (data as DbRow[] || []).map(row => ({
    id: row.id,
    user_id: row.user_id || row.id,
    business_name: row.business_name,
    display_name: row.display_name || row.name || 'Agent',
    specialties: row.specialties || [],
    credentials: row.certifications || [],
    years_experience: row.years_experience || 5,
    hnw_certifications: row.certifications || [],
    service_areas: row.service_areas || [],
    minimum_premium: row.minimum_premium || 0,
    rating: row.rating || 4.5,
    review_count: row.review_count || 0,
    profile_verified: row.profile_verified || true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  })) as AgentProfile[];

  // Calculate specialty distribution
  const specialtyCounts = calculateSpecialtyCounts(profiles);

  return {
    agents: profiles,
    total_count: count || 0,
    specialty_counts: specialtyCounts
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
  
  // Store inquiry in domain events (privacy-preserving)
  const { error } = await (supabase as any)
    .from('domain_events')
    .insert({
      event_type: 'agent_inquiry_submitted',
      event_hash: await inputs_hash({ type: 'agent_inquiry' }),
      sequence_number: Date.now(),
      event_data: {
        agent_id: agentId,
        inquirer_hash: await inputs_hash({
          email: inquirerInfo.email,
          phone: inquirerInfo.phone || '' 
        }),
        asset_types: inquirerInfo.asset_types,
        value_band: inquirerInfo.value_band,
        status: 'pending'
      },
      aggregate_id: inquiryId,
      aggregate_type: 'agent_inquiry'
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
  if ((profile.years_experience || 0) >= 10) badges.push('veteran');
  if ((profile.years_experience || 0) >= 20) badges.push('master');

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