import type { DelegatedPolicy } from './types';

export function planAllowsDelegated(plan: any) {
  // Eligible when SDBA present OR provider supports OBO.
  return !!(plan?.sdbAvailable || plan?.provider === 'Fidelity' || plan?.provider === 'Schwab');
}

export function checkTradePolicy(
  policy: DelegatedPolicy, 
  { asset, usd }: { asset: string; usd: number }
) {
  if (policy.maxUsdPerDay && usd > policy.maxUsdPerDay) {
    return { ok: false, reason: 'max_usd' };
  }
  
  if (policy.assetWhitelist && policy.assetWhitelist.length && !policy.assetWhitelist.includes(asset)) {
    return { ok: false, reason: 'not_whitelisted' };
  }
  
  return { ok: true };
}