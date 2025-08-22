import { describe, it, expect, beforeEach } from 'vitest';
import { canonicalJson, hash } from '@/lib/canonical';
import { recordReceipt, listReceipts, clearReceipts } from '@/features/receipts/record';
import { DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS } from '@/features/receipts/types';

describe('Canonical JSON and Hashing', () => {
  it('should produce stable JSON order', () => {
    const obj1 = { b: 2, a: 1, c: 3 };
    const obj2 = { a: 1, c: 3, b: 2 };
    
    expect(canonicalJson(obj1)).toBe(canonicalJson(obj2));
    expect(canonicalJson(obj1)).toBe('{"a":1,"b":2,"c":3}');
  });

  it('should hash consistently', async () => {
    const obj = { id: 'test', value: 42 };
    const hash1 = await hash(obj);
    const hash2 = await hash(obj);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^sha256:/);
  });

  it('should produce different hashes for different objects', async () => {
    const obj1 = { id: 'test1', value: 42 };
    const obj2 = { id: 'test2', value: 42 };
    
    expect(await hash(obj1)).not.toBe(await hash(obj2));
  });
});

describe('Receipt System', () => {
  beforeEach(() => {
    clearReceipts();
  });

  it('should store and retrieve Decision-RDS receipts', async () => {
    const decisionRDS: DecisionRDS = {
      id: 'test-decision-1',
      type: 'Decision-RDS',
      action: 'education',
      policy_version: 'E-2025.08',
      inputs_hash: await hash({ module: 'nil-basics' }),
      reasons: ['EDU_FRESH'],
      result: 'approve',
      anchor_ref: null,
      ts: new Date().toISOString()
    };

    const recorded = recordReceipt(decisionRDS);
    expect(recorded).toEqual(decisionRDS);
    
    const receipts = listReceipts();
    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toEqual(decisionRDS);
  });

  it('should validate Consent-RDS structure', () => {
    const consentRDS: ConsentRDS = {
      id: 'test-consent-1',
      type: 'Consent-RDS',
      purpose_of_use: 'contract_collab',
      scope: {
        minimum_necessary: true,
        roles: ['advisor', 'cpa'],
        resources: ['contracts', 'financial_data']
      },
      consent_time: new Date().toISOString(),
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      freshness_score: 1.0,
      result: 'approve',
      reason: 'OK',
      anchor_ref: null,
      ts: new Date().toISOString()
    };

    const recorded = recordReceipt(consentRDS);
    expect(recorded.scope.roles).toContain('advisor');
    expect(recorded.scope.roles).toContain('cpa');
    expect(recorded.freshness_score).toBe(1.0);
  });

  it('should validate Settlement-RDS with anchor_ref', async () => {
    const settlementRDS: SettlementRDS = {
      id: 'test-settlement-1',
      type: 'Settlement-RDS',
      offerLock: 'lock_test_123',
      attribution_hash: await hash({ offer: 'test-offer' }),
      split_tree_hash: await hash({ splits: [{ party: 'brand', share: 0.8 }] }),
      escrow_state: 'released',
      anchor_ref: {
        merkle_root: 'root_abc123',
        cross_chain_locator: [{
          chain_id: 'eth-1',
          tx_ref: '0xabc123',
          ts: Math.floor(Date.now() / 1000)
        }]
      },
      ts: new Date().toISOString()
    };

    const recorded = recordReceipt(settlementRDS);
    expect(recorded.anchor_ref).toBeTruthy();
    expect(recorded.anchor_ref?.merkle_root).toBe('root_abc123');
    expect(recorded.escrow_state).toBe('released');
  });

  it('should validate Delta-RDS with diffs', () => {
    const deltaRDS: DeltaRDS = {
      id: 'test-delta-1',
      type: 'Delta-RDS',
      prior_ref: 'settlement-123',
      diffs: [
        {
          field: 'split_share',
          from: 0.8,
          to: 0.75
        },
        {
          field: 'dispute_reason',
          from: null,
          to: 'performance_issue'
        }
      ],
      reasons: ['ADJUDICATION_RULE_APPLIED'],
      ts: new Date().toISOString()
    };

    const recorded = recordReceipt(deltaRDS);
    expect(recorded.diffs).toHaveLength(2);
    expect(recorded.diffs[0].field).toBe('split_share');
    expect(recorded.prior_ref).toBe('settlement-123');
  });

  it('should not contain PII in test data', async () => {
    const testReceipt: DecisionRDS = {
      id: 'test-no-pii',
      type: 'Decision-RDS',
      action: 'education',
      policy_version: 'E-2025.08',
      inputs_hash: await hash({ module: 'test' }),
      reasons: ['TEST_REASON'],
      result: 'approve',
      anchor_ref: null,
      ts: new Date().toISOString()
    };

    const receiptJson = JSON.stringify(testReceipt);
    
    // Check for common PII patterns
    expect(receiptJson).not.toMatch(/@\w+\.\w+/); // emails
    expect(receiptJson).not.toMatch(/\d{3}-\d{2}-\d{4}/); // SSN pattern
    expect(receiptJson).not.toMatch(/\d{4}-\d{4}-\d{4}-\d{4}/); // credit card pattern
    expect(receiptJson).not.toMatch(/\(\d{3}\)\s?\d{3}-\d{4}/); // phone pattern
  });
});