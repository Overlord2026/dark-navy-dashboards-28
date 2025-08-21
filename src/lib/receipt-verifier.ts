/**
 * Receipt verification system - validates receipts against policies
 */

export interface VerificationResult {
  isValid: boolean;
  message: string;
  details?: {
    expectedHash?: string;
    actualHash?: string;
    policyMatch?: boolean;
    timestampValid?: boolean;
  };
}

// Mock policy rules for demonstration
const POLICY_RULES = {
  'v1.0': {
    onboard_rds: {
      requiredFields: ['step', 'persona', 'session_id', 'ts'],
      validSteps: ['persona', 'facts', 'goal', 'connect', 'calc', 'invite'],
      validPersonas: ['aspiring', 'retiree']
    },
    decision_rds: {
      requiredFields: ['action', 'persona', 'tier', 'session_id', 'ts'],
      validActions: ['create_goal', 'run_calc', 'add_to_plan'],
      validTiers: ['foundational', 'advanced']
    },
    vault_rds: {
      requiredFields: ['action', 'source', 'hash', 'session_id', 'ts'],
      validActions: ['ingest'],
      validSources: ['plaid', 'upload']
    },
    consent_rds: {
      requiredFields: ['scope', 'purpose_of_use', 'ttl_days', 'result', 'session_id', 'ts'],
      validResults: ['approve', 'deny']
    }
  }
};

function hashInputs(inputs: any): string {
  // Simple hash for demo - in production use crypto
  const inputString = JSON.stringify(inputs, Object.keys(inputs || {}).sort());
  return btoa(inputString).substring(0, 16);
}

export function verifyReceipt(receipt: any): VerificationResult {
  try {
    // Extract policy version (default to v1.0)
    const policyVersion = receipt.policy_version || 'v1.0';
    const receiptType = receipt.type;
    
    // Check if policy exists
    const policy = POLICY_RULES[policyVersion]?.[receiptType];
    if (!policy) {
      return {
        isValid: false,
        message: `❌ Unknown policy version ${policyVersion} or receipt type ${receiptType}`,
        details: { policyMatch: false }
      };
    }

    // Validate required fields
    const missingFields = policy.requiredFields.filter(field => !receipt[field]);
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `❌ Missing required fields: ${missingFields.join(', ')}`,
        details: { policyMatch: false }
      };
    }

    // Validate field values based on type
    let validationErrors: string[] = [];

    if (receiptType === 'onboard_rds') {
      if (receipt.step && !policy.validSteps.includes(receipt.step)) {
        validationErrors.push(`Invalid step: ${receipt.step}`);
      }
      if (receipt.persona && !policy.validPersonas.includes(receipt.persona)) {
        validationErrors.push(`Invalid persona: ${receipt.persona}`);
      }
    }

    if (receiptType === 'decision_rds') {
      if (receipt.action && !policy.validActions.includes(receipt.action)) {
        validationErrors.push(`Invalid action: ${receipt.action}`);
      }
      if (receipt.tier && !policy.validTiers.includes(receipt.tier)) {
        validationErrors.push(`Invalid tier: ${receipt.tier}`);
      }
    }

    if (receiptType === 'vault_rds') {
      if (receipt.action && !policy.validActions.includes(receipt.action)) {
        validationErrors.push(`Invalid action: ${receipt.action}`);
      }
      if (receipt.source && !policy.validSources.includes(receipt.source)) {
        validationErrors.push(`Invalid source: ${receipt.source}`);
      }
    }

    if (receiptType === 'consent_rds') {
      if (receipt.result && !policy.validResults.includes(receipt.result)) {
        validationErrors.push(`Invalid result: ${receipt.result}`);
      }
    }

    if (validationErrors.length > 0) {
      return {
        isValid: false,
        message: `❌ Policy violations: ${validationErrors.join(', ')}`,
        details: { policyMatch: false }
      };
    }

    // Verify inputs hash if present
    if (receipt.inputs_hash) {
      const expectedHash = hashInputs(receipt);
      const hashMatch = expectedHash === receipt.inputs_hash;
      
      if (!hashMatch) {
        return {
          isValid: false,
          message: `❌ Hash mismatch - receipt may have been tampered with`,
          details: {
            expectedHash,
            actualHash: receipt.inputs_hash,
            policyMatch: true
          }
        };
      }
    }

    // Validate timestamp
    const timestamp = new Date(receipt.ts);
    const isValidTimestamp = !isNaN(timestamp.getTime());
    
    if (!isValidTimestamp) {
      return {
        isValid: false,
        message: `❌ Invalid timestamp format`,
        details: { timestampValid: false }
      };
    }

    return {
      isValid: true,
      message: `✅ Receipt matches policy ${policyVersion} for ${receiptType}`,
      details: {
        policyMatch: true,
        timestampValid: true
      }
    };

  } catch (error) {
    return {
      isValid: false,
      message: `❌ Verification error: ${error.message}`,
      details: {}
    };
  }
}

export function getCanonicalJSON(receipt: any): string {
  // Return canonical (sorted) JSON representation
  const sortedReceipt = JSON.stringify(receipt, Object.keys(receipt).sort(), 2);
  return sortedReceipt;
}