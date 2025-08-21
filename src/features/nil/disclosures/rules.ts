import { recordReceipt } from '@/features/receipts/record';
import { DecisionRDS } from '@/features/receipts/types';

export interface DisclosurePack {
  id: string;
  name: string;
  template: string;
  channels: string[];
  jurisdictions: string[];
}

const disclosurePacks: DisclosurePack[] = [
  {
    id: 'us-ig-standard',
    name: 'US Instagram Standard',
    template: '#ad #sponsored #partnership with @{brand}',
    channels: ['IG'],
    jurisdictions: ['US']
  },
  {
    id: 'us-tiktok-standard',
    name: 'US TikTok Standard',
    template: '#sponsored #partnership with {brand}',
    channels: ['TikTok'],
    jurisdictions: ['US']
  },
  {
    id: 'us-youtube-standard',
    name: 'US YouTube Standard',
    template: 'This video is sponsored by {brand}',
    channels: ['YouTube'],
    jurisdictions: ['US']
  },
  {
    id: 'ca-ig-standard',
    name: 'Canada Instagram Standard',
    template: '#publicité #commandité avec @{brand}',
    channels: ['IG'],
    jurisdictions: ['CA']
  }
];

export function chooseDisclosurePack(params: {
  channel: 'IG' | 'TikTok' | 'YouTube';
  jurisdiction: 'US' | 'CA';
}): { pack: DisclosurePack; reasons: string[] } {
  const { channel, jurisdiction } = params;
  
  const pack = disclosurePacks.find(p => 
    p.channels.includes(channel) && p.jurisdictions.includes(jurisdiction)
  );

  if (!pack) {
    throw new Error(`No disclosure pack found for ${channel} in ${jurisdiction}`);
  }

  const reasons = [
    'DISCLOSURE_READY',
    `CHANNEL_${channel}`,
    `JURISDICTION_${jurisdiction}`
  ];

  return { pack, reasons };
}

export function confirmDisclosurePack(packId: string, params: {
  channel: 'IG' | 'TikTok' | 'YouTube';
  jurisdiction: 'US' | 'CA';
}): DecisionRDS {
  const { pack, reasons } = chooseDisclosurePack(params);
  
  if (pack.id !== packId) {
    throw new Error('Pack ID mismatch');
  }

  const rds: DecisionRDS = {
    id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Decision-RDS',
    action: 'disclosure',
    policy_version: 'E-2025.08',
    inputs_hash: hashInputs({ pack_id: packId, ...params }),
    reasons,
    result: 'approve',
    disclosure_pack: packId,
    anchor_ref: null,
    ts: new Date().toISOString()
  };

  return recordReceipt(rds);
}

function hashInputs(obj: any): string {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 24);
}