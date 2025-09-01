import { supabase } from '@/integrations/supabase/client';

async function saveDecisionRDS(p: { subject: string; action: string; reasons: string[] }) {
  const res = await fetch('/functions/v1/policy-eval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  });
  if (!res.ok) return null;
  const { receipt_hash } = await res.json();
  return receipt_hash as string | null;
}

export type Inquiry = {
  pro_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  consent_tos: boolean;
};

export async function recordInquiry(i: Inquiry) {
  // 1) persist to database
  const { data, error } = await supabase
    .from('pro_inquiries')
    .insert({
      pro_id: i.pro_id,
      persona: 'marketplace', // Required field
      full_name: i.full_name,
      email: i.email,
      message: i.message ?? null,
      consent_tos: i.consent_tos
    })
    .select('id, pro_id, created_at')
    .single();
  
  if (error) throw error;

  // 2) record decision for audit trail
  let receiptHash: string | null = null;
  try {
    receiptHash = await saveDecisionRDS({
      subject: `inquiry:${data.id}`,
      action: 'create',
      reasons: ['consent:tos', 'marketplace:advisor']
    });
  } catch (decisionError) {
    console.warn('Decision recording failed:', decisionError);
    // Don't fail the entire operation if decision recording fails
  }

  // 3) send email via Edge function (Resend)
  try {
    const res = await fetch(`https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/resend-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pro_id: i.pro_id,
        full_name: i.full_name,
        email: i.email,
        phone: i.phone ?? '',
        message: i.message ?? ''
      })
    });
    
    if (!res.ok) {
      console.warn('resend-inquiry failed', await res.text());
    }
  } catch (emailError) {
    console.warn('Email delivery failed:', emailError);
    // Don't fail the entire operation if email fails
  }

  return { ...data, receiptHash };
}