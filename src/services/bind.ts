/**
 * Insurance Binding Service
 * Handles policy binding with e-sign stub and Vault integration
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt, anchorSingle } from './receipts';
import * as Canonical from '@/lib/canonical';

export interface BindingChecklist {
  identity_verified: boolean;
  payment_method_confirmed: boolean;
  disclosures_accepted: boolean;
  application_signed: boolean;
  underwriting_approved: boolean;
}

export interface PolicyBinding {
  id: string;
  quote_id: string;
  policy_number: string;
  effective_date: string;
  status: 'pending' | 'bound' | 'rejected';
  checklist: BindingChecklist;
  documents: {
    application_url?: string;
    policy_documents_url?: string;
    payment_confirmation_url?: string;
  };
  bound_at?: string;
}

/**
 * Initialize binding process
 */
export async function initializeBinding(quoteId: string): Promise<PolicyBinding> {
  const policyNumber = generatePolicyNumber();
  
  const binding: PolicyBinding = {
    id: crypto.randomUUID(),
    quote_id: quoteId,
    policy_number: policyNumber,
    effective_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    checklist: {
      identity_verified: false,
      payment_method_confirmed: false,
      disclosures_accepted: false,
      application_signed: false,
      underwriting_approved: false
    },
    documents: {}
  };

  const { error } = await supabase
    .from('insurance_bindings' as any)
    .insert({
      id: binding.id,
      quote_id: quoteId,
      policy_number: policyNumber,
      effective_date: binding.effective_date,
      status: 'pending',
      checklist: binding.checklist,
      documents: binding.documents
    });

  if (error) throw error;

  return binding;
}

/**
 * Update binding checklist item
 */
export async function updateChecklistItem(
  bindingId: string, 
  item: keyof BindingChecklist, 
  completed: boolean,
  documentUrl?: string
): Promise<void> {
  // Get current binding
  const { data: binding, error: fetchError } = await supabase
    .from('insurance_bindings' as any)
    .select('*')
    .eq('id', bindingId)
    .single();

  if (fetchError || !binding) throw new Error('Binding not found');

  // Update checklist
  const updatedChecklist = { ...(binding as any).checklist, [item]: completed };
  const updatedDocuments = { ...(binding as any).documents };
  
  // Store document URL if provided
  if (documentUrl) {
    switch (item) {
      case 'application_signed':
        updatedDocuments.application_url = documentUrl;
        break;
      case 'payment_method_confirmed':
        updatedDocuments.payment_confirmation_url = documentUrl;
        break;
    }
  }

  await supabase
    .from('insurance_bindings' as any)
    .update({
      checklist: updatedChecklist,
      documents: updatedDocuments
    })
    .eq('id', bindingId);

  // Check if all items are complete
  const allComplete = Object.values(updatedChecklist).every(Boolean);
  if (allComplete) {
    await completeBind(bindingId);
  }
}

/**
 * Complete the binding process
 */
export async function completeBind(bindingId: string): Promise<void> {
  const boundAt = new Date().toISOString();
  
  // Update binding status
  const { data: binding, error } = await supabase
    .from('insurance_bindings' as any)
    .update({ 
      status: 'bound', 
      bound_at: boundAt 
    })
    .eq('id', bindingId)
    .select('*')
    .single();

  if (error || !binding) throw error;

  // Update quote status
  await supabase
    .from('insurance_quotes' as any)
    .update({ status: 'bound' })
    .eq('id', (binding as any).quote_id);

  // Generate policy documents (stub)
  const policyDocsUrl = await generatePolicyDocuments(binding);
  await supabase
    .from('insurance_bindings' as any)
    .update({
      documents: {
        ...(binding as any).documents,
        policy_documents_url: policyDocsUrl
      }
    })
    .eq('id', bindingId);

  // Record Bind-RDS
  const bindHash = await Canonical.inputs_hash({
    binding_id: bindingId,
    policy_number: (binding as any).policy_number,
    quote_id: (binding as any).quote_id,
    effective_date: (binding as any).effective_date,
    bound_at: boundAt
  });

  const receiptId = await recordReceipt({
    type: 'Bind-RDS',
    ts: boundAt,
    policy_version: 'v1.0',
    binding_id: bindingId,
    policy_number: (binding as any).policy_number,
    bind_hash: bindHash,
    premium_band: (binding as any).insurance_quotes?.premium_band || 'unknown'
  });

  // Optional anchor single on bind
  try {
    await anchorSingle(receiptId);
  } catch (anchorError) {
    console.warn('Failed to anchor bind receipt:', anchorError);
    // Continue - anchoring is optional
  }

  // Record Payment-RDS (stub)
  await recordReceipt({
    type: 'Payment-RDS',
    ts: boundAt,
    policy_version: 'v1.0',
    binding_id: bindingId,
    policy_number: (binding as any).policy_number,
    payment_type: 'initial_premium',
    amount_band: (binding as any).insurance_quotes?.premium_band || 'unknown'
  });
}

/**
 * E-sign stub implementation
 */
export async function initiateESign(bindingId: string, signerEmail: string): Promise<string> {
  // In real implementation, this would integrate with DocuSign, HelloSign, etc.
  // For now, return a stub URL
  const esignUrl = `https://esign-stub.example.com/sign/${bindingId}?email=${encodeURIComponent(signerEmail)}`;
  
  // Record e-sign initiation
  await recordReceipt({
    type: 'ESign-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    binding_id: bindingId,
    action: 'initiated',
    signer_email_hash: await Canonical.inputs_hash({ email: signerEmail })
  });
  
  return esignUrl;
}

/**
 * Generate policy documents (stub)
 */
async function generatePolicyDocuments(binding: any): Promise<string> {
  // In real implementation, this would generate actual policy docs
  // For now, return a placeholder URL that would go to Vault
  return `vault://policies/${binding.policy_number}/documents.pdf`;
}

/**
 * Generate policy number
 */
function generatePolicyNumber(): string {
  const prefix = 'POL';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Get binding by ID
 */
export async function getBinding(id: string): Promise<PolicyBinding | null> {
  const { data, error } = await supabase
    .from('insurance_bindings' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  
  return {
    id: (data as any).id,
    quote_id: (data as any).quote_id,
    policy_number: (data as any).policy_number,
    effective_date: (data as any).effective_date,
    status: (data as any).status,
    checklist: (data as any).checklist,
    documents: (data as any).documents,
    bound_at: (data as any).bound_at
  };
}