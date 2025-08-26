import { recordReceipt } from '@/features/receipts/store';

export interface PARequest {
  id: string;
  procedure_code: string;
  diagnosis_code: string;
  provider_id: string;
  patient_id: string;
  status: 'pending' | 'approved' | 'denied' | 'appealed';
  denial_reasons?: string[];
  missing_evidence?: string[];
  created_at: string;
  updated_at: string;
}

export interface PADenial {
  pa_request_id: string;
  reason_codes: string[];
  missing_evidence: string[];
  appeal_deadline: string;
  denial_date: string;
}

export interface PAAppeal {
  id: string;
  pa_request_id: string;
  remedies: string[];
  additional_evidence: string[];
  submitted_at: string;
  status: 'pending' | 'approved' | 'denied';
}

// In-memory storage for demo
let PA_REQUESTS: Record<string, PARequest> = {};
let PA_DENIALS: Record<string, PADenial> = {};
let PA_APPEALS: Record<string, PAAppeal> = {};

/**
 * Submit a PA request that gets denied for demo purposes
 */
export async function submitPARequest(
  procedureCode: string,
  diagnosisCode: string,
  providerId: string,
  patientId: string
): Promise<{ pa_request: PARequest; denial: PADenial }> {
  
  const paId = `pa_${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  // Create PA request
  const paRequest: PARequest = {
    id: paId,
    procedure_code: procedureCode,
    diagnosis_code: diagnosisCode,
    provider_id: providerId,
    patient_id: patientId,
    status: 'denied',
    created_at: timestamp,
    updated_at: timestamp
  };
  
  // Create demo denial
  const denial: PADenial = {
    pa_request_id: paId,
    reason_codes: ['insufficient_documentation', 'medical_necessity_not_established'],
    missing_evidence: ['physician_note', 'diagnostic_results'],
    appeal_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    denial_date: timestamp
  };
  
  paRequest.denial_reasons = denial.reason_codes;
  paRequest.missing_evidence = denial.missing_evidence;
  
  // Store in memory
  PA_REQUESTS[paId] = paRequest;
  PA_DENIALS[paId] = denial;
  
  // Emit PA-RDS receipt
  await recordReceipt({
    receipt_id: `rds_pa_${Date.now()}`,
    type: 'PA-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ procedureCode, diagnosisCode, providerId }))}`,
    pa_details: {
      pa_request_id: paId,
      procedure_code: procedureCode,
      diagnosis_code: diagnosisCode,
      result: 'deny',
      missing_evidence: denial.missing_evidence,
      reason_codes: denial.reason_codes
    },
    reasons: ['pa_submitted', 'auto_deny_demo', 'missing_documentation']
  });
  
  console.log('✅ PA request submitted and denied:', paId);
  
  return { pa_request: paRequest, denial };
}

/**
 * Submit an appeal for a denied PA request
 */
export async function submitPAAppeal(
  paRequestId: string,
  remedies: string[],
  additionalEvidence: string[] = []
): Promise<{ appeal: PAAppeal; approved: boolean }> {
  
  const paRequest = PA_REQUESTS[paRequestId];
  const denial = PA_DENIALS[paRequestId];
  
  if (!paRequest || !denial) {
    throw new Error(`PA request ${paRequestId} not found`);
  }
  
  const appealId = `appeal_${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  // Create appeal
  const appeal: PAAppeal = {
    id: appealId,
    pa_request_id: paRequestId,
    remedies,
    additional_evidence: additionalEvidence,
    submitted_at: timestamp,
    status: 'approved' // Demo: appeals are auto-approved
  };
  
  PA_APPEALS[appealId] = appeal;
  
  // Update PA request status
  paRequest.status = 'appealed';
  paRequest.updated_at = timestamp;
  
  // Emit Delta-RDS for the appeal (references the original PA-RDS)
  await recordReceipt({
    receipt_id: `rds_delta_appeal_${Date.now()}`,
    type: 'Delta-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ paRequestId, remedies, additionalEvidence }))}`,
    delta_details: {
      prior_ref: `pa_${paRequestId}`,
      operation: 'appeal_submitted',
      remedies,
      additional_evidence: additionalEvidence,
      appeal_id: appealId
    },
    reasons: ['pa_appeal', 'remedy_provided', 'evidence_added']
  });
  
  // Emit Decision-RDS for the approval
  await recordReceipt({
    receipt_id: `rds_decision_appeal_${Date.now()}`,
    type: 'Decision-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ appealId, approved: true }))}`,
    decision_details: {
      appeal_id: appealId,
      pa_request_id: paRequestId,
      result: 'approve',
      decision_basis: 'appeal_cured'
    },
    reasons: ['appeal_cured', 'evidence_sufficient', 'medical_necessity_established']
  });
  
  console.log('✅ PA appeal submitted and approved:', appealId);
  
  return { appeal, approved: true };
}

/**
 * Get PA request by ID
 */
export function getPARequest(id: string): PARequest | null {
  return PA_REQUESTS[id] || null;
}

/**
 * Get PA denial by request ID
 */
export function getPADenial(paRequestId: string): PADenial | null {
  return PA_DENIALS[paRequestId] || null;
}

/**
 * Get PA appeal by ID
 */
export function getPAAppeal(id: string): PAAppeal | null {
  return PA_APPEALS[id] || null;
}

/**
 * List all PA requests
 */
export function listPARequests(): PARequest[] {
  return Object.values(PA_REQUESTS);
}

/**
 * List all PA appeals for a request
 */
export function listPAAppeals(paRequestId: string): PAAppeal[] {
  return Object.values(PA_APPEALS).filter(appeal => appeal.pa_request_id === paRequestId);
}