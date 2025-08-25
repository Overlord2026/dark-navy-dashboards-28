/**
 * AI Fabric Decision DSL
 * Declarative rules engine that produces actions, reasons, and Proof Slips
 */

import { recordReceipt } from '@/features/receipts/record';
import { emitEvent } from '@/features/ai/fabric/events';

export type RuleContext = {
  [key: string]: any;
  userId?: string;
  timestamp?: string;
};

export type RuleDecision = {
  action: string;
  reasons: string[];
  next?: string[];
  confidence?: number;
  metadata?: Record<string, any>;
};

export type Rule = {
  id: string;
  name?: string;
  description?: string;
  priority?: number;
  category?: string;
  when: (ctx: RuleContext) => boolean;
  then: (ctx: RuleContext) => RuleDecision;
};

export type RuleExecution = {
  ruleId: string;
  matched: boolean;
  decision?: RuleDecision;
  executionTime: number;
  context: RuleContext;
};

export type DecisionResult = {
  executions: RuleExecution[];
  decisions: RuleDecision[];
  proofSlip: {
    inputsHash: string;
    timestamp: string;
    rulesExecuted: string[];
    decisionsReached: number;
  };
};

/**
 * Execute rules against a context and generate Proof Slip
 */
export async function runRules(
  rules: Rule[], 
  ctx: RuleContext,
  generateProofSlip = true
): Promise<DecisionResult> {
  const startTime = Date.now();
  const executions: RuleExecution[] = [];
  const decisions: RuleDecision[] = [];
  
  // Sort rules by priority (higher first)
  const sortedRules = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  console.log(`[Decision DSL] Executing ${sortedRules.length} rules for context:`, ctx);
  
  for (const rule of sortedRules) {
    const ruleStartTime = Date.now();
    let matched = false;
    let decision: RuleDecision | undefined;
    
    try {
      matched = rule.when(ctx);
      
      if (matched) {
        decision = rule.then(ctx);
        decisions.push(decision);
        
        console.log(`[Decision DSL] Rule ${rule.id} matched:`, decision);
        
        // Record decision receipt (content-free)
        if (generateProofSlip && ctx.userId) {
          await recordReceipt({
            type: 'Decision-RDS',
            action: decision.action,
            reasons: decision.reasons,
            created_at: new Date().toISOString()
          } as any);
        }
      }
    } catch (error) {
      console.error(`[Decision DSL] Rule ${rule.id} execution failed:`, error);
    }
    
    executions.push({
      ruleId: rule.id,
      matched,
      decision,
      executionTime: Date.now() - ruleStartTime,
      context: ctx
    });
  }
  
  // Generate Proof Slip
  const proofSlip = await generateDecisionProofSlip(ctx, executions, decisions);
  
  // Emit event for audit trail
  if (ctx.userId) {
    await emitEvent({
      type: 'advise.issued',
      actor: ctx.userId,
      subject: 'decision_engine',
      meta: {
        rulesExecuted: executions.length,
        decisionsReached: decisions.length,
        executionTimeMs: Date.now() - startTime
      }
    });
  }
  
  console.log(`[Decision DSL] Completed in ${Date.now() - startTime}ms: ${decisions.length} decisions from ${executions.length} rules`);
  
  return {
    executions,
    decisions,
    proofSlip
  };
}

/**
 * Generate a cryptographic Proof Slip for decision audit trail
 */
async function generateDecisionProofSlip(
  ctx: RuleContext,
  executions: RuleExecution[],
  decisions: RuleDecision[]
) {
  const inputsData = {
    context: ctx,
    timestamp: new Date().toISOString(),
    rulesExecuted: executions.map(e => e.ruleId)
  };
  
  const inputsHash = await generateHash(JSON.stringify(inputsData));
  
  return {
    inputsHash,
    timestamp: inputsData.timestamp,
    rulesExecuted: inputsData.rulesExecuted,
    decisionsReached: decisions.length
  };
}

async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Rule composition utilities
 */
export const Conditions = {
  and: (...conditions: Array<(ctx: RuleContext) => boolean>) => 
    (ctx: RuleContext) => conditions.every(c => c(ctx)),
  
  or: (...conditions: Array<(ctx: RuleContext) => boolean>) => 
    (ctx: RuleContext) => conditions.some(c => c(ctx)),
  
  not: (condition: (ctx: RuleContext) => boolean) => 
    (ctx: RuleContext) => !condition(ctx),
  
  hasProperty: (property: string) => 
    (ctx: RuleContext) => property in ctx && ctx[property] != null,
  
  equals: (property: string, value: any) => 
    (ctx: RuleContext) => ctx[property] === value,
  
  greaterThan: (property: string, value: number) => 
    (ctx: RuleContext) => typeof ctx[property] === 'number' && ctx[property] > value,
  
  lessThan: (property: string, value: number) => 
    (ctx: RuleContext) => typeof ctx[property] === 'number' && ctx[property] < value
};

/**
 * Rule registry for organizing rules by domain
 */
export class RuleRegistry {
  private rules: Map<string, Rule[]> = new Map();
  
  register(domain: string, rules: Rule[]): void {
    this.rules.set(domain, rules);
  }
  
  getRules(domain: string): Rule[] {
    return this.rules.get(domain) || [];
  }
  
  getAllRules(): Rule[] {
    return Array.from(this.rules.values()).flat();
  }
  
  async executeForDomain(domain: string, ctx: RuleContext): Promise<DecisionResult> {
    const domainRules = this.getRules(domain);
    return runRules(domainRules, ctx);
  }
  
  getDomains(): string[] {
    return Array.from(this.rules.keys());
  }
}

// Global rule registry instance
export const globalRuleRegistry = new RuleRegistry();