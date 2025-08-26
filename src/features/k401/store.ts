// 401(k) data store with plans, accounts, contribution schedules, and provider rules
import type { ProviderRule } from './forms/types';

export type K401Plan = {
  planId: string;
  provider: string;
  match: { 
    type: 'simple' | 'tiered' | 'none';
    pctOfComp?: number;
    limitPct?: number;
    tiers?: Array<{ matchPct: number; compPct: number }>;
  };
  updatedAt: string;
};

export type K401Account = {
  accountId: string;
  planId: string;
  ownerUserId: string;
  balance: number;
  sources: {
    preTax: number;
    roth: number;
    employer: number;
    afterTax: number;
  };
  updatedAt: string;
};

export type K401ContribSchedule = {
  accountId: string;
  employeePct: number;
  employerMatch: {
    type: 'simple' | 'tiered' | 'none';
    pctOfComp?: number;
    limitPct?: number;
    tiers?: Array<{ matchPct: number; compPct: number }>;
  };
  frequency: 'per_pay' | 'monthly' | 'quarterly';
};

// In-memory storage for demo
let PLANS: Record<string, K401Plan> = {};
let ACCOUNTS: Record<string, K401Account> = {};
let CONTRIB_SCHEDULES: Record<string, K401ContribSchedule> = {};
let PROVIDER_RULES: Record<string, ProviderRule> = {};

export async function upsertPlan(plan: K401Plan): Promise<K401Plan> {
  PLANS[plan.planId] = plan;
  return plan;
}

export async function upsertAccount(account: K401Account): Promise<K401Account> {
  ACCOUNTS[account.accountId] = account;
  return account;
}

export async function upsertContrib(accountId: string, schedule: Omit<K401ContribSchedule, 'accountId'>): Promise<K401ContribSchedule> {
  const contrib = { accountId, ...schedule };
  CONTRIB_SCHEDULES[accountId] = contrib;
  return contrib;
}

export async function getPlans(userId: string): Promise<K401Plan[]> {
  return Object.values(PLANS);
}

export async function getAccounts(userId: string): Promise<K401Account[]> {
  return Object.values(ACCOUNTS).filter(acc => acc.ownerUserId === userId);
}

export async function getContribSchedule(accountId: string): Promise<K401ContribSchedule | null> {
  return CONTRIB_SCHEDULES[accountId] || null;
}

// Provider Rules functions
export async function setProviderRule(rule: ProviderRule): Promise<ProviderRule> {
  PROVIDER_RULES[rule.provider] = rule;
  return rule;
}

export async function getProviderRule(provider: string): Promise<ProviderRule | null> {
  return PROVIDER_RULES[provider] || null;
}

export async function listProviderRules(): Promise<ProviderRule[]> {
  return Object.values(PROVIDER_RULES);
}