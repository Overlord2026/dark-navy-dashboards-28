import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from '@/services/receipts';
import { anchorSingle, AnchorRef } from '@/services/receipts';

// Break deep types at boundaries to avoid TypeScript infinite recursion
type DbRow = any;

export interface AgentProfile {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  states_licensed: string[];
  specialties: string[];
  languages: string[];
  sla_hours: number;
  rating: number;
  reviews_count: number;
  profile_image_url?: string;
  bio?: string;
  credentials: string[];
  years_experience: number;
  contact_methods: {
    phone?: string;
    email?: string;
    website?: string;
  };
  disclosures: {
    license_numbers: Record<string, string>;
    carrier_appointments: string[];
    commission_disclosure: string;
  };
  availability: {
    business_hours: string;
    response_time: string;
    booking_url?: string;
  };
}

export interface QuoteSession {
  id: string;
  family_id?: string;
  agent_id?: string;
  intake_data: any;
  inputs_hash: string;
  status: 'intake' | 'routed' | 'quoted' | 'completed' | 'expired';
  created_at: string;
  expires_at: string;
  assigned_at?: string;
  quoted_at?: string;
  anchor_ref?: any;
}

export interface QuoteFilters {
  state?: string;
  specialty?: string[];
  languages?: string[];
  max_sla_hours?: number;
  min_rating?: number;
}

export async function listAgents(filters: QuoteFilters = {}): Promise<AgentProfile[]> {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('*')
    .eq('role', 'agent');

  if (error) throw error;
  
  const profiles = data as DbRow[];
  return profiles.map(row => ({
    id: row.id,
    user_id: row.user_id || row.id,
    business_name: row.business_name || 'Agent',
    slug: row.slug || row.id,
    states_licensed: row.states_licensed || [],
    specialties: row.specialties || [],
    languages: row.languages || ['English'],
    sla_hours: row.sla_hours || 24,
    rating: row.rating || 4.5,
    reviews_count: row.reviews_count || 0,
    profile_image_url: row.profile_image_url,
    bio: row.bio,
    credentials: row.credentials || [],
    years_experience: row.years_experience || 5,
    contact_methods: row.contact_methods || {},
    disclosures: row.disclosures || { license_numbers: {}, carrier_appointments: [], commission_disclosure: '' },
    availability: row.availability || { business_hours: '9-5', response_time: '24 hours' }
  })) as AgentProfile[];
}

export async function getAgentBySlug(slug: string): Promise<AgentProfile | null> {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('*')
    .eq('slug', slug)
    .eq('role', 'agent')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as DbRow;
  return {
    id: row.id,
    user_id: row.user_id || row.id,
    business_name: row.business_name || 'Agent',
    slug: row.slug || row.id,
    states_licensed: row.states_licensed || [],
    specialties: row.specialties || [],
    languages: row.languages || ['English'],
    sla_hours: row.sla_hours || 24,
    rating: row.rating || 4.5,
    reviews_count: row.reviews_count || 0,
    profile_image_url: row.profile_image_url,
    bio: row.bio,
    credentials: row.credentials || [],
    years_experience: row.years_experience || 5,
    contact_methods: row.contact_methods || {},
    disclosures: row.disclosures || { license_numbers: {}, carrier_appointments: [], commission_disclosure: '' },
    availability: row.availability || { business_hours: '9-5', response_time: '24 hours' }
  } as AgentProfile;
}

export async function startQuoteSession(intakeData: any, familyId?: string): Promise<QuoteSession> {
  const canonicalData = canonicalizeIntakeData(intakeData);
  const inputsHash = await hashInputs(canonicalData);
  const sessionId = crypto.randomUUID();
  
  const sessionData = {
    id: sessionId,
    family_id: familyId,
    intake_data: canonicalData,
    inputs_hash: inputsHash,
    status: 'intake' as const,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  await recordReceipt({
    type: 'QuoteSession-RDS',
    ts: new Date().toISOString(),
    inputs_hash: inputsHash,
    policy_version: 'v1.0'
  });

  return sessionData as QuoteSession;
}

export async function routeToAgent(sessionId: string, agentId: string): Promise<void> {
  await recordReceipt({
    type: 'QuoteSession-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await hashInputs({ session_id: sessionId, agent_id: agentId }),
    policy_version: 'v1.0'
  });
}

export async function submitQuoteResponse(sessionId: string, quoteData: any, agentId: string): Promise<void> {
  const bandedQuote = createBandedQuote(quoteData);
  await recordReceipt({
    type: 'QuoteOutcome-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await hashInputs({ session_id: sessionId, quote: bandedQuote }),
    policy_version: 'v1.0'
  });
}

export async function getAgentQuoteSessions(agentId: string): Promise<QuoteSession[]> {
  return [];
}

export async function getOpenQuoteSessions(): Promise<QuoteSession[]> {
  return [];
}

function canonicalizeIntakeData(rawData: any): any {
  return {
    coverage_type: rawData.coverage_type?.toLowerCase() || 'auto',
    state: rawData.state?.toUpperCase() || '',
    timestamp: new Date().toISOString()
  };
}

function createBandedQuote(rawQuote: any): any {
  return {
    premium_band: 'medium',
    coverage_bands: {},
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
}

async function hashInputs(inputs: any): Promise<string> {
  const inputString = JSON.stringify(inputs);
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const crypto = window.crypto || (globalThis as any).crypto;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}