// Crypto estate directives management
export interface CryptoDirective {
  id: string;
  userId: string;
  walletId: string;
  type: 'transfer' | 'hold' | 'liquidate';
  beneficiary: string;
  instructions: string;
  accessMethod: 'seed' | 'hardware' | 'exchange' | 'vault';
  createdAt: string;
  updatedAt: string;
}

export async function getDirectives(userId: string): Promise<CryptoDirective[]> {
  // Mock implementation - replace with actual data source
  const mockDirectives: CryptoDirective[] = [
    {
      id: 'dir_1',
      userId,
      walletId: 'wallet_btc_main',
      type: 'transfer',
      beneficiary: 'Spouse',
      instructions: 'Transfer all BTC holdings to spouse immediately',
      accessMethod: 'hardware',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'dir_2', 
      userId,
      walletId: 'wallet_eth_defi',
      type: 'liquidate',
      beneficiary: 'Estate',
      instructions: 'Liquidate DeFi positions, convert to USD for estate distribution',
      accessMethod: 'seed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  return mockDirectives;
}