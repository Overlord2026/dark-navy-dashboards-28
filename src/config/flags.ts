type Mode = "staging" | "prod";

export const FLAGS = {
  PUBLIC_MODE: ((import.meta as any)?.env?.PUBLIC_MODE as Mode) ?? "staging",
  ENABLE_EXPERIMENTS: ((import.meta as any)?.env?.ENABLE_EXPERIMENTS ?? "false") === "true",
  ENABLE_DEV_PANEL: ((import.meta as any)?.env?.ENABLE_DEV_PANEL ?? "true") !== "false",
  IS_DEVELOPMENT: !!(import.meta as any)?.env?.DEV,
  IS_PRODUCTION: !!(import.meta as any)?.env?.PROD,
  legacyBeta: ((import.meta as any)?.env?.LEGACY_BETA ?? "false") === "true",
  showNonProdBanner: true,
  __ENABLE_AGENT_AUTOMATIONS__: false,
  __REQUIRE_APPROVAL_HIGH_RISK__: true,
} as const;

export default FLAGS;
