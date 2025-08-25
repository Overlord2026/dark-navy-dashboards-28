export type Rule = {
  id: string;
  when: (ctx: any) => boolean;
  then: (ctx: any) => { 
    action: string; 
    reasons: string[]; 
    next?: string[];
    confidence?: number;
    priority?: number;
  };
};

export type RuleResult = {
  ruleId: string;
  action: string;
  reasons: string[];
  next?: string[];
  confidence?: number;
  priority?: number;
  context: any;
  timestamp: string;
};

export type ProofSlip = {
  id: string;
  ruleId: string;
  action: string;
  reasons: string[];
  context: any;
  timestamp: string;
  hash: string;
};

export function runRules(rules: Rule[], ctx: any): RuleResult[] {
  const hits = rules
    .filter(rule => {
      try {
        return rule.when(ctx);
      } catch (error) {
        console.warn(`Rule ${rule.id} evaluation failed:`, error);
        return false;
      }
    })
    .map(rule => {
      const result = rule.then(ctx);
      return {
        ruleId: rule.id,
        ...result,
        context: ctx,
        timestamp: new Date().toISOString()
      };
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Sort by priority desc

  console.log(`[Decision DSL] Executed ${rules.length} rules, ${hits.length} matched`);
  return hits;
}

export function createProofSlip(result: RuleResult): ProofSlip {
  const slip: ProofSlip = {
    id: crypto.randomUUID(),
    ruleId: result.ruleId,
    action: result.action,
    reasons: result.reasons,
    context: result.context,
    timestamp: result.timestamp,
    hash: generateHash(result)
  };
  
  console.log(`[Proof Slip] Generated for rule ${result.ruleId}:`, slip.id);
  return slip;
}

export function generateHash(data: any): string {
  // Simple hash generation for proof slips (use proper crypto in production)
  const str = JSON.stringify(data, Object.keys(data).sort());
  return btoa(str).slice(0, 16);
}

export function validateRule(rule: Rule): boolean {
  if (!rule.id || typeof rule.id !== 'string') {
    console.error('Rule missing valid id');
    return false;
  }
  
  if (typeof rule.when !== 'function') {
    console.error(`Rule ${rule.id} missing valid when function`);
    return false;
  }
  
  if (typeof rule.then !== 'function') {
    console.error(`Rule ${rule.id} missing valid then function`);
    return false;
  }
  
  return true;
}

export function safeRunRules(rules: Rule[], ctx: any): RuleResult[] {
  const validRules = rules.filter(validateRule);
  if (validRules.length !== rules.length) {
    console.warn(`${rules.length - validRules.length} invalid rules filtered out`);
  }
  
  return runRules(validRules, ctx);
}