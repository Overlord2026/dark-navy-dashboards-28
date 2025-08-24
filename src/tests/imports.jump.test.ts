import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseJump, toDecisionRdsFromJump, vaultPackForJump } from '@/tools/imports/jump';
import { generateSummaryPdf } from '@/lib/summary/pdf';

// Sample Jump JSON data
const sampleJumpJson = {
  callId: "jump-456",
  startedAt: "2024-01-15T14:30:00Z",
  speakers: ["Alice Johnson", "Bob Wilson", "Carol Davis"],
  summary: "Comprehensive financial planning session covering investment strategies, risk assessment, and action items for portfolio optimization.",
  bullets: [
    "Discussed current market conditions and impact on portfolio",
    "Reviewed risk tolerance and investment objectives",
    "Analyzed diversification strategies for the coming quarter",
    "Evaluated insurance coverage and protection needs"
  ],
  nextSteps: [
    "Schedule follow-up meeting with tax advisor",
    "Review and update beneficiary information",
    "Research ESG investment options"
  ],
  risks: [
    "Market volatility concerns in current economic climate",
    "Potential tax implications of portfolio rebalancing",
    "Insurance gap identified in disability coverage"
  ],
  meta: { platform: "jump", version: "2.1", duration: 3600 }
};

const sampleJumpText = `Call Summary: Financial Planning Review

Key Discussion Points:
• Discussed current market conditions and impact on portfolio
• Reviewed risk tolerance and investment objectives  
• Analyzed diversification strategies for the coming quarter

Action Items:
- Schedule follow-up meeting with tax advisor
- Review and update beneficiary information
- Research ESG investment options

Risks Identified:
⚠ Market volatility concerns in current economic climate
⚠ Potential tax implications of portfolio rebalancing

Participants: Alice Johnson, Bob Wilson, Carol Davis`;

