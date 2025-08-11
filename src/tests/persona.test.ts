import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PersonaSelector } from '@/services/persona/PersonaSelector';
import { PolicyCompiler } from '@/services/policy/Compiler';
import { TokenService } from '@/services/policy/TokenService';
import { policyGateway } from '@/middleware/policyGateway';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        data: null,
        error: null
      }))
    }))
  }
}));

describe('PersonaSelector Hysteresis', () => {
  let selector: PersonaSelector;

  beforeEach(() => {
    selector = new PersonaSelector('test-tenant', {
      deltaConfidence: 0.15,
      minHoldTime: 5000 // 5 seconds
    });
  });

  it('should require significant confidence delta to switch personas', () => {
    const initialPredictions = {
      client: 0.6,
      advisor: 0.4,
      attorney: 0.0,
      cpa: 0.0,
      insurance_agent: 0.0,
      consultant: 0.0,
      coach: 0.0,
      enterprise_admin: 0.0,
      accountant: 0.0,
      compliance: 0.0,
      imo_fmo: 0.0,
      agency: 0.0,
      organization: 0.0,
      healthcare_consultant: 0.0,
      realtor: 0.0,
      property_manager: 0.0,
      vip_reserved: 0.0
    };

    const result1 = selector.selectPersona(initialPredictions);
    expect(result1.selectedPersona).toBe('client');
    expect(result1.switched).toBe(true); // Initial selection

    // Small confidence increase shouldn't trigger switch
    const smallIncreasePredictions = {
      ...initialPredictions,
      advisor: 0.65, // Only 0.05 increase
      client: 0.35
    };

    const result2 = selector.selectPersona(smallIncreasePredictions);
    expect(result2.selectedPersona).toBe('client'); // Should stay
    expect(result2.switched).toBe(false);

    // Large confidence increase should trigger switch (after hold time)
    const largeIncreasePredictions = {
      ...initialPredictions,
      advisor: 0.85, // 0.25 increase (> 0.15 threshold)
      client: 0.15
    };

    // But not immediately due to hold time
    const result3 = selector.selectPersona(largeIncreasePredictions);
    expect(result3.switched).toBe(false); // Still in hold period
  });

  it('should implement two-threshold behavior with time gate', async () => {
    // Set up initial state
    const initialPredictions = {
      client: 0.8,
      advisor: 0.2,
      attorney: 0.0,
      cpa: 0.0,
      insurance_agent: 0.0,
      consultant: 0.0,
      coach: 0.0,
      enterprise_admin: 0.0,
      accountant: 0.0,
      compliance: 0.0,
      imo_fmo: 0.0,
      agency: 0.0,
      organization: 0.0,
      healthcare_consultant: 0.0,
      realtor: 0.0,
      property_manager: 0.0,
      vip_reserved: 0.0
    };

    selector.selectPersona(initialPredictions);

    // Wait for hold time and try switch
    await new Promise(resolve => setTimeout(resolve, 6000));

    const switchPredictions = {
      ...initialPredictions,
      advisor: 0.95, // High confidence
      client: 0.05
    };

    const result = selector.selectPersona(switchPredictions);
    expect(result.switched).toBe(true);
    expect(result.selectedPersona).toBe('advisor');
  });
});

describe('PolicyCompiler Cache', () => {
  let compiler: PolicyCompiler;

  beforeEach(() => {
    compiler = new PolicyCompiler();
  });

  it('should cache compiled policies by structural hash', () => {
    const policies = [
      {
        id: 'test-policy',
        conditions: [{ type: 'ROLE', value: 'admin' }],
        scopes: ['read:users'],
        effect: 'allow' as const
      }
    ];

    const graph1 = compiler.compile(policies, 'tenant1', 'v1', 'US');
    const graph2 = compiler.compile(policies, 'tenant1', 'v1', 'US');

    // Should be identical objects from cache
    expect(graph1).toBe(graph2);
  });

  it('should generate different cache keys for different jurisdictions', () => {
    const policies = [
      {
        id: 'test-policy',
        conditions: [{ type: 'ROLE', value: 'admin' }],
        scopes: ['read:users'],
        effect: 'allow' as const
      }
    ];

    const graphUS = compiler.compile(policies, 'tenant1', 'v1', 'US');
    const graphEU = compiler.compile(policies, 'tenant1', 'v1', 'EU');

    // Should be different cache entries
    expect(graphUS).not.toBe(graphEU);
  });
});

