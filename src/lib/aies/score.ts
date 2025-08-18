import { Connector, Consent } from "./types";

export function consentIsFresh(consent: Consent | undefined, minDays = 90): boolean {
  if (!consent) return false;
  if (consent.revokedAt) return false;
  if (!consent.expiresAt) return true;
  const now = Date.now();
  const exp = new Date(consent.expiresAt).getTime();
  const daysLeft = (exp - now) / (1000*60*60*24);
  return daysLeft >= minDays;
}

// Simple multi-factor score: base - friction - risk; boost for fresh consent
export function connectorScore(c: Connector, hasFreshConsent: boolean): number {
  const raw = c.baseScore - c.friction - c.risk;
  return Math.max(0, Math.min(1, raw + (hasFreshConsent ? 0.15 : -0.15)));
}