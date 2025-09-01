import { supabase } from '@/integrations/supabase/client';

export type Pro = {
  id: string;
  name: string;
  title: string | null;
  avatar_url: string | null;
  location: string | null;
  rating: number | null;
  tags: string[] | null;
  years_exp: string | null;
};

export async function listAdvisors(): Promise<Pro[]> {
  const { data, error } = await supabase
    .from('v_public_pros')
    .select('id, name, title, avatar_url, location, rating, tags, years_exp')
    .order('rating', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as Pro[];
}

export async function getAdvisor(id: string): Promise<Pro | null> {
  const { data, error } = await supabase
    .from('v_public_pros')
    .select('id, name, title, avatar_url, location, rating, tags, years_exp')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Pro;
}

export async function submitInquiry(payload: {
  pro_id: string; name: string; email: string; phone?: string; message?: string;
}) {
  const { data, error } = await supabase.functions.invoke('pro-inquiry-email', { body: payload });
  if (error) throw error;
  return data;
}