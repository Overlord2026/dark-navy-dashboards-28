// IP Functions Test Suite
// This file provides test cases for the IP Watch edge functions

export const ipFunctionsTests = {
  // Test data for IP Watch Poll
  ipWatchPollTests: {
    validRequest: {
      cpcs: ['G06Q40/06', 'G06Q40/00', 'G06F16/00'],
      keywords: ['family office', 'wealth management', 'portfolio tracking'],
      window_days: 30,
      entity_id: 'test-entity-uuid-123'
    },
    
    highRiskScenario: {
      cpcs: ['G06Q40/06'],
      keywords: ['family office platform'],
      window_days: 7,
      entity_id: 'test-entity-uuid-456'
    },
    
    lowRiskScenario: {
      cpcs: ['G06F99/99'],
      keywords: ['unrelated technology'],
      window_days: 30,
      entity_id: 'test-entity-uuid-789'
    }
  },
  
  // Test data for Enforcement Verifier
  enforcementVerifierTests: {
    validVerification: {
      receipt_id: 'test-receipt-uuid-123',
      action: 'review'
    },
    
    invalidReceipt: {
      receipt_id: 'non-existent-receipt-uuid',
      action: 'review'
    },
    
    escalationRequest: {
      receipt_id: 'test-receipt-uuid-456',
      action: 'escalate'
    },
    
    notificationRequest: {
      receipt_id: 'test-receipt-uuid-789',
      action: 'notify'
    }
  },
  
  // Expected responses for testing
  expectedResponses: {
    ipWatchPoll: {
      success: true,
      processed_hits: 'number',
      high_risk_hits: 'number',
      entity_id: 'string',
      threshold_used: 'number'
    },
    
    enforcementVerifier: {
      allow: 'boolean',
      reasons: 'array',
      receipt_verified: 'boolean',
      policy_valid: 'boolean',
      leaf_verified: 'boolean'
    },
    
    reconcileEnforcement: {
      success: true,
      escalated_items: 'number',
      receipts_emitted: 'number',
      errors: 'array',
      processed_date: 'string'
    }
  },
  
  // Test utilities
  utils: {
    // Generate test entity ID
    generateTestEntityId: () => `test-entity-${Date.now()}`,
    
    // Generate test receipt data
    generateTestReceipt: (entityId: string) => ({
      entity_id: entityId,
      inputs_hash: 'test-inputs-hash-' + Math.random().toString(36).substr(2, 9),
      policy_hash: 'test-policy-hash-' + Math.random().toString(36).substr(2, 9),
      outcome: 'watchlist_add',
      reason_codes: ['test_reason'],
      model_hash: 'test-model-v1.0'
    }),
    
    // Validate response structure
    validateResponseStructure: (response: any, expected: any) => {
      for (const key in expected) {
        if (!(key in response)) {
          throw new Error(`Missing key: ${key}`);
        }
        
        const expectedType = expected[key];
        const actualType = typeof response[key];
        
        if (expectedType === 'array' && !Array.isArray(response[key])) {
          throw new Error(`Expected ${key} to be array, got ${actualType}`);
        } else if (expectedType !== 'array' && actualType !== expectedType) {
          throw new Error(`Expected ${key} to be ${expectedType}, got ${actualType}`);
        }
      }
      return true;
    }
  }
};

// Sample test execution functions
export const testFunctions = {
  // Test IP Watch Poll
  async testIpWatchPoll(baseUrl: string) {
    const testData = ipFunctionsTests.ipWatchPollTests.validRequest;
    
    const response = await fetch(`${baseUrl}/functions/v1/ipwatch-poll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`IP Watch Poll test failed: ${result.error}`);
    }
    
    ipFunctionsTests.utils.validateResponseStructure(
      result, 
      ipFunctionsTests.expectedResponses.ipWatchPoll
    );
    
    console.log('✅ IP Watch Poll test passed');
    return result;
  },
  
  // Test Enforcement Verifier
  async testEnforcementVerifier(baseUrl: string) {
    const testData = ipFunctionsTests.enforcementVerifierTests.validVerification;
    
    const response = await fetch(`${baseUrl}/functions/v1/ip-enforcement-verifier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Enforcement Verifier test failed: ${result.error}`);
    }
    
    ipFunctionsTests.utils.validateResponseStructure(
      result, 
      ipFunctionsTests.expectedResponses.enforcementVerifier
    );
    
    console.log('✅ Enforcement Verifier test passed');
    return result;
  },
  
  // Test Reconcile Enforcement
  async testReconcileEnforcement(baseUrl: string) {
    const response = await fetch(`${baseUrl}/functions/v1/reconcile-enforcement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Reconcile Enforcement test failed: ${result.error}`);
    }
    
    ipFunctionsTests.utils.validateResponseStructure(
      result, 
      ipFunctionsTests.expectedResponses.reconcileEnforcement
    );
    
    console.log('✅ Reconcile Enforcement test passed');
    return result;
  },
  
  // Run all tests
  async runAllTests(baseUrl: string) {
    console.log('🧪 Starting IP Functions test suite...');
    
    try {
      await testFunctions.testIpWatchPoll(baseUrl);
      await testFunctions.testEnforcementVerifier(baseUrl);
      await testFunctions.testReconcileEnforcement(baseUrl);
      
      console.log('🎉 All IP Functions tests passed!');
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }
};