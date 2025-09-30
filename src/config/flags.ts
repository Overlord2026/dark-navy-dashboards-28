// Global type declaration for Vite-injected build ID
declare const __BUILD_ID__: string;

type Mode = "staging" | "prod";

export const FLAGS = {
  PUBLIC_MODE: (import.meta as any)?.env?.PUBLIC_MODE as Mode ?? "staging",
  ENABLE_EXPERIMENTS: ((import.meta as any)?.env?.ENABLE_EXPERIMENTS ?? "false") === "true",
  ENABLE_DEV_PANEL: ((import.meta as any)?.env?.ENABLE_DEV_PANEL ?? "true") !== "false",
  IS_DEVELOPMENT: !!(import.meta as any)?.env?.DEV,
  IS_PRODUCTION: !!(import.meta as any)?.env?.PROD,
  legacyBeta: ((import.meta as any)?.env?.LEGACY_BETA ?? "false") === "true",
  showNonProdBanner: true,
  __ENABLE_AGENT_AUTOMATIONS__: false,
  __REQUIRE_APPROVAL_HIGH_RISK__: true,
} as const;

export const BUILD_ID: string =
  (typeof __BUILD_ID__ !== "undefined" ? String(__BUILD_ID__) : null) ??
  ((import.meta as any)?.env?.BUILD_ID ?? null) ??
  new Date().toISOString();

// Compatibility exports
export const IS_PROD = FLAGS.IS_PRODUCTION;
export const ENABLE_DEV_PANEL = FLAGS.ENABLE_DEV_PANEL;
export const ENABLE_EXPERIMENTS = FLAGS.ENABLE_EXPERIMENTS;

// Stub functions for feature flag compatibility
export type FeatureFlag = string;
export function getFlag(key: string): boolean {
  return false;
}
export function setFlag(key: string, value: boolean): void {
  // no-op stub
}
export function getFlags(): Record<string, boolean> {
  return {};
}
export function resetFlags(): void {
  // no-op stub
}
export function getBuildInfo() {
  const env = import.meta as any;
  return {
    flavor: env.env.VITE_BUILD_FLAVOR || env.env.MODE || 'dev',
    mode: env.env.MODE || 'development',
    timestamp: new Date().toISOString(),
    dev: !!env.env.DEV,
    prod: !!env.env.PROD,
    baseUrl: env.env.VITE_SITE_URL || env.env.BASE_URL || window.location.origin,
    sha: env.env.VITE_GIT_SHA || undefined,
    builtAt: env.env.VITE_BUILD_TIMESTAMP || undefined,
  };
}
export const FLAG_DESCRIPTIONS: Record<string, string> = {};
export const flags: Record<string, boolean> = {};

export default { FLAGS, BUILD_ID };
