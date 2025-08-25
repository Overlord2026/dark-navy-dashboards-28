export type DelegatedScope = 'read' | 'trade';

export type DelegatedPolicy = {
  maxUsdPerDay?: number;
  assetWhitelist?: string[];       // e.g. fund tickers/ETFs
  dualApproval?: boolean;          // client confirm each trade
  durationMinutes: number;         // trade window length (e.g. 30)
};

export type DelegatedGrant = {
  grantId: string;
  accountId: string;
  clientUserId: string;
  advisorUserId: string;
  scopes: DelegatedScope[];        // 'read' always implied
  policy: DelegatedPolicy;
  status: 'granted' | 'revoked' | 'expired';
  createdAt: string; 
  revokedAt?: string; 
  expiresAt?: string;
};

export type DelegatedSession = {
  sessionId: string;
  grantId: string;
  accountId: string;
  advisorUserId: string;
  startedAt: string;
  endsAt: string;
  scope: DelegatedScope[];         // locked from grant
  approvedAt?: string;             // step-up confirmation timestamp
  status: 'pending' | 'active' | 'ended' | 'expired';
};