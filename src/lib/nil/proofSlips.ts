import { supabase } from '@/integrations/supabase/client';

export interface ProofSlip {
  id: string;
  type: 'training.complete' | 'disclosure.approve' | 'deal.approve' | 'payment.settle' | 'delta.change' | 'disclosure.ftc';
  entityId: string;
  entityType: 'athlete' | 'agent' | 'school' | 'brand';
  reasons: string[];
  metadata: Record<string, any>;
  timestamp: string;
  inputsHash: string;
  merkleLeaf: string;
  anchored: boolean;
  anchorTxId?: string;
}

export interface SmartCheckResult {
  passed: boolean;
  reasons: string[];
  score: number;
  details: Record<string, any>;
}

export class NILProofSystem {
  static async generateProofSlip(
    type: ProofSlip['type'],
    entityId: string,
    entityType: ProofSlip['entityType'],
    reasons: string[],
    metadata: Record<string, any> = {}
  ): Promise<ProofSlip> {
    const timestamp = new Date().toISOString();
    const inputs = {
      type,
      entityId,
      entityType,
      reasons,
      metadata,
      timestamp
    };
    
    const inputsHash = await this.generateHash(JSON.stringify(inputs));
    const merkleLeaf = await this.generateHash(`${inputsHash}-${timestamp}-${entityId}`);
    
    const proofSlip: ProofSlip = {
      id: crypto.randomUUID(),
      type,
      entityId,
      entityType,
      reasons,
      metadata,
      timestamp,
      inputsHash,
      merkleLeaf,
      anchored: false
    };

    // Store the proof slip
    await this.storeProofSlip(proofSlip);
    
    // Emit receipt via edge function
    try {
      const { data, error } = await supabase.functions.invoke('store-receipt', {
        body: {
          proofSlip,
          inputs,
          outcome: reasons.length > 0 ? 'APPROVED' : 'PENDING'
        }
      });
      
      if (error) {
        console.warn('Failed to store receipt:', error);
      }
    } catch (error) {
      console.warn('Receipt storage failed:', error);
    }

    return proofSlip;
  }

  static async runSmartChecks(
    entityId: string, 
    entityType: string, 
    checkType: string,
    context: Record<string, any> = {}
  ): Promise<SmartCheckResult> {
    const checks = await this.getChecksForType(checkType, entityType);
    let totalScore = 0;
    let passedChecks = 0;
    const reasons: string[] = [];
    const details: Record<string, any> = {};

    for (const check of checks) {
      const result = await this.executeCheck(check, entityId, context);
      details[check.name] = result;
      
      if (result.passed) {
        passedChecks++;
        totalScore += result.weight || 1;
        reasons.push(`${check.name}_PASS`);
      } else {
        reasons.push(`${check.name}_FAIL`);
      }
    }

    const finalScore = checks.length > 0 ? (totalScore / checks.length) * 100 : 0;
    const passed = passedChecks >= (checks.length * 0.8); // 80% pass rate required

    return {
      passed,
      reasons,
      score: finalScore,
      details
    };
  }

  private static async getChecksForType(checkType: string, entityType: string) {
    // Define smart checks based on type and entity
    const checkMap = {
      'training': [
        { name: 'NIL_EDUCATION_COMPLETE', weight: 2 },
        { name: 'DISCLOSURE_TRAINING_COMPLETE', weight: 2 },
        { name: 'COMPLIANCE_QUIZ_PASSED', weight: 1 }
      ],
      'disclosure': [
        { name: 'FTC_GUIDELINES_MET', weight: 3 },
        { name: 'SCHOOL_POLICY_COMPLIANT', weight: 2 },
        { name: 'HASHTAG_REQUIREMENTS_MET', weight: 1 }
      ],
      'deal': [
        { name: 'EXCLUSIVITY_CHECK_PASSED', weight: 3 },
        { name: 'VALUE_WITHIN_LIMITS', weight: 2 },
        { name: 'SCHOOL_APPROVAL_OBTAINED', weight: 3 },
        { name: 'PARENT_CONSENT_VERIFIED', weight: 2 }
      ],
      'payment': [
        { name: 'TAX_DOCUMENTATION_COMPLETE', weight: 2 },
        { name: 'BANKING_INFO_VERIFIED', weight: 2 },
        { name: 'COMPLIANCE_CLEARED', weight: 1 }
      ]
    };

    return checkMap[checkType] || [];
  }

  private static async executeCheck(check: any, entityId: string, context: Record<string, any>) {
    // Simulate check execution - in production, this would call actual validation logic
    const simulatedResults = {
      'NIL_EDUCATION_COMPLETE': Math.random() > 0.2,
      'DISCLOSURE_TRAINING_COMPLETE': Math.random() > 0.15,
      'COMPLIANCE_QUIZ_PASSED': Math.random() > 0.1,
      'FTC_GUIDELINES_MET': Math.random() > 0.05,
      'SCHOOL_POLICY_COMPLIANT': Math.random() > 0.1,
      'HASHTAG_REQUIREMENTS_MET': Math.random() > 0.05,
      'EXCLUSIVITY_CHECK_PASSED': Math.random() > 0.2,
      'VALUE_WITHIN_LIMITS': Math.random() > 0.1,
      'SCHOOL_APPROVAL_OBTAINED': Math.random() > 0.3,
      'PARENT_CONSENT_VERIFIED': Math.random() > 0.2,
      'TAX_DOCUMENTATION_COMPLETE': Math.random() > 0.15,
      'BANKING_INFO_VERIFIED': Math.random() > 0.1,
      'COMPLIANCE_CLEARED': Math.random() > 0.05
    };

    return {
      passed: simulatedResults[check.name] ?? true,
      weight: check.weight,
      metadata: context
    };
  }

