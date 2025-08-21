import { BaseRDS } from '@/features/healthcare/receipts';
import { coverageRules, safetyRules, type InsurancePlan, type Medication, type Allergy } from './rules';

export interface PARDS extends BaseRDS {
  type: 'PA-RDS';
  action: 'approve' | 'deny' | 'pend';
  procedure_cpt: string;
  diagnosis_icd: string;
  approved: boolean;
  reasons: string[];
  missingEvidence?: string[];
  safety_conflicts?: string[];
  coverage_details?: {
    covered: boolean;
    copay_amount?: number;
    requires_prior_auth?: boolean;
  };
  evidence_pack_hash?: string;
}

export interface PaPackFacts {
  patientAge: number;
  diagnoses: string[];
  medications: Medication[];
  allergies: Allergy[];
  priorTests: string[];
  symptoms: string[];
  procedure: {
    cpt: string;
    description: string;
    urgency: 'routine' | 'urgent' | 'emergent';
  };
  plan: InsurancePlan;
}

export interface PaEvidencePack {
  docIds: string[];
  hash: string;
  summary: {
    patientProfile: string;
    clinicalIndication: string;
    supportingEvidence: string[];
  };
}

export interface PaGateResult {
  approved: boolean;
  reasons: string[];
  missingEvidence?: string[];
  safetyConflicts?: string[];
  coverageDetails?: {
    covered: boolean;
    copayAmount?: number;
    requiresPriorAuth?: boolean;
  };
}

/**
 * Creates a hash of inputs without storing PHI
 */
function hashInputs(inputs: Record<string, unknown>): string {
  // Remove any potential PHI fields before hashing
  const sanitized = { ...inputs };
  delete sanitized.name;
  delete sanitized.ssn;
  delete sanitized.dob;
  delete sanitized.address;
  delete sanitized.phone;
  delete sanitized.email;
  delete sanitized.patientName;
  
  // Hash the sanitized inputs
  const inputString = JSON.stringify(sanitized, Object.keys(sanitized).sort());
  return btoa(inputString).substring(0, 16);
}

/**
 * Build PA evidence pack from clinical facts
 */
export function buildPaPack(facts: PaPackFacts): PaEvidencePack {
  console.info('pa.pack.build', {
    procedureCpt: facts.procedure.cpt,
    diagnosesCount: facts.diagnoses.length,
    medicationsCount: facts.medications.length,
    priorTestsCount: facts.priorTests.length,
    urgency: facts.procedure.urgency
  });

  // Generate document IDs based on clinical needs (no PHI)
  const docIds: string[] = [];
  
  // Always include patient summary and current medications
  docIds.push('doc:patient_summary');
  docIds.push('doc:current_medications');
  
  // Add diagnosis-specific documentation
  if (facts.diagnoses.length > 0) {
    docIds.push('doc:diagnostic_reports');
  }
  
  // Add prior test results if available
  if (facts.priorTests.length > 0) {
    docIds.push('doc:prior_test_results');
  }
  
  // Add procedure-specific requirements
  const procedureSpecificDocs = getProcedureSpecificDocs(facts.procedure.cpt);
  docIds.push(...procedureSpecificDocs);
  
  // Generate content hash (no PHI)
  const packContent = {
    procedure_cpt: facts.procedure.cpt,
    diagnoses_count: facts.diagnoses.length,
    medications_count: facts.medications.length,
    prior_tests_count: facts.priorTests.length,
    urgency: facts.procedure.urgency,
    doc_ids: docIds
  };
  
  const hash = hashInputs(packContent);
  
  return {
    docIds,
    hash,
    summary: {
      patientProfile: `Age ${facts.patientAge}, ${facts.diagnoses.length} active diagnoses, ${facts.medications.length} medications`,
      clinicalIndication: facts.procedure.description,
      supportingEvidence: docIds.map(id => id.replace('doc:', '').replace('_', ' '))
    }
  };
}

