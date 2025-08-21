/**
 * Anchor resolver API endpoint
 */

import { serve } from "https://deno.land/std@0.223.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnchorRecord {
  chain_id: string;
  tx_ref: string;
  ts: number;
  epoch: number;
  provider_id: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  block_height?: number;
}

interface AnchorRef {
  root_hash: string;
  anchors: AnchorRecord[];
  created_at: string;
  batch_id: string;
  providers_used: string[];
  total_cost_cents?: number;
}

interface AnchorResolution {
  found: boolean;
  confirmed_count: number;
  total_count: number;
  providers_confirmed: string[];
  providers_failed: string[];
  earliest_timestamp?: number;
  latest_timestamp?: number;
  anchor_ref?: AnchorRef;
  n_of_m_status?: {
    accepted: boolean;
    required_n: number;
    confirmed_count: number;
  };
}

// Mock anchor storage (in production, this would be a database)
const anchorStorage = new Map<string, AnchorRef>();

// Initialize with some mock data
initializeMockData();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);

  // Route: GET /anchor/:root
  if (req.method === 'GET' && pathSegments[0] === 'anchor' && pathSegments[1]) {
    const rootHash = pathSegments[1];
    const nParam = url.searchParams.get('n');
    const requiredN = nParam ? parseInt(nParam, 10) : 1;

    console.log(`Resolving anchor for root: ${rootHash.substring(0, 16)}... (n=${requiredN})`);

    try {
      const resolution = await resolveAnchor(rootHash, requiredN);
      
      return new Response(JSON.stringify(resolution), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Anchor resolution error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to resolve anchor',
          details: String(error) 
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Route: POST /anchor (for storing/creating anchors)
  if (req.method === 'POST' && pathSegments[0] === 'anchor') {
    try {
      const body = await req.json();
      const { root_hash, providers = ['polygon_pos', 'dev_local'], max_cost_cents = 1000 } = body;

      if (!root_hash) {
        return new Response(
          JSON.stringify({ error: 'root_hash is required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log(`Creating anchor batch for root: ${root_hash.substring(0, 16)}...`);

      const anchorRef = await createMockAnchorBatch(root_hash, providers, max_cost_cents);
      
      return new Response(JSON.stringify({ 
        success: true, 
        anchor_ref: anchorRef,
        batch_id: anchorRef.batch_id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Anchor creation error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create anchor',
          details: String(error) 
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Route: GET /anchor (list all anchors)
  if (req.method === 'GET' && pathSegments[0] === 'anchor' && !pathSegments[1]) {
    const anchors = Array.from(anchorStorage.values()).map(ref => ({
      root_hash: ref.root_hash,
      batch_id: ref.batch_id,
      created_at: ref.created_at,
      providers_used: ref.providers_used,
      anchor_count: ref.anchors.length,
      confirmed_count: ref.anchors.filter(a => a.status === 'confirmed').length
    }));

    return new Response(JSON.stringify({ anchors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Default 404 response
  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { 
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});

/**
 * Resolve anchor status for a given root hash
 */
async function resolveAnchor(rootHash: string, requiredN: number = 1): Promise<AnchorResolution> {
  const anchorRef = anchorStorage.get(rootHash);
  
  if (!anchorRef) {
    return {
      found: false,
      confirmed_count: 0,
      total_count: 0,
      providers_confirmed: [],
      providers_failed: [],
      n_of_m_status: {
        accepted: false,
        required_n: requiredN,
        confirmed_count: 0
      }
    };
  }

  // Simulate checking current blockchain status
  const updatedAnchors = anchorRef.anchors.map(anchor => updateAnchorStatus(anchor));
  
  // Update stored reference
  anchorRef.anchors = updatedAnchors;
  anchorStorage.set(rootHash, anchorRef);

  const confirmed = updatedAnchors.filter(a => a.status === 'confirmed');
  const failed = updatedAnchors.filter(a => a.status === 'failed');
  const pending = updatedAnchors.filter(a => a.status === 'pending');

  const nOfMAccepted = confirmed.length >= requiredN;

  const resolution: AnchorResolution = {
    found: true,
    confirmed_count: confirmed.length,
    total_count: updatedAnchors.length,
    providers_confirmed: confirmed.map(a => a.provider_id),
    providers_failed: failed.map(a => a.provider_id),
    anchor_ref: anchorRef,
    n_of_m_status: {
      accepted: nOfMAccepted,
      required_n: requiredN,
      confirmed_count: confirmed.length
    }
  };

  if (confirmed.length > 0) {
    resolution.earliest_timestamp = Math.min(...confirmed.map(a => a.ts));
    resolution.latest_timestamp = Math.max(...confirmed.map(a => a.ts));
  }

  console.log(`Anchor resolution complete: ${confirmed.length}/${updatedAnchors.length} confirmed (N=${requiredN}, accepted=${nOfMAccepted})`);

  return resolution;
}

/**
 * Update anchor status based on elapsed time (simulation)
 */
function updateAnchorStatus(anchor: AnchorRecord): AnchorRecord {
  if (anchor.status === 'failed') {
    return anchor;
  }

  const ageSeconds = (Date.now() - anchor.ts) / 1000;
  
  // Provider-specific finality times
  const finalityTimes: Record<string, number> = {
    'ethereum_mainnet': 180,
    'polygon_pos': 30,
    'hyperledger_fabric': 5,
    'dev_local': 1
  };

  const requiredFinality = finalityTimes[anchor.provider_id] || 60;

  if (anchor.status === 'pending' && ageSeconds > requiredFinality) {
    return {
      ...anchor,
      status: 'confirmed',
      confirmations: Math.floor(ageSeconds / 10) + 1
    };
  }

  return anchor;
}

/**
 * Create a mock anchor batch (simulation)
 */
async function createMockAnchorBatch(
  rootHash: string, 
  providers: string[], 
  maxCostCents: number
): Promise<AnchorRef> {
  const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const anchors: AnchorRecord[] = [];
  let totalCost = 0;

  const providerCosts: Record<string, number> = {
    'ethereum_mainnet': 500,
    'polygon_pos': 10,
    'hyperledger_fabric': 25,
    'dev_local': 0
  };

  for (const providerId of providers) {
    const cost = providerCosts[providerId] || 50;
    
    if (totalCost + cost > maxCostCents) {
      console.warn(`Skipping provider ${providerId} due to cost limit`);
      break;
    }

    const anchor: AnchorRecord = {
      chain_id: getChainId(providerId),
      tx_ref: generateTxRef(providerId),
      ts: Date.now(),
      epoch: Math.floor(Date.now() / 1000),
      provider_id: providerId,
      status: 'pending',
      confirmations: 0,
      block_height: Math.floor(Math.random() * 1000000) + 15000000
    };

    anchors.push(anchor);
    totalCost += cost;
  }

  const anchorRef: AnchorRef = {
    root_hash: rootHash,
    anchors,
    created_at: new Date().toISOString(),
    batch_id: batchId,
    providers_used: providers,
    total_cost_cents: totalCost
  };

  // Store the anchor reference
  anchorStorage.set(rootHash, anchorRef);

  console.log(`Created anchor batch ${batchId} with ${anchors.length} anchors (cost: $${totalCost/100})`);

  return anchorRef;
}

/**
 * Get chain ID for provider
 */
function getChainId(providerId: string): string {
  const chainIds: Record<string, string> = {
    'ethereum_mainnet': 'eth-1',
    'polygon_pos': 'poly-137',
    'hyperledger_fabric': 'fabric-healthcare-1',
    'dev_local': 'dev-local-1'
  };
  
  return chainIds[providerId] || `chain-${providerId}`;
}

/**
 * Generate mock transaction reference
 */
function generateTxRef(providerId: string): string {
  const prefixes: Record<string, string> = {
    'ethereum_mainnet': '0x',
    'polygon_pos': '0x',
    'hyperledger_fabric': 'fabric:',
    'dev_local': '0xdev'
  };

  const prefix = prefixes[providerId] || 'tx:';
  const hash = Math.random().toString(16).substring(2, 18).padStart(16, '0');
  const timestamp = Date.now().toString(16);
  
  return `${prefix}${hash}${timestamp}`;
}

/**
 * Initialize mock data for testing
 */
function initializeMockData(): void {
  // Create some sample anchors for testing
  const sampleRoots = [
    'merkle_root_health_rds_123456789abcdef',
    'merkle_root_pa_rds_987654321fedcba',
    'merkle_root_consent_rds_1a2b3c4d5e6f'
  ];

  sampleRoots.forEach((root, index) => {
    const batchId = `sample_batch_${index + 1}`;
    const baseTime = Date.now() - (index * 300000); // Stagger times
    
    const anchors: AnchorRecord[] = [
      {
        chain_id: 'poly-137',
        tx_ref: `0x${Math.random().toString(16).substring(2, 18)}${baseTime.toString(16)}`,
        ts: baseTime,
        epoch: Math.floor(baseTime / 1000),
        provider_id: 'polygon_pos',
        status: 'confirmed',
        confirmations: 12,
        block_height: 15000000 + index * 1000
      },
      {
        chain_id: 'dev-local-1',
        tx_ref: `0xdev${Math.random().toString(16).substring(2, 12)}${baseTime.toString(16)}`,
        ts: baseTime + 5000,
        epoch: Math.floor((baseTime + 5000) / 1000),
        provider_id: 'dev_local',
        status: 'confirmed',
        confirmations: 6,
        block_height: 100000 + index * 100
      }
    ];

    if (index === 2) {
      // Add a failed anchor for the third sample
      anchors.push({
        chain_id: 'eth-1',
        tx_ref: 'FAILED',
        ts: baseTime + 10000,
        epoch: Math.floor((baseTime + 10000) / 1000),
        provider_id: 'ethereum_mainnet',
        status: 'failed',
        confirmations: 0
      });
    }

    const anchorRef: AnchorRef = {
      root_hash: root,
      anchors,
      created_at: new Date(baseTime).toISOString(),
      batch_id: batchId,
      providers_used: anchors.map(a => a.provider_id),
      total_cost_cents: anchors.length * 25
    };

    anchorStorage.set(root, anchorRef);
  });

  console.log(`Initialized ${sampleRoots.length} sample anchor references`);
}