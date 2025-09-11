/**
 * Attestation service for scheduled jobs and automation
 * Wraps job execution with trust rail attestation
 */

import { recordReceipt, RDS } from './receipts';
import * as Canonical from '@/lib/canonical';

export interface JobMetrics {
  start_time: number;
  end_time: number;
  duration_ms: number;
  memory_usage?: number;
  cpu_usage?: number;
  error?: string;
  success: boolean;
}

export interface AttestationResult<T = any> {
  result: T;
  attestation_id: string;
  metrics: JobMetrics;
}

/**
 * Wraps a function execution with attestation tracking
 * Emits Attestation-RDS with runtime measurements
 */
export async function withAttestation<T>(
  jobName: string,
  fn: () => Promise<T> | T,
  metadata: Record<string, any> = {}
): Promise<AttestationResult<T>> {
  const startTime = Date.now();
  const startMemory = typeof process !== 'undefined' ? process.memoryUsage?.()?.heapUsed : undefined;
  
  let result: T;
  let error: string | undefined;
  let success = false;

  try {
    result = await fn();
    success = true;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    throw err; // Re-throw to maintain original behavior
  } finally {
    const endTime = Date.now();
    const endMemory = typeof process !== 'undefined' ? process.memoryUsage?.()?.heapUsed : undefined;
    
    const metrics: JobMetrics = {
      start_time: startTime,
      end_time: endTime,
      duration_ms: endTime - startTime,
      success,
      error
    };

    if (startMemory && endMemory) {
      metrics.memory_usage = endMemory - startMemory;
    }

    // Create runtime measurement hash for attestation
    const runtimeData = {
      job_name: jobName,
      metrics,
      metadata,
      node_version: typeof process !== 'undefined' ? process.version : 'browser',
      timestamp: new Date().toISOString()
    };

    const runtimeMeasHash = await Canonical.inputs_hash(runtimeData);

    // Emit Attestation-RDS
    const attestationRDS: RDS = {
      type: 'Attestation-RDS',
      ts: new Date().toISOString(),
      policy_version: 'v1.0',
      job_name: jobName,
      runtime_meas_hash: runtimeMeasHash,
      success,
      duration_ms: metrics.duration_ms
    };

    const attestationId = await recordReceipt(attestationRDS);

    return {
      result: result!,
      attestation_id: attestationId,
      metrics
    };
  }
}

/**
 * Simple attestation for fire-and-forget jobs
 */
export async function attestJob(
  jobName: string,
  fn: () => Promise<void> | void,
  metadata: Record<string, any> = {}
): Promise<string> {
  const { attestation_id } = await withAttestation(jobName, fn, metadata);
  return attestation_id;
}

/**
 * Batch attestation for multiple jobs
 */
export async function attestBatch(
  jobs: Array<{ name: string; fn: () => Promise<any> | any; metadata?: Record<string, any> }>
): Promise<Array<{ name: string; attestation_id: string; success: boolean }>> {
  const results = [];
  
  for (const job of jobs) {
    try {
      const { attestation_id } = await withAttestation(job.name, job.fn, job.metadata);
      results.push({ name: job.name, attestation_id, success: true });
    } catch (error) {
      // Continue with other jobs even if one fails
      console.error(`Job ${job.name} failed:`, error);
      results.push({ name: job.name, attestation_id: '', success: false });
    }
  }
  
  return results;
}