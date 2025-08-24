import type { AnchorRef } from '../receipts/types';

type AnchorInput = AnchorRef | { cross_chain_locator?: any[] } | null | undefined;

export type { AnchorRef };

export type AnchorResolution = {
  found: boolean;
  confirmed_count: number;
  total_count: number;
  anchor_ref?: AnchorRef;
  n_of_m_status?: { accepted: boolean; };
};

export async function anchorBatch(root: string, options?: {
  providers?: string[];
  max_cost_cents?: number;
  min_finality_seconds?: number;
  require_confirmations?: number;
}): Promise<AnchorRef> {
  const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const providers = options?.providers || ['perm-A'];
  
  return { 
    merkle_root: root, 
    cross_chain_locator: [{
      chain_id: 'perm-A', 
      tx_ref: '0xabc', 
      ts: Math.floor(Date.now() / 1000)
    }],
    batch_id: batchId,
    created_at: new Date().toISOString(),
    total_cost_cents: 25,
    providers_used: providers,
    anchors: providers.map(provider => ({
      status: 'confirmed',
      provider_id: provider,
      tx_ref: `0x${Math.random().toString(16).slice(2, 18)}`,
      confirmations: 6
    }))
  };
}

export function acceptNofM(ref: AnchorInput, n = 1): boolean {
  const list = ref?.cross_chain_locator ?? [];
  return list.length >= n;
}

export async function resolveAnchor(root: string): Promise<AnchorResolution> {
  // Simulate anchor resolution
  const found = Math.random() > 0.3; // 70% chance of finding anchor
  
  if (!found) {
    return {
      found: false,
      confirmed_count: 0,
      total_count: 0
    };
  }

  const confirmed_count = Math.floor(Math.random() * 3) + 1;
  const total_count = 3;
  
  return {
    found: true,
    confirmed_count,
    total_count,
    anchor_ref: {
      merkle_root: root,
      cross_chain_locator: Array.from({ length: total_count }, (_, i) => ({
        chain_id: `chain-${i + 1}`,
        tx_ref: `0x${Math.random().toString(16).slice(2, 18)}`,
        ts: Math.floor(Date.now() / 1000) - Math.random() * 3600
      })),
      batch_id: `batch_${Date.now()}`,
      created_at: new Date().toISOString(),
      anchors: Array.from({ length: total_count }, (_, i) => ({
        status: i < confirmed_count ? 'confirmed' : 'pending',
        provider_id: `provider_${i + 1}`,
        tx_ref: `0x${Math.random().toString(16).slice(2, 18)}`,
        confirmations: i < confirmed_count ? 6 : 0
      }))
    },
    n_of_m_status: {
      accepted: confirmed_count >= 1
    }
  };
}

export function getAnchorProviders() {
  return {
    polygon_pos: {
      id: 'polygon_pos',
      name: 'Polygon PoS',
      type: 'permissionless',
      enabled: true,
      chain_id: 'polygon-137',
      cost_per_anchor: 25,
      avg_finality_seconds: 30
    },
    dev_local: {
      id: 'dev_local',
      name: 'Local Dev Chain',
      type: 'permissioned',
      enabled: true,
      chain_id: 'local-dev',
      cost_per_anchor: 0,
      avg_finality_seconds: 1
    },
    arweave: {
      id: 'arweave',
      name: 'Arweave',
      type: 'permissionless',
      enabled: true,
      chain_id: 'arweave',
      cost_per_anchor: 150,
      avg_finality_seconds: 120
    }
  };
}