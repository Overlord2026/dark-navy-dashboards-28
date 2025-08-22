import { describe, it, expect, beforeEach } from 'vitest';
import { HashingService } from '../services/crypto/HashingService';
import { MinimalScopeTokenizer } from '../services/policy/MinimalScopeTokenizer';
import { PolicyCompilerCache } from '../services/policy/PolicyCompilerCache';

describe('Policy System Tests', () => {
  describe('SHA3-256 Hashing & Canonicalization', () => {
    it('should produce same hash for whitespace-insensitive policies', async () => {
      const policy1 = {
        nodes: [{ id: 'node1', type: 'condition', data: { type: 'ROLE', value: 'admin' } }],
        edges: [{ from: 'node1', to: 'effect1' }]
      };
      
      const policy2 = {
        nodes: [
          { 
            id: 'node1', 
            type: 'condition', 
            data: { 
              type: 'ROLE', 
              value: 'admin' 
            } 
          }
        ],
        edges: [{ from: 'node1', to: 'effect1' }]
      };
      
      const hash1 = await HashingService.structuralHash(policy1);
      const hash2 = await HashingService.structuralHash(policy2);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for single rule change', async () => {
      const policy1 = {
        nodes: [{ id: 'node1', type: 'condition', data: { type: 'ROLE', value: 'admin' } }]
      };
      
      const policy2 = {
        nodes: [{ id: 'node1', type: 'condition', data: { type: 'ROLE', value: 'user' } }]
      };
      
      const hash1 = await HashingService.structuralHash(policy1);
      const hash2 = await HashingService.structuralHash(policy2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate cache key with hit test', async () => {
      const cache = new PolicyCompilerCache();
      const policyGraph = { nodes: [], edges: [] };
      
      const key1 = await cache.generateCacheKey('tenant1', 'v1.0', 'US', policyGraph);
      const key2 = await cache.generateCacheKey('tenant1', 'v1.0', 'US', policyGraph);
      
      expect(key1).toBe(key2);
      
      // Test cache hit
      cache.set(key1, { compiled: true }, 'hash123');
      const cached = cache.get(key1);
      
      expect(cached).toBeTruthy();
      expect(cached?.compiledPolicy.compiled).toBe(true);
    });
  });
});