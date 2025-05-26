
export type InsuranceType = "term-life" | "permanent-life" | "annuities" | "fiduciary-annuities" | "long-term-care" | "healthcare" | "homeowners" | "automobile" | "umbrella";
export type InsuranceProvider = "pinnacle" | "dpl" | "pacific" | "travelers" | "guardian" | "metlife" | "progressive" | "statefarm";

export interface ProviderInfo {
  id: InsuranceProvider;
  name: string;
  description: string;
  workflow: string;
  otherOfferings: string;
  topCarriers: string;
}

export interface InsuranceTypeInfo {
  providers: InsuranceProvider[];
}
