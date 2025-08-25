import type { Rule } from './dsl';

export const K401_RULES: Rule[] = [
  {
    id: 'under_match',
    when: (c) => (c.employeePct || 0) < (c.fullMatchPct || 0),
    then: (c) => ({
      action: 'k401.increase_deferral',
      reasons: [`deferral:${c.employeePct}`, `full_match:${c.fullMatchPct}`],
      next: ['Increase deferral by 1%'],
      confidence: 0.9,
      priority: 8
    })
  },
  {
    id: 'rollover_candidate',
    when: (c) => c.leftEmployer && (c.balance || 0) > 1000,
    then: (c) => ({
      action: 'k401.start_rollover',
      reasons: ['left_employer', 'eligible'],
      next: ['Launch Rollover Wizard'],
      confidence: 0.85,
      priority: 7
    })
  },
  {
    id: 'high_fees_alert',
    when: (c) => (c.expenseRatio || 0) > 0.015,
    then: (c) => ({
      action: 'k401.fee_alert',
      reasons: [`high_fees:${c.expenseRatio}`, 'consider_alternatives'],
      next: ['Review fund lineup', 'Consider rollover'],
      confidence: 0.7,
      priority: 5
    })
  },
  {
    id: 'max_contribution',
    when: (c) => (c.employeePct || 0) >= 0.20 && (c.annualSalary || 0) > 0,
    then: (c) => ({
      action: 'k401.max_contribution_reached',
      reasons: [`deferral:${c.employeePct}`, 'near_limit'],
      next: ['Consider Roth IRA', 'Evaluate after-tax contributions'],
      confidence: 0.95,
      priority: 6
    })
  },
  {
    id: 'loan_outstanding',
    when: (c) => (c.loanBalance || 0) > 0,
    then: (c) => ({
      action: 'k401.loan_outstanding',
      reasons: [`loan_balance:${c.loanBalance}`, 'repayment_priority'],
      next: ['Review loan terms', 'Plan accelerated repayment'],
      confidence: 0.8,
      priority: 9
    })
  },
  {
    id: 'sdba_available',
    when: (c) => c.sdbAvailable && !(c.sdbEnrolled),
    then: (c) => ({
      action: 'k401.sdba_opportunity',
      reasons: ['sdba_available', 'not_enrolled'],
      next: ['Evaluate SDBA options', 'Review investment strategy'],
      confidence: 0.6,
      priority: 4
    })
  },
  {
    id: 'approaching_retirement',
    when: (c) => (c.age || 0) >= 55 && (c.age || 0) < 65,
    then: (c) => ({
      action: 'k401.retirement_planning',
      reasons: [`age:${c.age}`, 'pre_retirement'],
      next: ['Review distribution options', 'Plan withdrawal strategy'],
      confidence: 0.9,
      priority: 10
    })
  },
  {
    id: 'catch_up_eligible',
    when: (c) => (c.age || 0) >= 50 && (c.employeePct || 0) < 0.25,
    then: (c) => ({
      action: 'k401.catch_up_contribution',
      reasons: [`age:${c.age}`, 'catch_up_eligible'],
      next: ['Increase to catch-up limit', 'Maximize contributions'],
      confidence: 0.85,
      priority: 8
    })
  }
];

// Rule evaluation helper
export function evaluateK401Rules(context: {
  employeePct?: number;
  fullMatchPct?: number;
  leftEmployer?: boolean;
  balance?: number;
  expenseRatio?: number;
  annualSalary?: number;
  loanBalance?: number;
  sdbAvailable?: boolean;
  sdbEnrolled?: boolean;
  age?: number;
}) {
  return K401_RULES.filter(rule => rule.when(context));
}

// Common contexts for testing
export const SAMPLE_CONTEXTS = {
  underMatching: {
    employeePct: 0.03,
    fullMatchPct: 0.06,
    age: 35,
    annualSalary: 75000
  },
  rolloverCandidate: {
    leftEmployer: true,
    balance: 45000,
    age: 32
  },
  highFees: {
    employeePct: 0.06,
    expenseRatio: 0.025,
    age: 40
  },
  nearRetirement: {
    age: 58,
    employeePct: 0.15,
    balance: 350000
  }
};