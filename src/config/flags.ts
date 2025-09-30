// Simple, non-circular flags module with BOTH named and default exports.

type Mode = "staging" | "prod";

export const FLAGS = {
  PUBLIC_MODE: ((import.meta as any)?.env?.PUBLIC_MODE as Mode) ?? "staging",
  ENABLE_EXPERIMENTS: ((import.meta as any)?.env?.ENABLE_EXPERIMENTS ?? "false") === "true",
  ENABLE_DEV_PANEL: ((import.meta as any)?.env?.ENABLE_DEV_PANEL ?? "true") !== "false",

  // Convenience booleans (vite sets these at build time)
  IS_DEVELOPMENT: !!(import.meta as any)?.env?.DEV,
  IS_PRODUCTION: !!(import.meta as any)?.env?.PROD,

  // Legacy keys used around the app; keep them to avoid breakage
  legacyBeta: ((import.meta as any)?.env?.LEGACY_BETA ?? "false") === "true",
  showNonProdBanner: true,
  
  // Agent automation (disabled by default)
  __ENABLE_AGENT_AUTOMATIONS__: false,
  __REQUIRE_APPROVAL_HIGH_RISK__: true,
} as const;

// Default export for any legacy `import flags from '@/config/flags'`
export default FLAGS;
