/**
 * 401k Decision Rules
 * Domain-specific rules for 401k planning and optimization
 */

import type { Rule } from './dsl';
import { Conditions } from './dsl';

export const K401_RULES: Rule[] = [
  {
    id: 'under_match',
    name: 'Maximize Employer Match',
    description: 'Employee is not getting full employer match',
    priority: 10,
    category: 'optimization',
    when: (c) => (c.employeePct || 0) < (c.fullMatchPct || 0),
    then: (c) => ({
      action: 'k401.increase_deferral',
      reasons: [
        `current_deferral:${c.employeePct}%`,
        `full_match_at:${c.fullMatchPct}%`,
        'missing_free_money'
      ],
      next: [
        `Increase deferral to ${c.fullMatchPct}% to capture full employer match`,
        'Review budget to accommodate higher deferral'
      ],
      confidence: 0.95
    })
  },
  
  {
    id: 'rollover_candidate',
    name: 'Rollover Opportunity',
    description: 'Former employee with eligible rollover balance',
    priority: 8,
    category: 'rollover',
    when: Conditions.and(
      (c) => c.leftEmployer === true,
      (c) => (c.balance || 0) > 1000
    ),
    then: (c) => ({
      action: 'k401.start_rollover',
      reasons: [
        'left_employer',
        `balance:$${(c.balance || 0).toLocaleString()}`,
        'rollover_eligible'
      ],
      next: [
        'Launch Rollover Wizard to analyze options',
        'Compare fees and investment options'
      ],
      confidence: 0.85
    })
  }
];

// Sample context for testing rules
export const sampleK401Context = {
  userId: 'user123',
  age: 45,
  employeePct: 3,
  fullMatchPct: 6,
  employerMatchPct: 3,
  balance: 125000,
  income: 85000,
  leftEmployer: false
};