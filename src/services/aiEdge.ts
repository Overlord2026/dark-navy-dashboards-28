// src/services/aiEdge.ts
import { CONFIG } from '@/config/flags';
import { demoService } from './demoService';
export async function callEdgeJSON(fn: string, payload: any, init?: RequestInit) {
  // In demo mode, return mock data instead of calling live edge functions
  if (CONFIG.DEMO_MODE) {
    console.log(`[DEMO] Mocking edge function call: ${fn}`, payload);
    return demoService.mockNetworkCall(`/functions/v1/${fn}`, {
      success: true,
      message: `Demo response for ${fn}`,
      data: payload,
      timestamp: new Date().toISOString()
    });
  }

  const url = `/functions/v1/${fn}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers||{}) },
    body: JSON.stringify(payload), ...init,
  });
  if (!res.ok) throw new Error(`Edge ${fn} ${res.status}`);
  return res.json();
}