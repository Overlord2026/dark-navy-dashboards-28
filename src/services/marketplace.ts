import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from '@/services/receipts';
import { anchorSingle } from '@/services/receipts';

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
  let query = supabase
    .from('agent_profiles')
    .select('*')
    .eq('is_active', true);

  if (filters.state) {
    query = query.contains('states_licensed', [filters.state]);
  }

  if (filters.specialty && filters.specialty.length > 0) {
    query = query.overlaps('specialties', filters.specialty);
  }

  if (filters.languages && filters.languages.length > 0) {
    query = query.overlaps('languages', filters.languages);
  }

  if (filters.max_sla_hours) {
    query = query.lte('sla_hours', filters.max_sla_hours);
  }

  if (filters.min_rating) {
    query = query.gte('rating', filters.min_rating);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgentBySlug(slug: string): Promise<AgentProfile | null> {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

export async function startQuoteSession(intakeData: any, familyId?: string): Promise<QuoteSession> {
  // Canonicalize intake data
  const canonicalData = canonicalizeIntakeData(intakeData);
  
  // Generate inputs hash
  const inputsHash = await hashInputs(canonicalData);
  
  // Create session
  const sessionData = {
    family_id: familyId,
    intake_data: canonicalData,
    inputs_hash: inputsHash,
    status: 'intake' as const,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };

  const { data: session, error } = await supabase
    .from('quote_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) throw error;

  // Record quote session receipt
  const receiptId = await recordReceipt({
    type: 'QuoteSession-RDS',
    ts: new Date().toISOString(),
    inputs_hash: inputsHash,
    policy_version: 'v1.0',
    outcome: 'session_created',
    reasons: ['quote_requested', `coverage_${canonicalData.coverage_type}`],
    metadata: {
      session_id: session.id,
      coverage_type: canonicalData.coverage_type,
      state: canonicalData.state,
      has_family_id: !!familyId
    }
  });

  // Optional anchoring for high-value sessions
  if (shouldAnchorSession(canonicalData)) {
    try {
      const anchorRef = await anchorSingle(receiptId);
      
      await supabase
        .from('quote_sessions')
        .update({ anchor_ref: anchorRef })
        .eq('id', session.id);
    } catch (error) {
      console.warn('Failed to anchor quote session:', error);
    }
  }

  return { ...session, anchor_ref: undefined };
}

export async function routeToAgent(sessionId: string, agentId: string): Promise<void> {
  const { error } = await supabase
    .from('quote_sessions')
    .update({
      agent_id: agentId,
      status: 'routed',
      assigned_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) throw error;

  // Record routing receipt
  await recordReceipt({
    type: 'QuoteSession-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await hashInputs({ session_id: sessionId, agent_id: agentId }),
    policy_version: 'v1.0',
    outcome: 'session_routed',
    reasons: ['agent_assigned'],
    metadata: {
      session_id: sessionId,
      agent_id: agentId
    }
  });
}

export async function submitQuoteResponse(
  sessionId: string, 
  quoteData: any, 
  agentId: string
): Promise<void> {
  // Create banded quote response (no raw premiums)
  const bandedQuote = createBandedQuote(quoteData);
  
  const { error } = await supabase
    .from('quote_sessions')
    .update({
      status: 'quoted',
      quoted_at: new Date().toISOString(),
      quote_response: bandedQuote
    })
    .eq('id', sessionId)
    .eq('agent_id', agentId);

  if (error) throw error;

  // Record quote outcome receipt
  await recordReceipt({
    type: 'QuoteOutcome-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await hashInputs({
      session_id: sessionId,
      premium_band: bandedQuote.premium_band,
      coverage_bands: bandedQuote.coverage_bands
    }),
    policy_version: 'v1.0',
    outcome: 'quote_provided',
    reasons: ['quote_calculated', `premium_${bandedQuote.premium_band}`],
    metadata: {
      session_id: sessionId,
      agent_id: agentId,
      premium_band: bandedQuote.premium_band,
      coverage_count: Object.keys(bandedQuote.coverage_bands).length
    }
  });
}

export async function getAgentQuoteSessions(agentId: string): Promise<QuoteSession[]> {
  const { data, error } = await supabase
    .from('quote_sessions')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getOpenQuoteSessions(): Promise<QuoteSession[]> {
  const { data, error } = await supabase
    .from('quote_sessions')
    .select('*')
    .eq('status', 'intake')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

function canonicalizeIntakeData(rawData: any): any {
  return {
    coverage_type: rawData.coverage_type?.toLowerCase() || 'auto',
    state: rawData.state?.toUpperCase() || '',
    vehicle_count: rawData.vehicles?.length || 0,
    driver_count: rawData.drivers?.length || 0,
    property_count: rawData.properties?.length || 0,
    current_carrier: rawData.current_carrier || 'unknown',
    desired_coverage_level: rawData.desired_coverage_level || 'standard',
    has_claims: !!rawData.recent_claims?.length,
    coverage_needs: rawData.coverage_needs || [],
    timestamp: new Date().toISOString()
  };
}

function createBandedQuote(rawQuote: any): any {
  const premium = parseFloat(rawQuote.annual_premium || 0);
  
  let premiumBand = 'unknown';
  if (premium < 1000) premiumBand = 'low';
  else if (premium < 2500) premiumBand = 'medium';
  else if (premium < 5000) premiumBand = 'high';
  else premiumBand = 'premium';

  const coverageBands: Record<string, string> = {};
  Object.keys(rawQuote.coverages || {}).forEach(coverage => {
    const limit = rawQuote.coverages[coverage];
    if (typeof limit === 'number') {
      if (limit < 50000) coverageBands[coverage] = 'basic';
      else if (limit < 250000) coverageBands[coverage] = 'standard';
      else if (limit < 500000) coverageBands[coverage] = 'enhanced';
      else coverageBands[coverage] = 'maximum';
    }
  });

  return {
    premium_band: premiumBand,
    coverage_bands: coverageBands,
    deductible_options: rawQuote.deductible_options || [],
    payment_options: rawQuote.payment_options || [],
    discounts_applied: rawQuote.discounts_applied || [],
    valid_until: rawQuote.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
}

function shouldAnchorSession(canonicalData: any): boolean {
  // Anchor high-value or multi-coverage sessions
  return (
    canonicalData.coverage_type === 'umbrella' ||
    canonicalData.property_count > 2 ||
    canonicalData.vehicle_count > 3 ||
    canonicalData.desired_coverage_level === 'maximum'
  );
}

async function hashInputs(inputs: any): Promise<string> {
  const inputString = JSON.stringify(inputs, Object.keys(inputs).sort());
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const crypto = window.crypto || (globalThis as any).crypto;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}