import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseZocks, toDecisionRdsFromZocks, vaultPackForZocks } from '@/tools/imports/zocks';
import { generateSummaryPdf } from '@/lib/summary/pdf';

// Sample Zocks JSON data
const sampleZocksJson = {
  meetingId: "zocks-123",
  startedAt: "2024-01-15T10:00:00Z",
  participants: [
    { name: "John Smith", role: "advisor" },
    { name: "Jane Doe", role: "client" }
  ],
  transcript: [
    { ts: 1642248000, speaker: "John Smith", text: "Welcome to our financial planning meeting today." },
    { ts: 1642248030, speaker: "Jane Doe", text: "Thank you. I'm concerned about my retirement planning and need guidance on risk management." },
    { ts: 1642248060, speaker: "John Smith", text: "Let's discuss your investment portfolio and action items for the next quarter." },
    { ts: 1642248090, speaker: "Jane Doe", text: "I will need to follow up on the insurance policy we discussed." },
    { ts: 1642248120, speaker: "John Smith", text: "There's a potential risk with market volatility that we should address." }
  ],
  meta: { platform: "zocks", version: "1.2" }
};

const sampleZocksText = `John Smith: Welcome to our financial planning meeting today.
Jane Doe: Thank you. I'm concerned about my retirement planning and need guidance on risk management.
John Smith: Let's discuss your investment portfolio and action items for the next quarter.
Jane Doe: I will need to follow up on the insurance policy we discussed.
John Smith: There's a potential risk with market volatility that we should address.`;

describe('Zocks Import Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseZocks', () => {
    it('should parse Zocks JSON format correctly', async () => {
      const result = await parseZocks(JSON.stringify(sampleZocksJson));
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.bullets.length).toBeGreaterThan(2);
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.speakers).toContain('John Smith');
      expect(result.speakers).toContain('Jane Doe');
      expect(result.inputs_hash).toBeDefined();
      expect(result.originalData).toEqual(sampleZocksJson);
    });

    it('should parse plain text format as fallback', async () => {
      const result = await parseZocks(sampleZocksText);
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.bullets.length).toBeGreaterThan(0);
      expect(result.speakers.length).toBeGreaterThan(0);
      expect(result.inputs_hash).toBeDefined();
      expect(result.originalData).toBeNull();
    });

    it('should handle File input', async () => {
      const file = new File([JSON.stringify(sampleZocksJson)], 'meeting.json', { type: 'application/json' });
      const result = await parseZocks(file);
      
      expect(result.summary.length).toBeGreaterThan(40);
      expect(result.originalData).toEqual(sampleZocksJson);
    });

    it('should extract speakers from transcript correctly', async () => {
      const result = await parseZocks(JSON.stringify(sampleZocksJson));
      
      expect(result.speakers).toHaveLength(2);
      expect(result.speakers).toEqual(['John Smith', 'Jane Doe']);
    });
  });

  describe('toDecisionRdsFromZocks', () => {
    it('should create valid Decision-RDS object', async () => {
      const parsed = await parseZocks(JSON.stringify(sampleZocksJson));
      const rds = toDecisionRdsFromZocks(parsed);
      
      expect(rds.action).toBe('meeting_import');
      expect(rds.policy_version).toBe('v1.0');
      expect(rds.inputs_hash).toBeDefined();
      expect(rds.reasons.length).toBeGreaterThanOrEqual(3);
      expect(rds.reasons).toContain('meeting_import');
      expect(rds.source).toBe('zocks');
      expect(rds.summary_length).toBeGreaterThan(0);
      expect(rds.participants_count).toBe(2);
    });

    it('should include correct reason codes based on content', async () => {
      const parsed = await parseZocks(JSON.stringify(sampleZocksJson));
      const rds = toDecisionRdsFromZocks(parsed);
      
      if (parsed.bullets.length > 0) {
        expect(rds.reasons).toContain('meeting_summary');
      }
      if (parsed.actions.length > 0) {
        expect(rds.reasons).toContain('action_items');
      }
      if (parsed.risks.length > 0) {
        expect(rds.reasons).toContain('risk_flag');
      }
    });
  });

  describe('vaultPackForZocks', () => {
    it('should create proper vault package', async () => {
      const rawText = JSON.stringify(sampleZocksJson);
      const pdfBytes = generateSummaryPdf({
        title: 'Test Meeting',
        summary: 'Test summary',
        bullets: ['Point 1', 'Point 2'],
        actions: ['Action 1'],
        risks: ['Risk 1'],
        speakers: ['Speaker 1']
      });
      
      const vaultPack = await vaultPackForZocks(rawText, pdfBytes);
      
      expect(vaultPack.grant.type).toBe('PRE');
      expect(vaultPack.grant.granted_to).toBe('meeting_import');
      expect(vaultPack.grant.access_level).toBe('read');
      expect(vaultPack.grant.expires_at).toBeDefined();
      expect(vaultPack.files).toHaveLength(2);
      expect(vaultPack.files[0]).toMatch(/^sha256:/);
      expect(vaultPack.files[1]).toMatch(/^sha256:/);
      expect(vaultPack.grant.files).toEqual(vaultPack.files);
    });

    it('should include sha256 prefixed file hashes', async () => {
      const rawText = 'test content';
      const pdfBytes = new Uint8Array([1, 2, 3, 4]);
      
      const vaultPack = await vaultPackForZocks(rawText, pdfBytes);
      
      expect(vaultPack.files[0]).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(vaultPack.files[1]).toMatch(/^sha256:[a-f0-9]{64}$/);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const malformedJson = '{"meetingId": "test", invalid}';
      const result = await parseZocks(malformedJson);
      
      // Should fall back to plain text parsing
      expect(result.originalData).toBeNull();
      expect(result.summary).toBeDefined();
    });

    it('should handle empty input', async () => {
      const result = await parseZocks('');
      
      expect(result.summary).toBeDefined();
      expect(result.bullets).toEqual([]);
      expect(result.actions).toEqual([]);
      expect(result.risks).toEqual([]);
    });
  });
});