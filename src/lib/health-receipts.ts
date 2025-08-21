import { supabase } from '@/integrations/supabase/client';
import { HealthRDSReceipt, createHealthRDSReceipt } from '@/types/health-rds';

// Store Health-RDS receipt using the edge function
export async function storeHealthRDSReceipt(receipt: HealthRDSReceipt, userId?: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('store-receipt', {
      body: {
        receipt,
        user_id: userId
      }
    });

    if (error) {
      console.error('Error storing Health-RDS receipt:', error);
      throw new Error(`Failed to store receipt: ${error.message}`);
    }

    return data.receipt_id;
  } catch (error) {
    console.error('Store receipt API error:', error);
    throw error;
  }
}

// Get user's health receipts with privacy protection
export async function getUserHealthReceipts(options: {
  limit?: number;
  offset?: number;
  action?: string;
  result?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  try {
    const { data, error } = await supabase.rpc('get_health_receipts', {
      p_limit: options.limit || 50,
      p_offset: options.offset || 0,
      p_action: options.action || null,
      p_result: options.result || null,
      p_start_date: options.startDate || null,
      p_end_date: options.endDate || null
    });

    if (error) {
      console.error('Error fetching health receipts:', error);
      throw new Error(`Failed to fetch receipts: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get health receipts API error:', error);
    throw error;
  }
}

// Create and store a new Health-RDS receipt
export async function createAndStoreHealthReceipt(
  persona: HealthRDSReceipt['persona'],
  householdId: string,
  context: any,
  outcome: any,
  routeEntries: any[],
  linkedMaterials?: string[],
  signers?: string[]
): Promise<{ receipt: HealthRDSReceipt; receiptId: string }> {
  
  // Create standardized receipt
  const receipt = createHealthRDSReceipt(
    persona,
    householdId,
    context,
    outcome,
    routeEntries,
    linkedMaterials,
    signers
  );

  // Store the receipt
  const receiptId = await storeHealthRDSReceipt(receipt, signers?.[0]);

  console.log('Enhanced Health-RDS receipt with ZKP created and stored:', {
    persona: receipt.persona,
    decision: receipt.outcome.decision,
    zkp_network: receipt.context.network_zkp?.proof_id,
    zkp_eligibility: receipt.context.eligibility_zkp?.proof_id,
    receiptId,
    timestamp: receipt.created_ts
  });

  return { receipt, receiptId };
}