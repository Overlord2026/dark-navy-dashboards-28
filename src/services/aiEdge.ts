// src/services/aiEdge.ts
import { CONFIG } from '@/config/flags';
import { demoService } from './demoService';

// Supabase project configuration
const SUPABASE_PROJECT_ID = 'xcmqjkvyvuhoslbzmlgi';
const SUPABASE_FUNCTIONS_URL = `https://${SUPABASE_PROJECT_ID}.functions.supabase.co`;

export async function callEdgeJSON(fn: string, payload: any, init?: RequestInit) {
  // In demo mode, return mock data instead of calling live edge functions
  if (CONFIG.DEMO_MODE) {
    console.log(`[DEMO] Mocking edge function call: ${fn}`, payload);
    return demoService.mockNetworkCall(`/functions/v1/${fn}`, {
      success: true,
      message: `Demo response for ${fn}`,
      data: payload,
      timestamp: new Date().toISOString(),
      // Mock specific responses for known functions
      ...(fn === 'policy-eval' && {
        decision_rds: {
          ...payload,
          inputs_hash: 'sha256:demo_' + Math.random().toString(36).substr(2, 9),
          policy_version: 'v1',
          receipt_hash: 'sha256:demo_receipt_' + Math.random().toString(36).substr(2, 9)
        }
      }),
      ...(fn === 'pmalpha-ddpack' && {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        items: (payload.items || []).map((it: any, i: number) => 
          typeof it === "string" ? { id: it, seq: i + 1 } : { ...it, seq: i + 1 }
        )
      })
    });
  }

  try {
    // Use full Supabase function URL for production calls
    const url = `${SUPABASE_FUNCTIONS_URL}/${fn}`;
    console.log(`[EDGE] Calling: ${url}`);
    
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
      const errorText = await res.text();
      console.error(`[EDGE] Error ${res.status} from ${fn}:`, errorText);
      
      // If deployment fails, fallback to demo mode for this call
      console.log(`[EDGE] Falling back to demo mode for ${fn}`);
      return demoService.mockNetworkCall(`/functions/v1/${fn}`, {
        success: true,
        message: `Fallback demo response for ${fn}`,
        data: payload,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

    return res.json();
  } catch (error) {
    console.error(`[EDGE] Network error calling ${fn}:`, error);
    
    // Network error fallback to demo mode
    console.log(`[EDGE] Network fallback to demo mode for ${fn}`);
    return demoService.mockNetworkCall(`/functions/v1/${fn}`, {
      success: true,
      message: `Network fallback demo response for ${fn}`,
      data: payload,
      timestamp: new Date().toISOString(),
      fallback: true,
      error: String(error)
    });
  }
}