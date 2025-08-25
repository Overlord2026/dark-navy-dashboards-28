/**
 * AI Fabric Copilots
 * Persona-specific AI assistants with specialized knowledge and workflows
 */

import { reason, type ReasoningContext } from './reasoning';
import { addToVector } from './vector';
import { emitEvent } from './events';

export type CopilotPersona = 'family' | 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'nil' | 'health';

export type CopilotAction = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  nextSteps?: string[];
};

export class FamilyCopilot {
  async getRecommendations(userId: string, context: string): Promise<CopilotAction[]> {
    const reasoning = await reason({
      userId,
      scope: 'family.planning',
      query: context,
      data: { persona: 'family' }
    });
    
    // Generate family-specific recommendations
    const actions: CopilotAction[] = [
      {
        id: 'increase_deferral',
        title: 'Increase 401(k) Deferral by 1%',
        description: 'Your current savings rate could be improved for retirement readiness',
        confidence: 0.85,
        reasoning: ['Current deferral below recommended 15%', 'Age-appropriate catch-up available'],
        nextSteps: ['Log into 401(k) portal', 'Update deferral percentage', 'Review investment mix']
      },
      {
        id: 'review_beneficiaries',
        title: 'Update Beneficiary Designations',
        description: 'Some accounts may need beneficiary updates',
        confidence: 0.72,
        reasoning: ['Recent life changes detected', 'Outdated designations found'],
        nextSteps: ['Review all account beneficiaries', 'Update as needed', 'Document changes']
      }
    ];
    
    return actions;
  }
}

export class AdvisorCopilot {
  async getRecommendations(userId: string, context: string): Promise<CopilotAction[]> {
    return this.analyzeBook(userId);
  }
  
  async analyzeBook(advisorId: string): Promise<CopilotAction[]> {
    const reasoning = await reason({
      userId: advisorId,
      scope: 'advisor.book_health',
      query: 'analyze client portfolio health and opportunities',
      data: { persona: 'advisor' }
    });
    
    const actions: CopilotAction[] = [
      {
        id: 'rebalance_alert',
        title: '3 Clients Need Portfolio Rebalancing',
        description: 'Asset allocation drift detected in multiple portfolios',
        confidence: 0.91,
        reasoning: ['Quarterly drift analysis complete', 'Market movements affecting allocations'],
        nextSteps: ['Review drift reports', 'Schedule client calls', 'Execute rebalancing']
      },
      {
        id: 'rollover_opportunity',
        title: 'Rollover Opportunity: $2.3M Available',
        description: 'Recent job changes creating rollover opportunities',
        confidence: 0.78,
        reasoning: ['Employment status changes detected', 'High-fee 401(k) plans identified'],
        nextSteps: ['Contact affected clients', 'Analyze fee structures', 'Propose rollover strategy']
      }
    ];
    
    return actions;
  }
}

export class CPACopilot {
  async getRecommendations(userId: string, context: string): Promise<CopilotAction[]> {
    return this.getTaxInsights(userId, 'client123');
  }
  
  async getTaxInsights(cpaId: string, clientId: string): Promise<CopilotAction[]> {
    const reasoning = await reason({
      userId: cpaId,
      scope: 'tax.planning',
      query: `tax optimization opportunities for client ${clientId}`,
      data: { persona: 'cpa', clientId }
    });
    
    const actions: CopilotAction[] = [
      {
        id: 'roth_conversion',
        title: 'Roth Conversion Opportunity',
        description: 'Low-income year creates favorable conversion window',
        confidence: 0.83,
        reasoning: ['Current income below historical average', 'Tax bracket optimization available'],
        nextSteps: ['Calculate conversion amounts', 'Model tax impact', 'Coordinate with advisor']
      }
    ];
    
    return actions;
  }
}

export class AttorneyCopilot {
  async getRecommendations(userId: string, context: string): Promise<CopilotAction[]> {
    return this.getEstateInsights(userId, 'client123');
  }
  
  async getEstateInsights(attorneyId: string, clientId: string): Promise<CopilotAction[]> {
    const reasoning = await reason({
      userId: attorneyId,
      scope: 'estate.planning',
      query: `estate planning review for client ${clientId}`,
      data: { persona: 'attorney', clientId }
    });
    
    const actions: CopilotAction[] = [
      {
        id: 'trust_funding',
        title: 'Trust Funding Incomplete',
        description: 'Trust documents executed but assets not transferred',
        confidence: 0.95,
        reasoning: ['Trust created 6 months ago', 'Asset titling not updated', 'Probate risk identified'],
        nextSteps: ['Generate funding checklist', 'Contact client', 'Coordinate asset transfers']
      }
    ];
    
    return actions;
  }
}

// Copilot factory
export function getCopilot(persona: CopilotPersona) {
  switch (persona) {
    case 'family':
      return new FamilyCopilot();
    case 'advisor':
      return new AdvisorCopilot();
    case 'cpa':
      return new CPACopilot();
    case 'attorney':
      return new AttorneyCopilot();
    default:
      throw new Error(`Unsupported copilot persona: ${persona}`);
  }
}

// Knowledge ingestion for copilots
export async function ingestKnowledge(source: string, content: string, metadata: Record<string, any>) {
  await addToVector(
    `${source}_${Date.now()}`,
    content,
    { source, ...metadata, ingestedAt: new Date().toISOString() }
  );
  
  await emitEvent({
    type: 'doc.ingested',
    actor: 'system',
    subject: source,
    meta: { contentLength: content.length, ...metadata }
  });
}