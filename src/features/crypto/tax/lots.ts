// FIFO lots; replace with provider lots when available
import { setLots, getTxs } from '../store';
import { recordReceipt } from '@/features/receipts/record';
import type { Tx, TaxLot } from '../types';

export async function recomputeLots(
  walletId: string, 
  txs?: Tx[]
): Promise<{ ok: boolean; lots: TaxLot[] }> {
  const transactions = txs || await getTxs(walletId);
  
  // Simple FIFO computation
  const lots: TaxLot[] = [];
  const holdings: Record<string, { qty: number; cost: number; acquired: string }[]> = {};
  
  for (const tx of transactions.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())) {
    if (tx.kind === 'buy') {
      // Add to holdings
      if (!holdings[tx.asset]) holdings[tx.asset] = [];
      holdings[tx.asset].push({
        qty: tx.qty,
        cost: tx.qty * tx.price,
        acquired: tx.ts
      });
    } else if (tx.kind === 'sell') {
      // Remove from holdings FIFO and create tax lots
      if (!holdings[tx.asset]) continue;
      
      let remaining = tx.qty;
      while (remaining > 0 && holdings[tx.asset].length > 0) {
        const lot = holdings[tx.asset][0];
        const takeQty = Math.min(remaining, lot.qty);
        const takeCost = (takeQty / lot.qty) * lot.cost;
        
        lots.push({
          asset: tx.asset,
          qty: takeQty,
          cost: takeCost,
          acquired: lot.acquired,
          disposed: tx.ts,
          proceeds: takeQty * tx.price
        });
        
        lot.qty -= takeQty;
        lot.cost -= takeCost;
        remaining -= takeQty;
        
        if (lot.qty <= 0) {
          holdings[tx.asset].shift();
        }
      }
    }
  }
  
  await setLots(walletId, lots);
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'crypto.tax.lots.computed',
    reasons: [walletId, String(lots.length)],
    created_at: new Date().toISOString()
  });
  
  return { ok: true, lots };
}

export async function exportForm8949(walletId: string): Promise<{ csv: string }> {
  const lots = await getLots(walletId);
  
  const csv = [
    'Description,Date Acquired,Date Sold,Proceeds,Cost Basis,Gain/Loss',
    ...lots.filter(lot => lot.disposed).map(lot => {
      const gainLoss = (lot.proceeds || 0) - lot.cost;
      return [
        `${lot.qty} ${lot.asset}`,
        lot.acquired.split('T')[0],
        lot.disposed?.split('T')[0] || '',
        lot.proceeds || 0,
        lot.cost,
        gainLoss
      ].join(',');
    })
  ].join('\n');
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'crypto.tax.8949.exported',
    reasons: [walletId],
    created_at: new Date().toISOString()
  });
  
  return { csv };
}

import { getLots as getStoredLots } from '../store';

function getLots(walletId: string): Promise<TaxLot[]> {
  return getStoredLots(walletId);
}