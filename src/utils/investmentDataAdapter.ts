import type { InvestmentOffering } from "@/hooks/useInvestmentData";

// Legacy offering interface for backward compatibility
export interface LegacyOffering {
  id: number | string;
  name: string;
  description: string;
  firm: string;
  minimumInvestment: string;
  performance: string;
  lockupPeriod: string;
  tags: string[];
  featured?: boolean;
}

// Convert legacy offering data to new InvestmentOffering format
export const adaptLegacyOffering = (
  legacyOffering: LegacyOffering,
  categoryId: string
): InvestmentOffering & { id?: string | number; minimumInvestment?: string; lockupPeriod?: string } => {
  return {
    id: String(legacyOffering.id),
    name: legacyOffering.name,
    description: legacyOffering.description,
    firm: legacyOffering.firm,
    minimum_investment: legacyOffering.minimumInvestment,
    performance: legacyOffering.performance,
    lockup_period: legacyOffering.lockupPeriod,
    tags: legacyOffering.tags,
    featured: legacyOffering.featured || false,
    category_id: categoryId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Keep legacy fields for backward compatibility
    minimumInvestment: legacyOffering.minimumInvestment,
    lockupPeriod: legacyOffering.lockupPeriod,
  };
};
