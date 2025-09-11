// Healthcare demo fixtures - PA → Appeal → Approve flow
import * as Canonical from '@/lib/canonical';

export const HEALTHCARE_DEMO_DATA = {
  patient: {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Jennifer Smith',
    age: 52,
    plan: 'Blue Cross Premier',
    member_id: 'BC123456789',
    group_id: 'EMP001',
    primary_care_physician: 'Dr. Sarah Johnson'
  },

  priorAuth: {
    id: 'pa_001',
    type: 'medication',
    medication: 'Humira (adalimumab)',
    indication: 'Rheumatoid Arthritis',
    prescribing_physician: 'Dr. Michael Chen - Rheumatology',
    submitted_date: '2024-09-01',
    status: 'initially_denied',
    denial_reason: 'Insufficient trial of conventional DMARDs',
    required_documentation: [
      'Trial and failure of methotrexate (minimum 3 months)',
      'Trial and failure of sulfasalazine (minimum 3 months)', 
      'Current disease activity scores',
      'Contraindications to conventional therapy'
    ]
  },

  appeal: {
    id: 'appeal_001',
    pa_id: 'pa_001',
    submitted_date: '2024-09-10',
    type: 'peer_to_peer',
    status: 'approved',
    approval_date: '2024-09-12',
    reviewing_physician: 'Dr. Lisa Wang - Medical Director',
    additional_documentation: [
      'MTX trial documentation (4 months - discontinued due to liver enzymes)',
      'SSZ trial documentation (6 months - inadequate response)',
      'Current DAS28 score: 5.8 (high disease activity)',
      'Patient unable to tolerate leflunomide due to GI issues'
    ]
  },

  approvedAuth: {
    id: 'auth_001',
    pa_id: 'pa_001',
    appeal_id: 'appeal_001',
    status: 'approved',
    effective_date: '2024-09-15',
    expiration_date: '2024-12-15',
    approved_quantity: '2 pre-filled pens per month',
    approved_duration: '3 months with option to renew',
    conditions: [
      'Continue monitoring liver function monthly',
      'TB screening completed and negative',
      'Patient education on injection technique completed'
    ]
  }
};

export async function loadHealthcareFixtures() {
  console.info('[fixtures.healthcare] Loading healthcare demo fixtures');
  
  const { patient, priorAuth, appeal, approvedAuth } = HEALTHCARE_DEMO_DATA;
  
  // Generate receipt for PA submission
  const paSubmissionReceipt = {
    id: `pa_submission_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'prior_auth_review',
    policy_version: 'HC-2024.09',
    inputs_hash: await Canonical.hash({ 
      patient_id: patient.id,
      medication: priorAuth.medication,
      indication: priorAuth.indication,
      physician: priorAuth.prescribing_physician
    }),
    reasons: ['INSUFFICIENT_CONVENTIONAL_TRIAL'],
    result: 'deny',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date('2024-09-01T10:00:00Z').toISOString()
    },
    ts: new Date('2024-09-01T10:00:00Z').toISOString()
  };

  // Generate receipt for appeal submission
  const appealSubmissionReceipt = {
    id: `appeal_submission_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'appeal_review',
    policy_version: 'HC-2024.09',
    inputs_hash: await Canonical.hash({
      patient_id: patient.id,
      pa_id: priorAuth.id,
      appeal_type: appeal.type,
      additional_docs: appeal.additional_documentation
    }),
    reasons: ['CONVENTIONAL_THERAPY_FAILED', 'ADEQUATE_TRIAL_DOCUMENTED', 'HIGH_DISEASE_ACTIVITY'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date('2024-09-12T14:30:00Z').toISOString()
    },
    ts: new Date('2024-09-12T14:30:00Z').toISOString()
  };

  // Generate receipt for final approval
  const approvalReceipt = {
    id: `pa_approval_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'prior_auth_approval',
    policy_version: 'HC-2024.09', 
    inputs_hash: await Canonical.hash({
      patient_id: patient.id,
      pa_id: priorAuth.id,
      appeal_id: appeal.id,
      approved_therapy: approvedAuth.approved_quantity
    }),
    reasons: ['APPEAL_APPROVED', 'MEDICAL_NECESSITY_ESTABLISHED', 'SAFETY_CRITERIA_MET'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date('2024-09-15T09:00:00Z').toISOString()
    },
    ts: new Date('2024-09-15T09:00:00Z').toISOString()
  };

  return {
    ...HEALTHCARE_DEMO_DATA,
    receipts: [paSubmissionReceipt, appealSubmissionReceipt, approvalReceipt]
  };
}

export function getPatientInfo() {
  return HEALTHCARE_DEMO_DATA.patient;
}

export function getPriorAuthInfo() {
  return HEALTHCARE_DEMO_DATA.priorAuth;
}

export function getAppealInfo() {
  return HEALTHCARE_DEMO_DATA.appeal;
}

export function getApprovalInfo() {
  return HEALTHCARE_DEMO_DATA.approvedAuth;
}

// Simulate the PA → Appeal → Approve workflow
export function simulatePAWorkflow() {
  return {
    step1: 'PA Submitted → Initial Denial',
    step2: 'Appeal Submitted with Additional Documentation',
    step3: 'Peer-to-Peer Review Conducted',
    step4: 'Appeal Approved → Authorization Granted',
    timeline: '14 days total (1 day PA review + 2 days appeal + 3 days approval)',
    outcome: 'Patient can begin Humira therapy'
  };
}