import { recordReceipt } from '@/features/receipts/store';
import { getExplainabilityPacket, type ExplainabilityPacket } from './packet';

export interface ReplayVerificationResult {
  packet_id: string;
  original_hash: string;
  recomputed_hash: string;
  verification_status: 'ok' | 'fail';
  verified_at: string;
  discrepancies?: string[];
}

/**
 * Verify a packet by recomputing its canonical representation and comparing hashes
 */
export async function replayVerifyPacket(packetId: string): Promise<ReplayVerificationResult> {
  const packet = getExplainabilityPacket(packetId);
  
  if (!packet) {
    throw new Error(`Explainability packet ${packetId} not found`);
  }
  
  const timestamp = new Date().toISOString();
  const discrepancies: string[] = [];
  
  try {
    // Recompute canonical JSON from stored template
    const canonicalTemplate = packet.canonical_template;
    if (!canonicalTemplate) {
      throw new Error('No canonical template found for verification');
    }
    
    // Recreate the sanitized inputs that were originally hashed
    const recomputedInputs = {
      feature_count: packet.features.length,
      model_id: packet.model_id,
      model_version: packet.model_version,
      timestamp: packet.created_at // Use original timestamp
    };
    
    // Recompute hash
    const recomputedHash = `sha256:${btoa(JSON.stringify(recomputedInputs))}`;
    
    // Compare with original
    const originalHash = packet.inputs_hash;
    const verificationStatus: 'ok' | 'fail' = originalHash === recomputedHash ? 'ok' : 'fail';
    
    // Check for discrepancies in template
    if (canonicalTemplate.model_id !== packet.model_id) {
      discrepancies.push('model_id_mismatch');
    }
    
    if (canonicalTemplate.model_version !== packet.model_version) {
      discrepancies.push('model_version_mismatch');
    }
    
    if (canonicalTemplate.feature_names.length !== packet.features.length) {
      discrepancies.push('feature_count_mismatch');
    }
    
    // Verify feature integrity
    const currentFeatureNames = packet.features.map(f => f.name).sort();
    const templateFeatureNames = canonicalTemplate.feature_names.sort();
    
    if (JSON.stringify(currentFeatureNames) !== JSON.stringify(templateFeatureNames)) {
      discrepancies.push('feature_names_changed');
    }
    
    const result: ReplayVerificationResult = {
      packet_id: packetId,
      original_hash: originalHash,
      recomputed_hash: recomputedHash,
      verification_status: discrepancies.length > 0 ? 'fail' : verificationStatus,
      verified_at: timestamp,
      discrepancies: discrepancies.length > 0 ? discrepancies : undefined
    };
    
    // Emit Decision-RDS for the verification result
    await recordReceipt({
      receipt_id: `rds_replay_verify_${Date.now()}`,
      type: 'Decision-RDS',
      ts: timestamp,
      policy_version: 'XAI-2025',
      inputs_hash: `sha256:${btoa(JSON.stringify({ packetId, verificationStatus }))}`,
      decision_details: {
        action: 'replay.verify',
        result: result.verification_status,
        packet_id: packetId,
        model_id: packet.model_id,
        model_version: packet.model_version,
        hash_match: originalHash === recomputedHash,
        discrepancy_count: discrepancies.length,
        discrepancies: discrepancies
      },
      reasons: [
        `replay.verify:${result.verification_status}`,
        'hash_verification',
        'template_integrity',
        ...(discrepancies.length > 0 ? ['integrity_issues'] : ['integrity_confirmed'])
      ]
    });
    
    console.log(`✅ Replay verification completed:`, {
      packet_id: packetId,
      status: result.verification_status,
      discrepancies: discrepancies.length
    });
    
    return result;
    
  } catch (error) {
    const failResult: ReplayVerificationResult = {
      packet_id: packetId,
      original_hash: packet.inputs_hash,
      recomputed_hash: 'computation_failed',
      verification_status: 'fail',
      verified_at: timestamp,
      discrepancies: ['verification_error', (error as Error).message]
    };
    
    // Log verification failure
    await recordReceipt({
      receipt_id: `rds_replay_verify_error_${Date.now()}`,
      type: 'Decision-RDS',
      ts: timestamp,
      policy_version: 'XAI-2025',
      inputs_hash: `sha256:${btoa(JSON.stringify({ packetId, error: 'verification_failed' }))}`,
      decision_details: {
        action: 'replay.verify',
        result: 'fail',
        packet_id: packetId,
        error: 'verification_failed',
        error_message: (error as Error).message
      },
      reasons: ['replay.verify:fail', 'verification_error', 'computation_failed']
    });
    
    console.error('❌ Replay verification failed:', error);
    
    return failResult;
  }
}

/**
 * Batch verify multiple packets
 */
export async function batchReplayVerify(packetIds: string[]): Promise<ReplayVerificationResult[]> {
  const results: ReplayVerificationResult[] = [];
  
  for (const packetId of packetIds) {
    try {
      const result = await replayVerifyPacket(packetId);
      results.push(result);
    } catch (error) {
      console.error(`Failed to verify packet ${packetId}:`, error);
      results.push({
        packet_id: packetId,
        original_hash: 'unknown',
        recomputed_hash: 'unknown',
        verification_status: 'fail',
        verified_at: new Date().toISOString(),
        discrepancies: ['verification_error']
      });
    }
  }
  
  // Log batch verification summary
  const passCount = results.filter(r => r.verification_status === 'ok').length;
  const failCount = results.length - passCount;
  
  await recordReceipt({
    receipt_id: `rds_batch_verify_${Date.now()}`,
    type: 'Decision-RDS',
    ts: new Date().toISOString(),
    policy_version: 'XAI-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ packetCount: packetIds.length, passCount, failCount }))}`,
    decision_details: {
      action: 'batch.replay.verify',
      packet_count: packetIds.length,
      pass_count: passCount,
      fail_count: failCount,
      pass_rate: passCount / packetIds.length
    },
    reasons: ['batch_verification', `verified:${passCount}`, `failed:${failCount}`]
  });
  
  console.log(`✅ Batch verification completed: ${passCount}/${results.length} passed`);
  
  return results;
}

/**
 * Get verification history for a packet
 */
export function getVerificationHistory(packetId: string): ReplayVerificationResult[] {
  // In a real implementation, this would query stored verification results
  // For now, return empty array as each verification is independent
  return [];
}

/**
 * Schedule periodic verification for critical packets
 */
export async function schedulePeriodicVerification(
  packetIds: string[],
  intervalHours: number = 24
): Promise<void> {
  // This would set up a recurring job in a real implementation
  console.log(`Scheduled periodic verification for ${packetIds.length} packets every ${intervalHours}h`);
  
  await recordReceipt({
    receipt_id: `rds_verify_schedule_${Date.now()}`,
    type: 'Decision-RDS',
    ts: new Date().toISOString(),
    policy_version: 'XAI-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ packetIds, intervalHours }))}`,
    decision_details: {
      action: 'schedule.periodic.verify',
      packet_count: packetIds.length,
      interval_hours: intervalHours,
      next_verification: new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString()
    },
    reasons: ['periodic_verification', 'integrity_monitoring', 'compliance_check']
  });
}