describe('Jump Import Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseJump', () => {
    it('should parse Jump JSON format correctly', async () => {
      const result = await parseJump(JSON.stringify(sampleJumpJson));
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.bullets.length).toBeGreaterThan(2);
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.speakers).toContain('Alice Johnson');
      expect(result.speakers).toContain('Bob Wilson');
      expect(result.speakers).toContain('Carol Davis');
      expect(result.inputs_hash).toBeDefined();
      expect(result.originalData).toEqual(sampleJumpJson);
    });

    it('should parse plain text format as fallback', async () => {
      const result = await parseJump(sampleJumpText);
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.bullets.length).toBeGreaterThan(0);
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.inputs_hash).toBeDefined();
      expect(result.originalData).toBeNull();
    });

    it('should handle File input', async () => {
      const file = new File([JSON.stringify(sampleJumpJson)], 'summary.json', { type: 'application/json' });
      const result = await parseJump(file);
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.originalData).toEqual(sampleJumpJson);
    });

    it('should generate summary from data when summary missing', async () => {
      const dataWithoutSummary = { ...sampleJumpJson };
      delete dataWithoutSummary.summary;
      
      const result = await parseJump(JSON.stringify(dataWithoutSummary));
      
      expect(result.summary).toContain('Call ID: jump-456');
      expect(result.summary).toContain('Participants: Alice Johnson, Bob Wilson, Carol Davis');
    });

    it('should extract bullets, actions, and risks correctly', async () => {
      const result = await parseJump(JSON.stringify(sampleJumpJson));
      
      expect(result.bullets).toHaveLength(4);
      expect(result.actions).toHaveLength(3);
      expect(result.risks).toHaveLength(3);
      expect(result.bullets[0]).toContain('market conditions');
      expect(result.actions[0]).toContain('tax advisor');
      expect(result.risks[0]).toContain('Market volatility');
    });
  });

  describe('toDecisionRdsFromJump', () => {
    it('should create valid Decision-RDS object', async () => {
      const parsed = await parseJump(JSON.stringify(sampleJumpJson));
      const rds = toDecisionRdsFromJump(parsed);
      
      expect(rds.action).toBe('meeting_import');
      expect(rds.policy_version).toBe('v1.0');
      expect(rds.inputs_hash).toBeDefined();
      expect(rds.reasons.length).toBeGreaterThanOrEqual(3);
      expect(rds.reasons).toContain('meeting_import');
      expect(rds.source).toBe('jump');
      expect(rds.summary_length).toBeGreaterThan(0);
      expect(rds.participants_count).toBe(3);
      expect(rds.bullet_points_count).toBe(4);
      expect(rds.action_items_count).toBe(3);
      expect(rds.risks_count).toBe(3);
    });

    it('should include correct reason codes based on content', async () => {
      const parsed = await parseJump(JSON.stringify(sampleJumpJson));
      const rds = toDecisionRdsFromJump(parsed);
      
      expect(rds.reasons).toContain('meeting_import');
      expect(rds.reasons).toContain('meeting_summary');
      expect(rds.reasons).toContain('action_items');
      expect(rds.reasons).toContain('risk_flag');
    });

    it('should handle minimal data correctly', async () => {
      const minimalData = {
        callId: "minimal-test",
        summary: "Basic meeting summary for testing purposes."
      };
      
      const parsed = await parseJump(JSON.stringify(minimalData));
      const rds = toDecisionRdsFromJump(parsed);
      
      expect(rds.reasons).toContain('meeting_import');
      expect(rds.bullet_points_count).toBe(0);
      expect(rds.action_items_count).toBe(0);
      expect(rds.risks_count).toBe(0);
    });
  });

  describe('vaultPackForJump', () => {
    it('should create proper vault package', async () => {
      const rawText = JSON.stringify(sampleJumpJson);
      const pdfBytes = generateSummaryPdf({
        title: 'Jump Meeting Summary',
        summary: sampleJumpJson.summary,
        bullets: sampleJumpJson.bullets,
        actions: sampleJumpJson.nextSteps,
        risks: sampleJumpJson.risks,
        speakers: sampleJumpJson.speakers
      });
      
      const vaultPack = await vaultPackForJump(rawText, pdfBytes);
      
      expect(vaultPack.grant.type).toBe('PRE');
      expect(vaultPack.grant.granted_to).toBe('meeting_import');
      expect(vaultPack.grant.access_level).toBe('read');
      expect(vaultPack.grant.expires_at).toBeDefined();
      expect(vaultPack.files).toHaveLength(2);
      expect(vaultPack.files[0]).toMatch(/^sha256:/);
      expect(vaultPack.files[1]).toMatch(/^sha256:/);
    });

    it('should use configurable grant duration', async () => {
      // Mock environment variable
      const originalEnv = import.meta.env.VITE_VAULT_GRANT_DAYS;
      Object.defineProperty(import.meta.env, 'VITE_VAULT_GRANT_DAYS', { value: '7', configurable: true });
      
      const rawText = 'test';
      const pdfBytes = new Uint8Array([1, 2, 3]);
      
      const vaultPack = await vaultPackForJump(rawText, pdfBytes);
      const expiryDate = new Date(vaultPack.grant.expires_at);
      const today = new Date();
      const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(daysDiff).toBeLessThanOrEqual(7);
      expect(daysDiff).toBeGreaterThan(6);
      
      // Restore original value
      if (originalEnv !== undefined) {
        Object.defineProperty(import.meta.env, 'VITE_VAULT_GRANT_DAYS', { value: originalEnv, configurable: true });
      }
    });
  });

  describe('Content extraction from plain text', () => {
    it('should extract bullet points from various formats', async () => {
      const textWithBullets = `
        - First bullet point about financial planning
        • Second bullet with different marker
        1. Numbered point about investments
        2. Another numbered item about risk assessment
      `;
      
      const result = await parseJump(textWithBullets);
      
      expect(result.bullets.length).toBeGreaterThan(0);
      expect(result.bullets.some(b => b.includes('financial planning'))).toBe(true);
    });

    it('should extract action items from text patterns', async () => {
      const textWithActions = `
        Meeting notes:
        Action: Schedule follow-up meeting
        TODO: Review insurance policies
        Next step: Contact investment advisor
        Will need to update beneficiaries
      `;
      
      const result = await parseJump(textWithActions);
      
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.actions.some(a => a.includes('Schedule follow-up'))).toBe(true);
    });

    it('should extract risks from text patterns', async () => {
      const textWithRisks = `
        Concerns discussed:
        Risk: Market volatility impact
        Issue with current coverage
        Problem: Tax implications
        Challenge in portfolio rebalancing
      `;
      
      const result = await parseJump(textWithRisks);
      
      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.risks.some(r => r.includes('Market volatility'))).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const malformedJson = '{"callId": "test", "invalid": }';
      const result = await parseJump(malformedJson);
      
      // Should fall back to plain text parsing
      expect(result.originalData).toBeNull();
      expect(result.summary).toBeDefined();
    });

    it('should handle empty input', async () => {
      const result = await parseJump('');
      
      expect(result.summary).toBeDefined();
      expect(result.bullets).toEqual([]);
      expect(result.actions).toEqual([]);
      expect(result.risks).toEqual([]);
      expect(result.speakers).toEqual(['Unknown Speaker']);
    });

    it('should limit extracted items to reasonable counts', async () => {
      const longText = Array(20).fill('• Bullet point item').join('\n') + '\n' +
                      Array(10).fill('Action: Do something').join('\n') + '\n' +
                      Array(10).fill('Risk: Some risk item').join('\n');
      
      const result = await parseJump(longText);
      
      expect(result.bullets.length).toBeLessThanOrEqual(5);
      expect(result.actions.length).toBeLessThanOrEqual(3);
      expect(result.risks.length).toBeLessThanOrEqual(3);
    });
  });
});