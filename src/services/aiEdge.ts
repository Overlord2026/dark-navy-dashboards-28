// src/services/aiEdge.ts
import { FLAGS } from '@/config/flags';
import { demoService } from './demoService';

// Supabase project configuration
const SUPABASE_PROJECT_ID = 'xcmqjkvyvuhoslbzmlgi';
const SUPABASE_FUNCTIONS_URL = `https://${SUPABASE_PROJECT_ID}.functions.supabase.co`;

export async function callEdgeJSON(fn: string, payload: unknown, init?: RequestInit) {
  // In demo mode, return mock data instead of calling live edge functions
  if (FLAGS.IS_DEVELOPMENT) {
    console.log(`[DEMO] Mocking edge function call: ${fn}`, payload);
    return demoService.mockNetworkCall(`/functions/v1/${fn}`, {
      success: true,
      message: `Demo response for ${fn}`,
      data: payload,
      timestamp: new Date().toISOString(),
      // Mock specific responses for known functions
      ...(fn === 'policy-eval' && {
        decision_rds: {
          ...(payload as Record<string, any>),
          inputs_hash: 'sha256:demo_' + Math.random().toString(36).substr(2, 9),
          policy_version: 'v1',
          receipt_hash: 'sha256:demo_receipt_' + Math.random().toString(36).substr(2, 9)
        }
      }),
      ...(fn === 'pmalpha-ddpack' && {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        items: ((payload as any)?.items || []).map((it: any, i: number) => 
          typeof it === "string" ? { id: it, seq: i + 1 } : { ...it, seq: i + 1 }
        )
      })
    });
  }

  // Only call /functions/v1/* URLs - never external hosts from client
  const url = `/functions/v1/${fn}`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    body: JSON.stringify(payload),
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Edge ${fn} ${res.status}`);
  }

  return res.json();
}