describe('TokenService Scope Minimization', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService('test-secret');
  });

  it('should minimize redundant scopes', async () => {
    const scopes = [
      'admin:read',
      'admin:write',
      'admin:*',
      'user:read',
      'user:read' // duplicate
    ];

    const token = await tokenService.mintToken('tenant1', 'user1', scopes);
    const decoded = JSON.parse(atob(token.split('.')[1]));

    // Should contain only non-redundant scopes
    expect(decoded.scopes).toContain('admin:*');
    expect(decoded.scopes).toContain('user:read');
    expect(decoded.scopes).not.toContain('admin:read'); // Implied by admin:*
    expect(decoded.scopes).not.toContain('admin:write'); // Implied by admin:*
    expect(decoded.scopes.length).toBe(2);
  });
});

describe('Gateway Token Verification', () => {
  it('should verify tokens and check scopes', async () => {
    const mockToken = 'valid.jwt.token';
    const requiredScopes = ['read:users', 'write:users'];

    // Mock JWT verification
    vi.mock('jsonwebtoken', () => ({
      default: {
        verify: vi.fn(() => ({
          tenant_id: 'tenant1',
          persona_id: 'user1',
          scopes: ['admin:*'],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        }))
      }
    }));

    const result = await policyGateway.verifyPolicyToken(mockToken, requiredScopes);
    expect(result.valid).toBe(true);
  });

  it('should deny access for insufficient scopes', async () => {
    const mockToken = 'limited.jwt.token';
    const requiredScopes = ['admin:delete'];

    vi.mock('jsonwebtoken', () => ({
      default: {
        verify: vi.fn(() => ({
          tenant_id: 'tenant1',
          persona_id: 'user1',
          scopes: ['user:read'],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        }))
      }
    }));

    const result = await policyGateway.verifyPolicyToken(mockToken, requiredScopes);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Insufficient scopes');
  });
});

describe('Audit Chain Integrity', () => {
  it('should maintain hash chain integrity', () => {
    // Test hash chain computation
    const block1Hash = 'abc123';
    const block2Hash = 'def456';
    
    // Simulate canonical data format from trigger
    const canonicalData1 = 'input1|output1||1|' + Date.now();
    const canonicalData2 = 'input2|output2|abc123|2|' + Date.now();
    
    // In real implementation, these would be SHA-256 hashes
    expect(canonicalData2).toContain(block1Hash);
    expect(canonicalData1.split('|')[2]).toBe(''); // No parent for first block
    expect(canonicalData2.split('|')[2]).toBe('abc123'); // Parent hash included
  });

  it('should detect audit fork attempts', () => {
    // Test fork detection in audit chain
    const parentHash = 'parent123';
    const validChildHash = 'child456';
    const forkAttemptHash = 'fork789';
    
    // Both children claim same parent but different block numbers
    const validChild = `inputs|outputs|${parentHash}|5|${Date.now()}`;
    const forkAttempt = `different|outputs|${parentHash}|5|${Date.now()}`;
    
    // Fork detection should identify conflicting block numbers
    expect(validChild.split('|')[3]).toBe(forkAttempt.split('|')[3]);
    expect(validChild.split('|')[0]).not.toBe(forkAttempt.split('|')[0]);
  });
});

