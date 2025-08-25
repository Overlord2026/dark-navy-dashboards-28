/**
 * AI Fabric Reasoning Layer
 * Combines retrieval, policy, and memory for explainable decisions
 */

import { searchVector } from './vector';
import { evaluatePolicy } from './policy';
import { emitEvent } from './events';
import { recordReceipt } from '@/features/receipts/record';

export type ReasoningContext = {
  userId: string;
  scope: string;
  query: string;
  data?: Record<string, any>;
};

export type Evidence = {
  source: string;
  content: string;
  relevance: number;
  meta?: Record<string, any>;
};

export type Decision = {
  decision: string;
  confidence: number;
  reasoning: string[];
  evidence: Evidence[];
  policy: {
    allowed: boolean;
    reason: string;
  };
  proofSlip: {
    inputsHash: string;
    timestamp: string;
    reasonCodes: string[];
  };
};

export async function reason(context: ReasoningContext): Promise<Decision> {
  console.log(`[AI Fabric] Reasoning for ${context.scope}: ${context.query}`);
  
  // 1. Retrieve relevant evidence
  const vectorResults = await searchVector(context.query, 5);
  const evidence: Evidence[] = vectorResults.map(result => ({
    source: result.meta.source || 'unknown',
    content: result.text,
    relevance: result.score,
    meta: result.meta
  }));
  
  // 2. Evaluate policy constraints
  const policyDecision = evaluatePolicy(context.scope, context.data || {});
  
  // 3. Generate reasoning (stub - replace with actual AI inference)
  const reasoning = [
    `Found ${evidence.length} relevant documents`,
    `Policy check: ${policyDecision.allowed ? 'ALLOWED' : 'BLOCKED'} - ${policyDecision.reason}`,
    'Applied business rules and constraints'
  ];
  
  // 4. Make decision
  const decision = policyDecision.allowed ? 'PROCEED' : 'REQUIRE_APPROVAL';
  const confidence = Math.min(0.95, evidence.reduce((sum, e) => sum + e.relevance, 0) / evidence.length);
  
  // 5. Generate proof slip
  const inputsHash = await generateHash(JSON.stringify({
    query: context.query,
    scope: context.scope,
    timestamp: new Date().toISOString()
  }));
  
  const reasonCodes = [
    context.scope,
    policyDecision.allowed ? 'policy_ok' : 'policy_blocked',
    `evidence_${evidence.length}`,
    `confidence_${Math.floor(confidence * 100)}`
  ];
  
  const result: Decision = {
    decision,
    confidence,
    reasoning,
    evidence,
    policy: policyDecision,
    proofSlip: {
      inputsHash,
      timestamp: new Date().toISOString(),
      reasonCodes
    }
  };
  
  // 6. Log decision (content-free)
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'ai.fabric.decision',
    reasons: reasonCodes,
    created_at: new Date().toISOString()
  } as any);
  
  // 7. Emit event
  await emitEvent({
    type: 'advise.issued',
    actor: context.userId,
    subject: context.scope,
    meta: { decision, confidence, reasonCodes }
  });
  
  return result;
}

async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
}