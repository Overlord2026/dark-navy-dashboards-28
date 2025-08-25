import type { Wallet } from './types';

export function canPlaceOrder(
  wallet: Wallet, 
  asset: string, 
  usdAmount: number
): { ok: boolean; reason?: string } {
  const p = wallet?.policy;
  
  if (p?.maxUsdPerDay && usdAmount > p.maxUsdPerDay) {
    return { ok: false, reason: 'max_per_day' };
  }
  
  if (p?.whitelist && p.whitelist.length && !p.whitelist.includes(asset)) {
    return { ok: false, reason: 'asset_whitelist' };
  }
  
  return { ok: true };
}

export function canWithdraw(
  wallet: Wallet,
  toAddress: string,
  usdAmount: number
): { ok: boolean; reason?: string } {
  const p = wallet?.policy;
  
  if (p?.withdrawAllowlist && p.withdrawAllowlist.length && !p.withdrawAllowlist.includes(toAddress)) {
    return { ok: false, reason: 'address_not_allowlisted' };
  }
  
  if (p?.maxUsdPerDay && usdAmount > p.maxUsdPerDay) {
    return { ok: false, reason: 'max_per_day' };
  }
  
  return { ok: true };
}