/**
 * Gate PA request and return approval decision
 */
export function gatePaRequest(facts: PaPackFacts): PaGateResult {
  console.info('pa.gate.evaluate', {
    procedureCpt: facts.procedure.cpt,
    planType: facts.plan.type,
    urgency: facts.procedure.urgency
  });

  // Check coverage rules
  const coverageResult = coverageRules(
    facts.plan,
    facts.procedure.cpt,
    facts.diagnoses[0] || ''
  );

  // Check safety rules
  const safetyResult = safetyRules(
    facts.medications,
    facts.allergies,
    {
      cpt: facts.procedure.cpt,
      medications: getProtocolMedications(facts.procedure.cpt),
      contrast: requiresContrast(facts.procedure.cpt)
    }
  );

  const reasons: string[] = [];
  const missingEvidence: string[] = [];

  // Coverage evaluation
  if (!coverageResult.covered) {
    reasons.push(coverageResult.reason || 'Service not covered');
    return {
      approved: false,
      reasons,
      coverageDetails: {
        covered: false
      }
    };
  }

  // Safety evaluation
  if (!safetyResult.ok) {
    reasons.push('Safety conflicts identified');
    return {
      approved: false,
      reasons,
      safetyConflicts: safetyResult.conflicts,
      coverageDetails: {
        covered: coverageResult.covered,
        copayAmount: coverageResult.copayAmount,
        requiresPriorAuth: coverageResult.requiresPriorAuth
      }
    };
  }

  // Evidence requirements check
  const requiredEvidence = getRequiredEvidence(facts.procedure.cpt, facts.diagnoses);
  const missingDocs = findMissingEvidence(facts, requiredEvidence);
  
  if (missingDocs.length > 0) {
    reasons.push('Insufficient documentation');
    missingEvidence.push(...missingDocs);
    
    return {
      approved: false,
      reasons,
      missingEvidence,
      coverageDetails: {
        covered: coverageResult.covered,
        copayAmount: coverageResult.copayAmount,
        requiresPriorAuth: coverageResult.requiresPriorAuth
      }
    };
  }

  // Safety warnings (but still approved)
  if (safetyResult.warnings) {
    reasons.push('Approved with safety precautions');
  } else {
    reasons.push('All criteria met - approved');
  }

  return {
    approved: true,
    reasons,
    coverageDetails: {
      covered: coverageResult.covered,
      copayAmount: coverageResult.copayAmount,
      requiresPriorAuth: coverageResult.requiresPriorAuth
    }
  };
}

/**
 * Record PA decision as PA-RDS receipt
 */
export function recordPARDS(
  facts: PaPackFacts,
  gateResult: PaGateResult,
  evidencePackHash?: string
): PARDS {
  const receipt: PARDS = {
    type: 'PA-RDS',
    action: gateResult.approved ? 'approve' : 'deny',
    procedure_cpt: facts.procedure.cpt,
    diagnosis_icd: facts.diagnoses[0] || '',
    approved: gateResult.approved,
    reasons: gateResult.reasons,
    inputs_hash: hashInputs({
      procedure_cpt: facts.procedure.cpt,
      diagnoses: facts.diagnoses.length,
      plan_type: facts.plan.type,
      urgency: facts.procedure.urgency
    }),
    policy_version: 'PA-2025.08',
    ts: new Date().toISOString()
  };

  if (gateResult.missingEvidence) {
    receipt.missingEvidence = gateResult.missingEvidence;
  }

  if (gateResult.safetyConflicts) {
    receipt.safety_conflicts = gateResult.safetyConflicts;
  }

  if (gateResult.coverageDetails) {
    receipt.coverage_details = {
      covered: gateResult.coverageDetails.covered,
      copay_amount: gateResult.coverageDetails.copayAmount,
      requires_prior_auth: gateResult.coverageDetails.requiresPriorAuth
    };
  }

  if (evidencePackHash) {
    receipt.evidence_pack_hash = evidencePackHash;
  }

  console.info('receipt.recorded', {
    type: 'PA-RDS',
    action: receipt.action,
    approved: receipt.approved,
    reasonsCount: receipt.reasons.length,
    hasMissingEvidence: !!receipt.missingEvidence,
    hasSafetyConflicts: !!receipt.safety_conflicts
  });

  return receipt;
}

