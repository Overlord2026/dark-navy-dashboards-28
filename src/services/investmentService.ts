
import { supabase } from '@/lib/supabase';
import type { InvestmentOffering } from '@/hooks/useInvestmentData';
import { FLAGS } from '@/config/flags';
import { withDemoFallback } from './demoService';

export const investmentService = {
  // Seed data for initial offerings
  async seedOfferings() {
    const offerings = [
      // Real Assets
      {
        name: "Blue Owl Real Estate Net Lease Trust",
        description: "Blue Owl Real Estate Net Lease Trust (ORENT) aims to deliver a resilient real estate strategy by acquiring and managing a diversified portfolio of single-tenant commercial properties that are net leased on long-term contracts to creditworthy tenants. The structure provides tax-advantaged, predictable income distributions.",
        firm: "Blue Owl",
        minimum_investment: "$50,000",
        performance: "+12.4%",
        lockup_period: "5-7 years",
        tags: ["Real Estate", "Net Lease", "Income"],
        featured: true,
        category_id: "real-assets"
      },
      {
        name: "CIM Opportunity Zone Fund, L.P.",
        description: "CIM Opportunity Zone Fund is a low-leverage, open-ended 'develop-to-core' vehicle designed for infrastructure and real estate investments in designated Opportunity Zones. The fund leverages CIM's twenty-year experience in Opportunity Zones and focuses on investments in urban areas.",
        firm: "CIM Group",
        minimum_investment: "$100,000",
        performance: "+9.8%",
        lockup_period: "7-10 years",
        tags: ["Opportunity Zones", "Urban Development", "Tax-Advantaged"],
        featured: true,
        category_id: "real-assets"
      },
      // Structured Investments
      {
        name: "Goldman Sachs Structured Notes",
        description: "Customized structured products with defined risk/return profiles based on underlying assets.",
        firm: "Goldman Sachs",
        minimum_investment: "$10,000",
        performance: "+8.4%",
        lockup_period: "3-5 years",
        tags: ["Structured Notes", "Tailored", "Defined Outcome"],
        featured: true,
        category_id: "structured-investments"
      },
      {
        name: "JPMorgan Principal Protected Notes",
        description: "Principal-protected structured notes that provide downside protection while participating in market upside. These investments combine the security of principal protection with exposure to various market indices.",
        firm: "JPMorgan Chase",
        minimum_investment: "$25,000",
        performance: "+7.2%",
        lockup_period: "2-4 years",
        tags: ["Principal Protection", "Market-Linked", "Downside Buffer"],
        featured: true,
        category_id: "structured-investments"
      },
      // Digital Assets
      {
        name: "Galaxy Bitcoin Fund LP",
        description: "The Galaxy Bitcoin Fund / Galaxy Institutional Bitcoin Fund are low management fee, institutional grade vehicles for bitcoin exposure. They offer streamlined execution, secure third-party custody, familiar reporting, and dedicated client service.",
        firm: "Galaxy Digital",
        minimum_investment: "$100,000",
        performance: "+67.4%",
        lockup_period: "1-3 years",
        tags: ["Bitcoin", "Cryptocurrency", "Institutional Grade"],
        featured: true,
        category_id: "digital-assets"
      },
      // Collectibles
      {
        name: "Masterworks",
        description: "Masterworks is the first and only platform providing investment products to gain exposure to Contemporary art. Headquartered in New York City, the firm employs over 180 individuals to research, source, and manage a portfolio of blue-chip art.",
        firm: "Masterworks",
        minimum_investment: "$15,000",
        performance: "+18.5%",
        lockup_period: "3-7 years",
        tags: ["Art", "Contemporary Art", "Blue Chip"],
        featured: true,
        category_id: "collectibles"
      }
    ];

    return withDemoFallback(async () => {
      const { data, error } = await supabase
        .from('investment_offerings')
        .upsert(offerings, { onConflict: 'name' })
        .select();

      if (error) throw error;
      console.log('Seeded offerings:', data);
      return data;
    }, '/investment_offerings/seed', offerings);
  },

  async getOfferingsByCategory(categoryId: string) {
    return withDemoFallback(async () => {
      const { data, error } = await supabase
        .from('investment_offerings')
        .select('*')
        .eq('category_id', categoryId)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, `/investment_offerings/category/${categoryId}`, []);
  },

  async getFeaturedOfferings() {
    return withDemoFallback(async () => {
      const { data, error } = await supabase
        .from('investment_offerings')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, '/investment_offerings/featured', []);
  }
};
