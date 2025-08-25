import { recordReceipt } from '@/features/receipts/record';
import { canPlaceOrder } from './policy';
import type { Wallet, Asset } from './types';

export async function placeOrder({ 
  wallet, 
  side, 
  asset, 
  qty, 
  price 
}: { 
  wallet: Wallet; 
  side: 'buy' | 'sell'; 
  asset: Asset; 
  qty: number; 
  price: number;
}): Promise<{ ok: boolean; reason?: string; orderId?: string }> {
  const usd = qty * price;
  const gate = canPlaceOrder(wallet, asset, usd);
  
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'crypto.trade.signal', 
    reasons: [wallet.walletId, side, asset, String(qty), String(price)], 
    created_at: new Date().toISOString() 
  });
  
  if (!gate.ok) {
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'crypto.trade.blocked', 
      reasons: [gate.reason || ''], 
      created_at: new Date().toISOString() 
    });
    return { ok: false, reason: gate.reason };
  }
  
  if (wallet.exchange?.scopes !== 'trade') {
    return { ok: false, reason: 'no_trade_scope' };
  }
  
  // TODO: call exchange to place order
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'crypto.trade.order', 
    reasons: [wallet.walletId, side, asset], 
    created_at: new Date().toISOString() 
  });
  
  return { ok: true, orderId: `order_${Date.now()}` };
}

export async function getQuote(
  asset: Asset,
  side: 'buy' | 'sell',
  qty: number
): Promise<{ price: number; timestamp: string }> {
  // TODO: call real price API
  const mockPrices: Record<Asset, number> = {
    'BTC': 45000,
    'ETH': 2800,
    'USDC': 1,
    'USDT': 1,
    'SOL': 120,
    'Other': 100
  };
  
  const price = mockPrices[asset] || 100;
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'crypto.quote.requested',
    reasons: [asset, side, String(qty), String(price)],
    created_at: new Date().toISOString()
  });
  
  return {
    price,
    timestamp: new Date().toISOString()
  };
}