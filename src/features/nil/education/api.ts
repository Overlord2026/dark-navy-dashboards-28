import { DecisionRDS } from '@/features/receipts/types';
import { recordReceipt } from '@/features/receipts/record';

export interface EducationModule {
  id: string;
  title: string;
  status: 'todo' | 'done';
  completedAt?: string;
}

let modules: EducationModule[] = [
  { id: 'edu_mod_01', title: 'NIL Basics', status: 'done', completedAt: '2025-08-18T10:00:00Z' },
  { id: 'edu_mod_02', title: 'Disclosure & FTC', status: 'done', completedAt: '2025-08-18T10:20:00Z' },
  { id: 'edu_mod_03', title: 'Brand Safety', status: 'todo' }
];

export async function getModules(): Promise<EducationModule[]> {
  return modules;
}

export async function completeModule(id: string): Promise<DecisionRDS> {
  const m = modules.find(x => x.id === id);
  if (!m) throw new Error('not found');
  
  m.status = 'done';
  m.completedAt = new Date().toISOString();
  
  const freshnessDays = 30; // demo
  const r: DecisionRDS = {
    id: `rds_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    reasons: [freshnessDays > 365 ? 'EDU_STALE' : 'EDU_FRESH'],
    result: freshnessDays > 365 ? 'deny' : 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  };
  
  recordReceipt(r);
  return r;
}

function hashInputs(obj: any): string {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 24);
}