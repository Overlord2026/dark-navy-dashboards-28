/**
 * Trust rails receipt management service
 * Handles RDS creation, anchoring, and verification
 */

import { supabase } from '@/integrations/supabase/client';
import { inputs_hash } from '@/lib/canonical';

export interface RDS {
  type: string;
  ts: string;
  inputs_hash?: string;
  policy_version?: string;
  [key: string]: any;
}

export interface AnchorRef {
  anchor_type: 'blockchain' | 'timestamping' | 'notarization';
  anchor_id: string;
  anchor_timestamp: string;
  transaction_hash?: string;
  block_number?: number;
  network?: string;
  merkle_root?: string;
  batch_size?: number;
}

/**
 * Records an RDS receipt with content-free structure
 * NEVER stores PII/PHI - only hashes and metadata
 */
export async function recordReceipt(rds: RDS): Promise<string> {
  // Ensure required fields
  if (!rds.type) throw new Error('RDS type is required');
  if (!rds.ts) rds.ts = new Date().toISOString();
  if (!rds.policy_version) rds.policy_version = 'v1.0';
  
  // Generate inputs hash if not provided
  if (!rds.inputs_hash) {
    const { ts, type, policy_version, ...inputs } = rds;
    rds.inputs_hash = await inputs_hash(inputs);
  }

  try {
    // Store in domain_events table for audit trail
    const { data, error } = await supabase
      .from('domain_events')
      .insert({
        event_type: rds.type,
        event_data: {
          inputs_hash: rds.inputs_hash,
          policy_version: rds.policy_version,
          timestamp: rds.ts
        },
        aggregate_id: `receipt_${Date.now()}`,
        aggregate_type: 'receipt',
        event_hash: rds.inputs_hash || '',
        sequence_number: 1,
        metadata: {
          content_free: true,
          trust_rail: 'rds'
        }
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Receipt recording failed:', error);
    throw error;
  }
}

/**
 * Anchors a single receipt
 */
export async function anchorSingle(receiptId: string): Promise<AnchorRef> {
  try {
    const { data, error } = await supabase.functions.invoke('nil-anchor-resolver', {
      body: {
        receiptIds: [receiptId],
        anchorType: 'timestamping',
        priority: 'normal'
      }
    });

    if (error) throw error;
    return data.anchor_ref;
  } catch (error) {
    console.error('Single anchor failed:', error);
    throw error;
  }
}

/**
 * Anchors receipts in batch since a given timestamp
 */
export async function anchorBatch(options: { sinceIso?: string } = {}): Promise<AnchorRef> {
  try {
    // Get unanchored receipts
    let query = supabase
      .from('domain_events')
      .select('id')
      .eq('aggregate_type', 'receipt')
      .is('anchor_ref', null);

    if (options.sinceIso) {
      query = query.gte('occurred_at', options.sinceIso);
    }

    const { data: receipts, error: fetchError } = await query.limit(100);
    if (fetchError) throw fetchError;

    if (!receipts?.length) {
      throw new Error('No receipts to anchor');
    }

    const receiptIds = receipts.map(r => r.id);

    const { data, error } = await supabase.functions.invoke('nil-anchor-resolver', {
      body: {
        receiptIds,
        anchorType: 'blockchain',
        priority: 'high'
      }
    });

    if (error) throw error;
    return data.anchor_ref;
  } catch (error) {
    console.error('Batch anchor failed:', error);
    throw error;
  }
}

/**
 * Replay verification - deterministically recompute and compare
 */
export async function replayVerify(kind: string, id: string): Promise<boolean> {
  try {
    const { data: event, error } = await supabase
      .from('domain_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Recompute hash from stored event data
    const recomputedHash = await inputs_hash(event.event_data);
    
    // Compare with stored hash
    const eventData = event.event_data as any;
    const storedHash = eventData?.inputs_hash;
    return recomputedHash === storedHash;
  } catch (error) {
    console.error('Replay verification failed:', error);
    return false;
  }
}

/**
 * Writes an Audit-RDS with merkle root and previous audit hash chain
 */
export async function writeAuditRDS(merkleRoot: string, prevAuditHash?: string): Promise<string> {
  const auditRDS: RDS = {
    type: 'Audit-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    merkle_root: merkleRoot,
    prev_audit_hash: prevAuditHash || null
  };

  return await recordReceipt(auditRDS);
}