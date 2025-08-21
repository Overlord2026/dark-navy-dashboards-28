import { recordReceipt } from '@/features/receipts/record';
import { DecisionRDS } from '@/features/receipts/types';

export interface EducationModule {
  id: string;
  title: string;
  status: 'todo' | 'done';
  completedAt?: string;
}

// Simulated modules data
const modules: EducationModule[] = [
  { id: 'nil-basics', title: 'NIL Basics & Rights', status: 'todo' },
  { id: 'social-media', title: 'Social Media Guidelines', status: 'todo' },
  { id: 'contracts', title: 'Contract Fundamentals', status: 'todo' },
  { id: 'tax-implications', title: 'Tax Implications', status: 'todo' },
  { id: 'compliance', title: 'Compliance Requirements', status: 'todo' },
];

export function getModules(): EducationModule[] {
  return [...modules];
}

export function completeModule(id: string): DecisionRDS {
  const module = modules.find(m => m.id === id);
  if (!module) {
    throw new Error('Module not found');
  }

  module.status = 'done';
  module.completedAt = new Date().toISOString();

  // Check freshness - simulate staleness for demo
  const completedCount = modules.filter(m => m.status === 'done').length;
  const isStale = Math.random() < 0.3; // 30% chance of staleness for demo
  
  const isLastModule = completedCount === modules.length;
  const result = isLastModule && !isStale ? 'approve' : 'deny';
  const reasons = isLastModule 
    ? (isStale ? ['EDU_STALE'] : ['EDU_FRESH'])
    : ['EDU_INCOMPLETE'];

  const rds: DecisionRDS = {
    id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'E-2025.08',
    inputs_hash: hashInputs({ module_id: id, completed_at: module.completedAt }),
    reasons,
    result,
    anchor_ref: null,
    ts: new Date().toISOString()
  };

  return recordReceipt(rds);
}

function hashInputs(obj: any): string {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 24);
}