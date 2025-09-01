import { supabase } from '@/integrations/supabase/client';

export interface Advisor {
  id: string;
  name: string;
  title: string;
  rating: number;
  tags: string[];
  location: string;
  years: string;
  avatar_url?: string;
}

function normalizeAdvisor(data: any): Advisor {
  return {
    id: data.id,
    name: data.name || 'Advisor',
    title: data.title || 'Financial Advisor',
    rating: data.rating || 4.0,
    tags: data.tags || [],
    location: data.location || 'Location TBD',
    years: data.years_exp || '5+ years',
    avatar_url: data.avatar_url
  };
}

export async function fetchAdvisors(): Promise<Advisor[]> {
  // Check feature flag first
  if (!import.meta.env.VITE_FEATURE_PROS_LIVE) {
    const seedModule = await import('@/seed/advisors.seed');
    return seedModule.default || [];
  }

  try {
    const { data, error } = await (supabase as any)
      .from('v_public_pros')
      .select('*')
      .limit(200);

    if (error || !data || data.length === 0) {
      // Fallback to seed data
      const seedModule = await import('@/seed/advisors.seed');
      return seedModule.default || [];
    }

    return data.map(normalizeAdvisor);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    // Fallback to seed data on network error
    const seedModule = await import('@/seed/advisors.seed');
    return seedModule.default || [];
  }
}

export async function fetchAdvisorById(id: string): Promise<Advisor | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('v_public_pros')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return normalizeAdvisor(data);
  } catch (error) {
    console.error('Error fetching advisor by ID:', error);
    return null;
  }
}

export async function submitProInquiry(payload: {
  pro_id?: string;
  persona: string;
  full_name: string;
  email: string;
  message?: string;
  consent_tos?: boolean;
}) {
  try {
    const { data, error } = await supabase
      .from('pro_inquiries')
      .insert({
        pro_id: payload.pro_id,
        persona: payload.persona,
        full_name: payload.full_name,
        email: payload.email,
        message: payload.message,
        consent_tos: payload.consent_tos || false
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification email if configured
    if (import.meta.env.VITE_RESEND_ENABLED) {
      try {
        await supabase.functions.invoke('pro-inquiry-email', {
          body: {
            inquiry_id: data.id,
            persona: payload.persona,
            pro_id: payload.pro_id
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the entire operation if email fails
      }
    }

    return {
      ok: true,
      inquiry_id: data.id,
      receipt_hash: (data as any).receipt_hash || 'temp_' + Date.now()
    };
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw new Error('Failed to submit inquiry. Please try again.');
  }
}