  private static async storeProofSlip(proofSlip: ProofSlip) {
    // Store in localStorage for demo - in production, this would be database storage
    const existing = JSON.parse(localStorage.getItem('nil-proof-slips') || '[]');
    existing.push(proofSlip);
    localStorage.setItem('nil-proof-slips', JSON.stringify(existing));
  }

  static async getProofSlips(entityId?: string): Promise<ProofSlip[]> {
    const stored = JSON.parse(localStorage.getItem('nil-proof-slips') || '[]');
    return entityId ? stored.filter((p: ProofSlip) => p.entityId === entityId) : stored;
  }

  private static async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async verifyMerkleTree(): Promise<{ verified: boolean; differences: string[] }> {
    const proofSlips = await this.getProofSlips();
    const leaves = proofSlips.map(p => p.merkleLeaf);
    
    // Simple merkle verification - in production would be more sophisticated
    const differences: string[] = [];
    let verified = true;

    // Check for unanchored slips
    const unanchored = proofSlips.filter(p => !p.anchored);
    if (unanchored.length > 0) {
      differences.push(`${unanchored.length} unanchored proof slips`);
      verified = false;
    }

    // Check for hash consistency
    for (const slip of proofSlips) {
      const expectedHash = await this.generateHash(slip.inputsHash + slip.timestamp + slip.entityId);
      if (expectedHash !== slip.merkleLeaf) {
        differences.push(`Hash mismatch for proof slip ${slip.id}`);
        verified = false;
      }
    }

    return { verified, differences };
  }

  static async exportEvidence(entityId?: string): Promise<{ manifest: any; files: Record<string, any> }> {
    const proofSlips = await this.getProofSlips(entityId);
    const manifest = {
      exportDate: new Date().toISOString(),
      entityId: entityId || 'all',
      totalRecords: proofSlips.length,
      merkleRoot: await this.calculateMerkleRoot(proofSlips.map(p => p.merkleLeaf)),
      records: proofSlips.map(p => ({
        id: p.id,
        type: p.type,
        timestamp: p.timestamp,
        hash: p.merkleLeaf,
        anchored: p.anchored
      }))
    };

    const files = {
      'manifest.json': manifest,
      'proof-slips.json': proofSlips,
      'verification.json': await this.verifyMerkleTree()
    };

    return { manifest, files };
  }

  private static async calculateMerkleRoot(leaves: string[]): Promise<string> {
    if (leaves.length === 0) return '';
    if (leaves.length === 1) return leaves[0];
    
    // Simple merkle root calculation
    const combined = leaves.join('');
    return await this.generateHash(combined);
  }
}

// Convenience functions for specific NIL actions
export const NILActions = {
  async completeTraining(athleteId: string, moduleId: string) {
    const checkResult = await NILProofSystem.runSmartChecks(athleteId, 'athlete', 'training', { moduleId });
    return NILProofSystem.generateProofSlip(
      'training.complete',
      athleteId,
      'athlete',
      checkResult.reasons,
      { moduleId, score: checkResult.score }
    );
  },

  async approveDisclosure(postId: string, athleteId: string, disclosureText: string) {
    const checkResult = await NILProofSystem.runSmartChecks(athleteId, 'athlete', 'disclosure', { postId, disclosureText });
    return NILProofSystem.generateProofSlip(
      'disclosure.approve',
      postId,
      'athlete',
      checkResult.reasons,
      { athleteId, disclosureText, ftcCompliant: checkResult.passed }
    );
  },

  async approveDeal(dealId: string, athleteId: string, amount: number, approver: string) {
    const checkResult = await NILProofSystem.runSmartChecks(athleteId, 'athlete', 'deal', { dealId, amount, approver });
    return NILProofSystem.generateProofSlip(
      'deal.approve',
      dealId,
      'athlete',
      checkResult.reasons,
      { athleteId, amount, approver, timestamp: new Date().toISOString() }
    );
  },

  async settlePayment(paymentId: string, athleteId: string, amount: number) {
    const checkResult = await NILProofSystem.runSmartChecks(athleteId, 'athlete', 'payment', { paymentId, amount });
    return NILProofSystem.generateProofSlip(
      'payment.settle',
      paymentId,
      'athlete',
      checkResult.reasons,
      { athleteId, amount, settlementDate: new Date().toISOString() }
    );
  },

  async logDispute(disputeId: string, originalDecisionId: string, newOutcome: string, reason: string) {
    return NILProofSystem.generateProofSlip(
      'delta.change',
      disputeId,
      'athlete',
      [`DISPUTE_LOGGED`, `ORIGINAL_DECISION_${originalDecisionId}`, `NEW_OUTCOME_${newOutcome}`],
      { originalDecisionId, newOutcome, reason, changeDate: new Date().toISOString() }
    );
  },

  async validateFTCCompliance(postId: string, athleteId: string, hasDisclosure: boolean, disclosureText?: string) {
    const reasons = hasDisclosure ? ['FTC_DISCLOSURE_PRESENT'] : ['FTC_DISCLOSURE_MISSING'];
    return NILProofSystem.generateProofSlip(
      'disclosure.ftc',
      postId,
      'athlete',
      reasons,
      { athleteId, hasDisclosure, disclosureText, reviewDate: new Date().toISOString() }
    );
  }
};