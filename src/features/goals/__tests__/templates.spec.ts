import { describe, it, expect } from 'vitest';
import { getGoalTemplates, getBucketListTemplates, hasAdvancedTemplates, getTemplateCount, getTemplateById } from '../templates';
import { Persona, ComplexityTier } from '@/features/personalization/types';

describe('goals templates', () => {
  describe('getGoalTemplates', () => {
    it('should return foundational aspiring templates', () => {
      const templates = getGoalTemplates('aspiring', 'foundational');
      
      expect(templates.length).toBe(4);
      expect(templates.map(t => t.id)).toEqual([
        'emergency-fund',
        'debt-paydown', 
        'down-payment',
        'college-fund'
      ]);
      expect(templates.every(t => t.persona === 'aspiring')).toBe(true);
      expect(templates.every(t => t.tier === 'foundational')).toBe(true);
    });

    it('should return foundational retiree templates', () => {
      const templates = getGoalTemplates('retiree', 'foundational');
      
      expect(templates.length).toBe(4);
      expect(templates.map(t => t.id)).toEqual([
        'bucket-list-travel',
        'bucket-list-legacy',
        'health-hsa-reserve',
        'charitable-giving'
      ]);
      expect(templates.every(t => t.persona === 'retiree')).toBe(true);
      expect(templates.every(t => t.tier === 'foundational')).toBe(true);
    });

    it('should return foundational + advanced aspiring templates', () => {
      const foundational = getGoalTemplates('aspiring', 'foundational');
      const advanced = getGoalTemplates('aspiring', 'advanced');
      
      expect(advanced.length).toBeGreaterThan(foundational.length);
      
      // Should include foundational templates
      const foundationalIds = foundational.map(t => t.id);
      const advancedIds = advanced.map(t => t.id);
      foundationalIds.forEach(id => {
        expect(advancedIds).toContain(id);
      });
      
      // Should include advanced templates
      expect(advancedIds).toContain('equity-comp-strategy');
      expect(advancedIds).toContain('concentrated-stock');
      expect(advancedIds).toContain('liquidity-event-prep');
    });

    it('should return foundational + advanced retiree templates', () => {
      const foundational = getGoalTemplates('retiree', 'foundational');
      const advanced = getGoalTemplates('retiree', 'advanced');
      
      expect(advanced.length).toBeGreaterThan(foundational.length);
      
      // Should include advanced templates for retirees
      const advancedIds = advanced.map(t => t.id);
      expect(advancedIds).toContain('daf-charitable-trust');
      expect(advancedIds).toContain('equity-comp-retiree');
      expect(advancedIds).toContain('concentrated-stock-retiree');
    });

    it('should return templates sorted by priority', () => {
      const templates = getGoalTemplates('aspiring', 'advanced');
      
      for (let i = 1; i < templates.length; i++) {
        expect(templates[i].priority).toBeGreaterThanOrEqual(templates[i - 1].priority);
      }
    });
  });

  describe('getBucketListTemplates', () => {
    it('should return only bucket list templates', () => {
      const bucketListTemplates = getBucketListTemplates();
      
      expect(bucketListTemplates.length).toBe(2);
      expect(bucketListTemplates.every(t => t.category === 'bucket_list')).toBe(true);
      expect(bucketListTemplates.every(t => t.persona === 'retiree')).toBe(true);
      expect(bucketListTemplates.map(t => t.id)).toEqual([
        'bucket-list-travel',
        'bucket-list-legacy'
      ]);
    });
  });

  describe('hasAdvancedTemplates', () => {
    it('should return true for advanced tier', () => {
      expect(hasAdvancedTemplates('advanced')).toBe(true);
    });

    it('should return false for foundational tier', () => {
      expect(hasAdvancedTemplates('foundational')).toBe(false);
    });
  });

  describe('getTemplateCount', () => {
    it('should count foundational aspiring templates correctly', () => {
      const count = getTemplateCount('aspiring', 'foundational');
      
      expect(count.foundational).toBe(4);
      expect(count.advanced).toBe(0);
      expect(count.total).toBe(4);
    });

    it('should count advanced aspiring templates correctly', () => {
      const count = getTemplateCount('aspiring', 'advanced');
      
      expect(count.foundational).toBe(4);
      expect(count.advanced).toBeGreaterThan(0);
      expect(count.total).toBe(count.foundational + count.advanced);
    });

    it('should count foundational retiree templates correctly', () => {
      const count = getTemplateCount('retiree', 'foundational');
      
      expect(count.foundational).toBe(4);
      expect(count.advanced).toBe(0);
      expect(count.total).toBe(4);
    });

    it('should count advanced retiree templates correctly', () => {
      const count = getTemplateCount('retiree', 'advanced');
      
      expect(count.foundational).toBe(4);
      expect(count.advanced).toBeGreaterThan(0);
      expect(count.total).toBe(count.foundational + count.advanced);
    });
  });

  describe('getTemplateById', () => {
    it('should find existing template by id', () => {
      const template = getTemplateById('emergency-fund');
      
      expect(template).toBeDefined();
      expect(template?.id).toBe('emergency-fund');
      expect(template?.title).toBe('Emergency Fund');
      expect(template?.persona).toBe('aspiring');
    });

    it('should return undefined for non-existent template', () => {
      const template = getTemplateById('non-existent-template');
      expect(template).toBeUndefined();
    });

    it('should find advanced templates', () => {
      const template = getTemplateById('equity-comp-strategy');
      
      expect(template).toBeDefined();
      expect(template?.tier).toBe('advanced');
      expect(template?.category).toBe('equity');
    });
  });

  describe('persona switching behavior', () => {
    it('should return different templates for different personas', () => {
      const aspiringTemplates = getGoalTemplates('aspiring', 'foundational');
      const retireeTemplates = getGoalTemplates('retiree', 'foundational');
      
      expect(aspiringTemplates).not.toEqual(retireeTemplates);
      
      const aspiringIds = aspiringTemplates.map(t => t.id);
      const retireeIds = retireeTemplates.map(t => t.id);
      
      // Should have no overlap in foundational templates
      const overlap = aspiringIds.filter(id => retireeIds.includes(id));
      expect(overlap).toHaveLength(0);
    });

    it('should maintain template characteristics per persona', () => {
      const aspiringTemplates = getGoalTemplates('aspiring', 'foundational');
      const retireeTemplates = getGoalTemplates('retiree', 'foundational');
      
      // Aspiring should focus on building wealth
      expect(aspiringTemplates.some(t => t.category === 'emergency')).toBe(true);
      expect(aspiringTemplates.some(t => t.category === 'debt')).toBe(true);
      expect(aspiringTemplates.some(t => t.category === 'savings')).toBe(true);
      
      // Retiree should focus on enjoying wealth
      expect(retireeTemplates.some(t => t.category === 'bucket_list')).toBe(true);
      expect(retireeTemplates.some(t => t.category === 'health')).toBe(true);
      expect(retireeTemplates.some(t => t.category === 'charitable')).toBe(true);
    });
  });
  
  describe('advanced overlay behavior', () => {
    it('should append advanced templates without replacing foundational', () => {
      const foundationalAspiring = getGoalTemplates('aspiring', 'foundational');
      const advancedAspiring = getGoalTemplates('aspiring', 'advanced');
      
      // All foundational templates should be present in advanced
      foundationalAspiring.forEach(foundationalTemplate => {
        const found = advancedAspiring.find(t => t.id === foundationalTemplate.id);
        expect(found).toBeDefined();
        expect(found).toEqual(foundationalTemplate);
      });
      
      // Should have additional advanced templates
      expect(advancedAspiring.length).toBeGreaterThan(foundationalAspiring.length);
    });

    it('should not show HNW/UHNW labels in templates', () => {
      const allTemplates = [
        ...getGoalTemplates('aspiring', 'advanced'),
        ...getGoalTemplates('retiree', 'advanced')
      ];
      
      allTemplates.forEach(template => {
        expect(template.title.toLowerCase()).not.toContain('hnw');
        expect(template.title.toLowerCase()).not.toContain('uhnw');
        expect(template.title.toLowerCase()).not.toContain('high net worth');
        expect(template.title.toLowerCase()).not.toContain('ultra high net worth');
        expect(template.description.toLowerCase()).not.toContain('hnw');
        expect(template.description.toLowerCase()).not.toContain('uhnw');
      });
    });
  });
});