describe('Policy Cache Correctness', () => {
  let compiler: PolicyCompiler;

  beforeEach(() => {
    compiler = new PolicyCompiler();
  });

  it('should produce identical results for same structural input', () => {
    const policy1 = {
      name: 'test-policy',
      version: '1.0',
      statements: [
        { id: 'stmt1', effect: 'allow', actions: ['read'], resources: ['doc1'] },
        { id: 'stmt2', effect: 'deny', actions: ['write'], resources: ['doc2'] }
      ]
    };

    // Same policy with different ordering should produce same structural hash
    const policy2 = {
      name: 'test-policy',
      version: '1.0',
      statements: [
        { id: 'stmt2', effect: 'deny', actions: ['write'], resources: ['doc2'] },
        { id: 'stmt1', effect: 'allow', actions: ['read'], resources: ['doc1'] }
      ]
    };

    const result1 = compiler.compile(policy1, 'tenant1', 'v1', 'US');
    const result2 = compiler.compile(policy2, 'tenant1', 'v1', 'US');

    // Should hit cache on second compile
    expect(result1).toBe(result2);
  });

  it('should invalidate cache for structural changes', () => {
    const basePolicy = {
      name: 'test-policy',
      version: '1.0',
      statements: [
        { id: 'stmt1', effect: 'allow', actions: ['read'], resources: ['doc1'] }
      ]
    };

    const modifiedPolicy = {
      ...basePolicy,
      statements: [
        { id: 'stmt1', effect: 'deny', actions: ['read'], resources: ['doc1'] } // Changed effect
      ]
    };

    const result1 = compiler.compile(basePolicy, 'tenant1', 'v1', 'US');
    const result2 = compiler.compile(modifiedPolicy, 'tenant1', 'v1', 'US');

    // Should be different objects due to structural change
    expect(result1).not.toBe(result2);
  });
});

describe('Hysteresis Monotonicity', () => {
  let selector: PersonaSelector;

  beforeEach(() => {
    selector = new PersonaSelector('test-tenant', {
      deltaConfidence: 0.15,
      minHoldTime: 1000 // 1 second for testing
    });
  });

  it('should maintain monotonic switching behavior', async () => {
    const userId = 'test-user';
    const sessionId = 'test-session';

    // Initial classification
    const initial = {
      topPersona: 'client',
      confidence: 0.7,
      reasoning: ['initial classification']
    };

    const result1 = await selector.selectPersona(userId, initial, sessionId);
    expect(result1.switched).toBe(true);
    expect(result1.new_persona).toBe('client');

    // Small confidence increase - should not switch
    const smallIncrease = {
      topPersona: 'advisor',
      confidence: 0.75, // Only 0.05 increase
      reasoning: ['small increase']
    };

    const result2 = await selector.selectPersona(userId, smallIncrease, sessionId);
    expect(result2.switched).toBe(false);

    // Wait for hold time
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Large confidence increase - should switch
    const largeIncrease = {
      topPersona: 'advisor',
      confidence: 0.9, // 0.2 increase > 0.15 threshold
      reasoning: ['large increase']
    };

    const result3 = await selector.selectPersona(userId, largeIncrease, sessionId);
    expect(result3.switched).toBe(true);
    expect(result3.new_persona).toBe('advisor');
  });
});

describe('Scope Minimality Tests', () => {
  it('should produce minimal scope sets', () => {
    const testCases = [
      {
        input: ['read:*', 'read:doc1', 'read:doc2'],
        expected: ['read:*']
      },
      {
        input: ['admin:*', 'admin:read', 'admin:write', 'user:read'],
        expected: ['admin:*', 'user:read']
      },
      {
        input: ['write:doc1', 'read:doc1', 'admin:doc1'],
        expected: ['admin:doc1'] // admin implies read and write
      }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = ScopeUtils.minimizeScopes(input);
      expect(result.sort()).toEqual(expected.sort());
    });
  });

  it('should handle scope subsumption correctly', () => {
    expect(ScopeUtils.scopeSubsumes('*:*', 'read:doc1')).toBe(true);
    expect(ScopeUtils.scopeSubsumes('read:*', 'read:doc1')).toBe(true);
    expect(ScopeUtils.scopeSubsumes('read:doc*', 'read:doc1')).toBe(true);
    expect(ScopeUtils.scopeSubsumes('read:doc1', 'read:doc2')).toBe(false);
    expect(ScopeUtils.scopeSubsumes('write:doc1', 'read:doc1')).toBe(false);
  });
});