import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PersonaSelector } from '@/services/persona/PersonaSelector';
import { PolicyCompiler } from '@/services/policy/Compiler';
import { TokenService } from '@/services/policy/TokenService';
import { PolicyDocument } from '@/services/policy/DSL';

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

describe('Enhanced Persona System Tests', () => {
  describe('Policy Compiler Cache Correctness', () => {
    let compiler: PolicyCompiler;

    beforeEach(() => {
      compiler = new PolicyCompiler();
    });

    it('should cache by structural hash not just input identity', () => {
      const policy1: PolicyDocument = {
        name: 'test-policy-1',
        version: '1.0',
        statements: [
          {
            id: 'policy-1',
            conditions: [{ type: 'WHEN', field: 'role', operator: 'eq', value: 'admin' }],
            actions: ['read'],
            resources: ['users'],
            effect: 'ALLOW' as const
          }
        ]
      };

      const policy2: PolicyDocument = {
        name: 'test-policy-2',
        version: '1.0',
        statements: [
          {
            id: 'policy-different-id',
            conditions: [{ type: 'WHEN', field: 'role', operator: 'eq', value: 'admin' }],
            actions: ['read'],
            resources: ['users'],
            effect: 'ALLOW' as const
          }
        ]
      };

      const graph1 = compiler.compile(policy1, 'tenant1', 'v1', 'US');
      const graph2 = compiler.compile(policy2, 'tenant1', 'v1', 'US');

      // Different policy IDs but same structure should have same structural hash
      expect(graph1.structural_hash).toBe(graph2.structural_hash);
    });

    it('should generate different cache keys for different jurisdictions', () => {
      const policy: PolicyDocument = {
        name: 'test-policy',
        version: '1.0',
        statements: [
          {
            id: 'test-policy',
            conditions: [{ type: 'WHEN', field: 'role', operator: 'eq', value: 'admin' }],
            actions: ['read'],
            resources: ['users'],
            effect: 'ALLOW' as const
          }
        ]
      };

      const graphUS = compiler.compile(policy, 'tenant1', 'v1', 'US');
      const graphEU = compiler.compile(policy, 'tenant1', 'v1', 'EU');

      // Should be different cache entries
      expect(graphUS).not.toBe(graphEU);
    });

    it('should return identical objects for same structural hash', () => {
      const policy: PolicyDocument = {
        name: 'test-policy',
        version: '1.0',
        statements: [
          {
            id: 'test-policy',
            conditions: [{ type: 'WHEN', field: 'role', operator: 'eq', value: 'admin' }],
            actions: ['read'],
            resources: ['users'],
            effect: 'ALLOW' as const
          }
        ]
      };

      const graph1 = compiler.compile(policy, 'tenant1', 'v1', 'US');
      const graph2 = compiler.compile(policy, 'tenant1', 'v1', 'US');

      // Should be identical objects from cache
      expect(graph1).toBe(graph2);
    });
  });

  describe('Hysteresis Monotonicity', () => {
    let selector: PersonaSelector;

    beforeEach(() => {
      selector = new PersonaSelector('test-tenant', {
        deltaConfidence: 0.15,
        minHoldTime: 5000
      });
    });

    it('should not oscillate between personas with small confidence changes', () => {
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

      // Small oscillation should not trigger switch
      const oscillation1 = { ...initialPredictions, advisor: 0.65, client: 0.35 };
      const result2 = selector.selectPersona(oscillation1);
      expect(result2.selectedPersona).toBe('client');
      expect(result2.switched).toBe(false);

      const oscillation2 = { ...initialPredictions, advisor: 0.45, client: 0.55 };
      const result3 = selector.selectPersona(oscillation2);
      expect(result3.selectedPersona).toBe('client');
      expect(result3.switched).toBe(false);
    });

    it('should maintain monotonic confidence requirements', () => {
      // Test that confidence increases are required for switches
      const predictions = {
        client: 0.3,
        advisor: 0.7,
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

      const result = selector.selectPersona(predictions);
      // Should require minimum confidence even for first selection
      expect(result.switched).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0.6);
    });
  });

  describe('Token Scope Minimality', () => {
    let tokenService: TokenService;

    beforeEach(() => {
      tokenService = new TokenService('test-secret');
    });

    it('should remove redundant scopes covered by wildcards', async () => {
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
      expect(decoded.scopes.length).toBeLessThanOrEqual(2);
    });

    it('should preserve non-redundant scopes', async () => {
      const scopes = [
        'user:read',
        'profile:write',
        'billing:*'
      ];

      const token = await tokenService.mintToken('tenant1', 'user1', scopes);
      const decoded = JSON.parse(atob(token.split('.')[1]));

      expect(decoded.scopes).toHaveLength(3);
      expect(decoded.scopes).toContain('user:read');
      expect(decoded.scopes).toContain('profile:write');
      expect(decoded.scopes).toContain('billing:*');
    });

    it('should handle empty and single scope arrays', async () => {
      const emptyToken = await tokenService.mintToken('tenant1', 'user1', []);
      const emptyDecoded = JSON.parse(atob(emptyToken.split('.')[1]));
      expect(emptyDecoded.scopes).toHaveLength(0);

      const singleToken = await tokenService.mintToken('tenant1', 'user1', ['read:only']);
      const singleDecoded = JSON.parse(atob(singleToken.split('.')[1]));
      expect(singleDecoded.scopes).toEqual(['read:only']);
    });
  });

  describe('Audit Fork Detection', () => {
    it('should detect potential fork attacks in audit chain', () => {
      // Simulate audit chain integrity check
      const blocks = [
        { blockNumber: 1, hash: 'abc123', parentHash: null },
        { blockNumber: 2, hash: 'def456', parentHash: 'abc123' },
        { blockNumber: 3, hash: 'ghi789', parentHash: 'def456' }
      ];

      // Valid chain
      let valid = true;
      for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].parentHash !== blocks[i - 1].hash) {
          valid = false;
          break;
        }
      }
      expect(valid).toBe(true);

      // Fork attempt
      const forkedBlocks = [
        { blockNumber: 1, hash: 'abc123', parentHash: null },
        { blockNumber: 2, hash: 'def456', parentHash: 'abc123' },
        { blockNumber: 3, hash: 'FORKED', parentHash: 'WRONG' } // Fork!
      ];

      valid = true;
      for (let i = 1; i < forkedBlocks.length; i++) {
        if (forkedBlocks[i].parentHash !== forkedBlocks[i - 1].hash) {
          valid = false;
          break;
        }
      }
      expect(valid).toBe(false);
    });

    it('should validate unique block numbers per tenant', () => {
      // Test unique constraint simulation
      const tenantBlocks = new Map<string, Set<number>>();
      
      const addBlock = (tenantId: string, blockNumber: number): boolean => {
        if (!tenantBlocks.has(tenantId)) {
          tenantBlocks.set(tenantId, new Set());
        }
        
        const blocks = tenantBlocks.get(tenantId)!;
        if (blocks.has(blockNumber)) {
          return false; // Duplicate block number
        }
        
        blocks.add(blockNumber);
        return true;
      };

      expect(addBlock('tenant1', 1)).toBe(true);
      expect(addBlock('tenant1', 2)).toBe(true);
      expect(addBlock('tenant1', 1)).toBe(false); // Duplicate
      expect(addBlock('tenant2', 1)).toBe(true); // Different tenant, OK
    });
  });

  describe('Policy DSL Canonical DAG Generation', () => {
    let compiler: PolicyCompiler;

    beforeEach(() => {
      compiler = new PolicyCompiler();
    });

    it('should generate consistent DAG for equivalent policies', () => {
      const policy1 = [
        {
          id: 'id1',
          conditions: [
            { type: 'ROLE', value: 'admin' },
            { type: 'TENANT', value: 'tenant1' }
          ],
          scopes: ['read', 'write'],
          effect: 'allow' as const
        }
      ];

      const policy2 = [
        {
          id: 'id2', // Different ID
          conditions: [
            { type: 'TENANT', value: 'tenant1' }, // Different order
            { type: 'ROLE', value: 'admin' }
          ],
          scopes: ['write', 'read'], // Different order
          effect: 'allow' as const
        }
      ];

      const graph1 = compiler.compile(policy1, 'tenant1', 'v1', 'US');
      const graph2 = compiler.compile(policy2, 'tenant1', 'v1', 'US');

      // Canonical representation should be identical
      expect(graph1.structural_hash).toBe(graph2.structural_hash);
    });

    it('should create proper DAG structure with nodes and edges', () => {
      const policies = [
        {
          id: 'test-policy',
          conditions: [
            { type: 'ROLE', value: 'admin' },
            { type: 'TENANT', value: 'tenant1' }
          ],
          scopes: ['read:users'],
          effect: 'allow' as const
        }
      ];

      const graph = compiler.compile(policies, 'tenant1', 'v1', 'US');

      // Should have condition nodes + effect node
      expect(graph.nodes.length).toBe(3); // 2 conditions + 1 effect
      
      // Should have edges from conditions to effect
      expect(graph.edges.length).toBe(2);
      
      // Verify node types
      const conditionNodes = graph.nodes.filter(n => n.type === 'condition');
      const effectNodes = graph.nodes.filter(n => n.type === 'effect');
      expect(conditionNodes.length).toBe(2);
      expect(effectNodes.length).toBe(1);
    });
  });
});