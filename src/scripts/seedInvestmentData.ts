
import { supabase } from '@/lib/supabase';

export const seedInvestmentData = async () => {
  console.log('Starting to seed investment data...');

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
    {
      name: "Clarion Ventures Qualified Opportunity Zone Partners",
      description: "Clarion Ventures Qualified Opportunity Zone Partners focuses on real estate investments through a 'Create-to-Core' strategy in designated Qualified Opportunity Zones, leveraging Clarion's expertise in value-add and opportunistic investments.",
      firm: "Clarion Partners",
      minimum_investment: "$250,000",
      performance: "+8.6%",
      lockup_period: "5-8 years",
      tags: ["Opportunity Zones", "Create-to-Core", "Value-Add"],
      featured: false,
      category_id: "real-assets"
    },
    {
      name: "KKR Infrastructure Conglomerate LLC ('K-INFRA')",
      description: "K-INFRA offers investors exposure to private infrastructure opportunities alongside an institutional manager, with a diversified strategy spanning different sectors, geographies, and asset allocations.",
      firm: "KKR",
      minimum_investment: "$500,000",
      performance: "+14.2%",
      lockup_period: "6-9 years",
      tags: ["Infrastructure", "Diversified", "Global"],
      featured: true,
      category_id: "real-assets"
    },
    {
      name: "iCapital Infrastructure Investments Access Fund, L.P.",
      description: "iCapital Infrastructure Investments Access Fund is a diversified portfolio focused on essential services, holding private companies and assets across multiple sectors, providing robust and stable returns.",
      firm: "iCapital",
      minimum_investment: "$100,000",
      performance: "+11.3%",
      lockup_period: "5-8 years",
      tags: ["Infrastructure", "Essential Services", "Stable Returns"],
      featured: false,
      category_id: "real-assets"
    },
    {
      name: "1031 Exchange DSTs",
      description: "1031 Exchange DSTs allow investors who have appreciated real estate to defer taxes by exchanging into like-kind properties, offering a streamlined mechanism to access high-quality commercial real estate investments.",
      firm: "Various Sponsors",
      minimum_investment: "$25,000",
      performance: "+9.5%",
      lockup_period: "3-5 years",
      tags: ["1031 Exchange", "Tax Deferral", "Commercial Real Estate"],
      featured: true,
      category_id: "real-assets"
    },
    {
      name: "Apollo Realty Income Solutions, Inc.",
      description: "Apollo Realty Income Solutions is Apollo's flagship direct real estate income product, designed as a perpetually-offered, non-traded REIT that provides individual investors access to a diversified, income-generating portfolio of commercial properties.",
      firm: "Apollo Global Management",
      minimum_investment: "$50,000",
      performance: "+10.7%",
      lockup_period: "3-5 years",
      tags: ["REIT", "Commercial Real Estate", "Income"],
      featured: true,
      category_id: "real-assets"
    },
    {
      name: "Ares Diversified Real Estate Exchange - Diversified V DST",
      description: "Ares Diversified Real Estate Exchange is a 1031 exchange program enabling investors to transition appreciated real estate into a diversified portfolio of high-quality commercial properties.",
      firm: "Ares Management",
      minimum_investment: "$100,000",
      performance: "+8.9%",
      lockup_period: "4-6 years",
      tags: ["1031 Exchange", "Diversified Portfolio", "Commercial Real Estate"],
      featured: false,
      category_id: "real-assets"
    },
    {
      name: "Ares Industrial Real Estate Exchange - Portfolio 7 DST",
      description: "Ares Industrial Real Estate Exchange is a 1031 exchange option focused on providing investors with access to high-quality industrial properties through a diversified portfolio structure.",
      firm: "Ares Management",
      minimum_investment: "$100,000",
      performance: "+9.2%",
      lockup_period: "4-6 years",
      tags: ["1031 Exchange", "Industrial Real Estate", "Portfolio"],
      featured: false,
      category_id: "real-assets"
    },
    {
      name: "Ares Industrial Real Estate Income Trust Inc.",
      description: "Ares Industrial Real Estate Income Trust is a non-exchange traded REIT offering investors exposure to industrial real estate, focusing on well-leased distribution warehouses and aiming to deliver consistent monthly income distributions.",
      firm: "Ares Management",
      minimum_investment: "$50,000",
      performance: "+10.1%",
      lockup_period: "3-5 years",
      tags: ["REIT", "Industrial Real Estate", "Monthly Income"],
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
    {
      name: "Morgan Stanley Buffered PLUS",
      description: "Buffered Performance Leveraged Upside Securities (PLUS) offering enhanced returns on the upside with limited downside risk through a buffer zone that protects against moderate market declines.",
      firm: "Morgan Stanley",
      minimum_investment: "$15,000",
      performance: "+9.8%",
      lockup_period: "2-3 years",
      tags: ["Buffered", "Enhanced Upside", "Market-Linked"],
      featured: false,
      category_id: "structured-investments"
    },
    {
      name: "Barclays Autocallable Notes",
      description: "Structured investments that automatically call (redeem) if the underlying asset reaches a predetermined level on specified observation dates, potentially providing above-market returns for sideways or slightly bullish markets.",
      firm: "Barclays",
      minimum_investment: "$10,000",
      performance: "+6.5%",
      lockup_period: "1-2 years",
      tags: ["Autocallable", "Early Redemption", "Enhanced Yield"],
      featured: false,
      category_id: "structured-investments"
    },
    {
      name: "Citigroup Callable Yield Notes",
      description: "Income-focused structured products that offer above-market coupon rates with issuer call features, providing investors with enhanced yield potential in exchange for giving the issuer redemption flexibility.",
      firm: "Citigroup",
      minimum_investment: "$10,000",
      performance: "+5.8%",
      lockup_period: "1-3 years",
      tags: ["Income", "Callable", "Enhanced Yield"],
      featured: true,
      category_id: "structured-investments"
    },

    // Digital Assets
    {
      name: "Galaxy Bitcoin Fund LP",
      description: "The Galaxy Bitcoin Fund / Galaxy Institutional Bitcoin Fund are low management fee, institutional grade vehicles for bitcoin exposure. They offer streamlined execution, secure third-party custody, familiar reporting, and dedicated client service. The Fund invests directly in bitcoin and is priced based on the Bloomberg Bitcoin Cryptocurrency Fixing Rate (\"XBT\"), aiming to mitigate the complexities of investing in digital assets.",
      firm: "Galaxy Digital",
      minimum_investment: "$100,000",
      performance: "+67.4%",
      lockup_period: "1-3 years",
      tags: ["Bitcoin", "Cryptocurrency", "Institutional Grade"],
      featured: true,
      category_id: "digital-assets"
    },
    {
      name: "Galaxy Crypto Index Fund LP",
      description: "The Galaxy Crypto Index Fund seeks to provide diversified, dynamic, institutionally-wrapped exposure to digital assets by tracking and rebalancing monthly to the rules-based Bloomberg Galaxy Crypto Index (ticker: BGCI). It offers institutional-grade exposure while mitigating many of the complexities of digital asset investing.",
      firm: "Galaxy Digital",
      minimum_investment: "$250,000",
      performance: "+34.8%",
      lockup_period: "3-5 years",
      tags: ["Diversified", "Crypto Index", "Monthly Rebalancing"],
      featured: true,
      category_id: "digital-assets"
    },
    {
      name: "Galaxy Institutional Bitcoin Fund LP",
      description: "The Galaxy Institutional Bitcoin Fund is designed to provide institutional-quality exposure to bitcoin by investing directly in bitcoin, with pricing based on the Bloomberg Galaxy Bitcoin Index (\"BTC\"). It aims to simplify digital asset investment with outsourced trading, operations, finance, and custody services.",
      firm: "Galaxy Digital",
      minimum_investment: "$500,000",
      performance: "+28.6%",
      lockup_period: "2-4 years",
      tags: ["Bitcoin", "Institutional", "Direct Exposure"],
      featured: true,
      category_id: "digital-assets"
    },
    {
      name: "Galaxy Institutional Bitcoin Fund Ltd",
      description: "Galaxy Institutional Bitcoin Fund Ltd provides institutional-quality bitcoin exposure by investing directly in bitcoin, priced based on the Bloomberg Galaxy Bitcoin Index (\"BTC\"). It offers a streamlined and secure approach to digital asset investment with dedicated services for trading and custody.",
      firm: "Galaxy Digital",
      minimum_investment: "$500,000",
      performance: "+42.1%",
      lockup_period: "1-2 years",
      tags: ["Bitcoin", "Offshore", "Institutional"],
      featured: false,
      category_id: "digital-assets"
    },
    {
      name: "Galaxy Institutional Ethereum Fund LP",
      description: "The Galaxy Institutional Ethereum Fund provides institutional-grade exposure to ETH by investing directly in Ethereum. It is priced using the Bloomberg Galaxy Ethereum Index, and the Fund is designed to mitigate digital asset investment complexities through outsourced services for trading, operations, and custody.",
      firm: "Galaxy Digital",
      minimum_investment: "$250,000",
      performance: "+31.2%",
      lockup_period: "2-3 years",
      tags: ["Ethereum", "Institutional", "Direct Exposure"],
      featured: true,
      category_id: "digital-assets"
    },

    // Collectibles
    {
      name: "Masterworks",
      description: "Masterworks is the first and only platform providing investment products to gain exposure to Contemporary art. Headquartered in New York City, the firm employs over 180 individuals to research, source, and manage a portfolio of blue-chip art. Masterworks has reviewed more than $20 billion of art for its investment vehicles.",
      firm: "Masterworks",
      minimum_investment: "$15,000",
      performance: "+18.5%",
      lockup_period: "3-7 years",
      tags: ["Art", "Contemporary Art", "Blue Chip"],
      featured: true,
      category_id: "collectibles"
    },
    {
      name: "Wine and Spirits Arbitrage Fund \"Vint Diversified Offering II\"",
      description: "Vint runs a tax-advantaged wine and spirits fund, sourcing investment-grade bottles from Europe at a 20-40% discount to US market value, importing them into the US, and selling them in the US market. The fund has historically generated around 24% net returns for investors and is expected to qualify under IRS code section 1202 (QSBS) for a federal income tax exemption on returns after 5 years.",
      firm: "Vint",
      minimum_investment: "$25,000",
      performance: "+24.0%",
      lockup_period: "5+ years",
      tags: ["Wine", "Spirits", "Tax-Advantaged", "Arbitrage"],
      featured: true,
      category_id: "collectibles"
    }
  ];

  try {
    const { data, error } = await supabase
      .from('investment_offerings')
      .upsert(offerings, { onConflict: 'name,firm' })
      .select();

    if (error) {
      console.error('Error seeding offerings:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length} investment offerings`);
    return data;
  } catch (error) {
    console.error('Failed to seed investment data:', error);
    throw error;
  }
};

// Function to call from browser console for testing
(window as any).seedInvestmentData = seedInvestmentData;