/**
 * Get procedure-specific documentation requirements
 */
function getProcedureSpecificDocs(cpt: string): string[] {
  const procedureDocs: Record<string, string[]> = {
    // MRI procedures
    '70551': ['doc:prior_imaging', 'doc:neurological_exam'],
    '70552': ['doc:prior_imaging', 'doc:neurological_exam'],
    '72148': ['doc:prior_xray', 'doc:physical_therapy_notes'],
    '73721': ['doc:prior_xray', 'doc:orthopedic_exam'],
    
    // Cardiac procedures
    '78452': ['doc:stress_test', 'doc:ekg', 'doc:echo_results'],
    '93306': ['doc:clinical_indication', 'doc:prior_echo'],
    
    // GI procedures
    '45378': ['doc:last_colonoscopy', 'doc:family_history'],
    '45380': ['doc:biopsy_results', 'doc:pathology_report'],
    
    // Surgical procedures
    '47562': ['doc:imaging_studies', 'doc:surgical_clearance'],
    '64483': ['doc:conservative_treatment', 'doc:pain_assessment']
  };

  return procedureDocs[cpt] || ['doc:clinical_notes'];
}

/**
 * Get required evidence based on procedure and diagnoses
 */
function getRequiredEvidence(cpt: string, diagnoses: string[]): string[] {
  const required = ['Clinical documentation'];
  
  // High-cost procedures require more evidence
  const highCostProcedures = ['70551', '70552', '78452', '93306'];
  if (highCostProcedures.includes(cpt)) {
    required.push('Prior conservative treatment documentation');
    required.push('Imaging studies (if applicable)');
  }
  
  // Cancer-related diagnoses
  if (diagnoses.some(d => d.includes('C') && d.length === 6)) {
    required.push('Oncology consultation notes');
    required.push('Staging documentation');
  }
  
  return required;
}

/**
 * Find missing evidence in the current facts
 */
function findMissingEvidence(facts: PaPackFacts, required: string[]): string[] {
  const missing: string[] = [];
  
  // Simple evidence checking (in real system, would check actual documents)
  if (required.includes('Prior conservative treatment documentation') && facts.priorTests.length === 0) {
    missing.push('Documentation of prior conservative treatment attempts');
  }
  
  if (required.includes('Imaging studies (if applicable)') && !facts.priorTests.some(test => test.includes('imaging'))) {
    missing.push('Recent imaging studies');
  }
  
  if (required.includes('Clinical documentation') && facts.symptoms.length === 0) {
    missing.push('Detailed clinical assessment and symptoms documentation');
  }
  
  if (required.includes('Oncology consultation notes') && !facts.priorTests.some(test => test.includes('oncology'))) {
    missing.push('Oncology specialist consultation');
  }
  
  return missing;
}

/**
 * Get medications used in specific procedures
 */
function getProtocolMedications(cpt: string): string[] {
  const protocolMeds: Record<string, string[]> = {
    '45378': ['propofol', 'midazolam'], // Colonoscopy
    '93306': ['contrast media'], // Echo with contrast
    '78452': ['adenosine', 'regadenoson'], // Nuclear stress test
    '70552': ['gadolinium'] // Brain MRI with contrast
  };
  
  return protocolMeds[cpt] || [];
}

/**
 * Check if procedure requires contrast
 */
function requiresContrast(cpt: string): boolean {
  const contrastProcedures = ['70552', '70553', '93306', '78452'];
  return contrastProcedures.includes(cpt);
}