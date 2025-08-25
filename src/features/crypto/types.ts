export type Custody = 'custodial' | 'watch';
export type Exchange = 'Coinbase' | 'Gemini' | 'Kraken' | 'IBKR' | 'Other';
export type Asset = 'BTC' | 'ETH' | 'USDC' | 'USDT' | 'SOL' | 'Other';

export type Wallet = {
  walletId: string;
  ownerUserId: string;
  custody: Custody;
  label: string;
  addresses?: Array<{ chain: 'BTC' | 'ETH' | 'SOL' | 'Other'; address: string }>;
  exchange?: { name: Exchange; accountRef: string; scopes: 'read' | 'trade' };
  policy?: { 
    maxUsdPerDay: number; 
    whitelist?: string[]; 
    approvals?: number; 
    withdrawAllowlist?: string[] 
  };
  createdAt: string;
  updatedAt: string;
};

export type Position = { 
  asset: Asset; 
  amount: number; 
  usdValue: number; 
  costBasis?: number 
};

export type Tx = { 
  ts: string; 
  kind: 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'stake' | 'income' | 'fee'; 
  asset: Asset; 
  qty: number; 
  price: number; 
  fee?: number; 
  txid?: string; 
  address?: string 
};

export type TaxLot = { 
  asset: Asset; 
  qty: number; 
  cost: number; 
  acquired: string; 
  disposed?: string; 
  proceeds?: number 
};