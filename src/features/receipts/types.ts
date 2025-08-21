export type AnchorRef = { 
  merkle_root: string; 
  cross_chain_locator: {
    chain_id: string; 
    tx_ref: string; 
    ts: number; 
    anchor_epoch?: number;
  }[];
} | null;

export type DecisionRDS = { 
  id: string; 
  type: 'Decision-RDS'; 
  action: 'education' | 'disclosure' | 'publish'; 
  policy_version: string; 
  inputs_hash: string; 
  reasons: string[]; 
  result: 'approve' | 'deny'; 
  disclosure_pack?: string; 
  asset_id?: string; 
  anchor_ref: AnchorRef; 
  ts: string;
};

export type ConsentRDS = { 
  id: string; 
  type: 'Consent-RDS'; 
  purpose_of_use: string; 
  scope: {
    minimum_necessary: boolean;
    roles: string[];
    resources: string[];
  }; 
  consent_time: string; 
  expiry: string; 
  freshness_score: number; 
  co_sign_routes?: {
    route: string;
    ts: string;
    ok: boolean;
  }[]; 
  result: 'approve' | 'deny'; 
  reason: 'OK' | 'CONSENT_STALE' | 'SCOPE_MISMATCH'; 
  anchor_ref: AnchorRef | null; 
  ts: string;
};

export type SettlementRDS = { 
  id: string; 
  type: 'Settlement-RDS'; 
  offerLock: string; 
  attribution_hash: string; 
  split_tree_hash: string; 
  escrow_state: 'held' | 'released'; 
  anchor_ref: AnchorRef; 
  ts: string;
};

export type DeltaRDS = { 
  id: string; 
  type: 'Delta-RDS'; 
  prior_ref: string; 
  diffs: {
    field: string;
    from: any;
    to: any;
  }[]; 
  reasons: string[]; 
  ts: string;
};

export type AnyRDS = DecisionRDS | ConsentRDS | SettlementRDS | DeltaRDS;