/**
 * AI Fabric Policy Engine
 * Enforces rules, constraints, permissions for AI decisions
 */

export type PolicyRule = {
  id: string;
  name: string;
  scope: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_approval';
  reason: string;
  meta?: Record<string, any>;
};

export type PolicyDecision = {
  allowed: boolean;
  reason: string;
  requiredApprovals?: string[];
  meta?: Record<string, any>;
};

// Policy registry
const POLICIES: PolicyRule[] = [
  {
    id: 'k401_trade_limit',
    name: '401k Trade Limit',
    scope: 'k401.trade',
    condition: 'amount > 25000',
    action: 'require_approval',
    reason: 'High-value trade requires supervisor approval'
  },
  {
    id: 'estate_doc_retention',
    name: 'Estate Document Retention',
    scope: 'estate.vault',
    condition: 'docType === "will" || docType === "trust"',
    action: 'allow',
    reason: 'Critical estate documents require permanent retention'
  },
  {
    id: 'pii_access',
    name: 'PII Access Control',
    scope: 'data.access',
    condition: 'containsPII === true',
    action: 'require_approval',
    reason: 'PII access requires data protection compliance check'
  }
];

export function evaluatePolicy(scope: string, context: Record<string, any>): PolicyDecision {
  const applicablePolicies = POLICIES.filter(p => p.scope === scope);
  
  for (const policy of applicablePolicies) {
    // Simple condition evaluation (replace with proper rule engine)
    const conditionMet = evaluateCondition(policy.condition, context);
    
    if (conditionMet) {
      switch (policy.action) {
        case 'deny':
          return { allowed: false, reason: policy.reason };
        case 'require_approval':
          return { 
            allowed: false, 
            reason: policy.reason,
            requiredApprovals: ['supervisor', 'compliance']
          };
        case 'allow':
          return { allowed: true, reason: policy.reason };
      }
    }
  }
  
  return { allowed: true, reason: 'No applicable policies found' };
}

function evaluateCondition(condition: string, context: Record<string, any>): boolean {
  // Stub condition evaluator - replace with proper expression engine
  try {
    // Simple string replacements for demo
    let expr = condition;
    for (const [key, value] of Object.entries(context)) {
      expr = expr.replace(new RegExp(key, 'g'), JSON.stringify(value));
    }
    return eval(expr);
  } catch {
    return false;
  }
}

export function addPolicy(policy: PolicyRule): void {
  POLICIES.push(policy);
}

export function getPolicies(scope?: string): PolicyRule[] {
  return scope ? POLICIES.filter(p => p.scope === scope) : POLICIES;
}