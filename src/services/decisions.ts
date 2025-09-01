import { supabase } from '@/integrations/supabase/client';

export async function saveDecisionRDS(input: { 
  subject: string; 
  action: string; 
  reasons: string[] 
}) {
  const payload = {
    subject: input.subject, 
    action: input.action,
    reasons: input.reasons, 
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.functions.invoke('policy-eval', {
      body: payload
    });

    if (error) {
      console.error('Policy evaluation failed:', error);
      return { success: false, receipt_hash: null };
    }

    return { 
      success: true, 
      receipt_hash: data?.receipt_hash || null 
    };
  } catch (error) {
    console.error('Failed to save decision RDS:', error);
    return { success: false, receipt_hash: null };
  }
}