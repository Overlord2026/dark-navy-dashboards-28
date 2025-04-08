
interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

export interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  lockupPeriod: string;
  lockUp: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
  performance?: string;
}

export const mockOfferings = {
  "private-equity": [
    {
      id: 1,
      name: "Acme Growth Fund",
      description: "Invests in high-growth tech startups",
      minimumInvestment: "$25,000",
      lockupPeriod: "5 years",
      lockUp: "5 years",
      firm: "Acme Ventures",
      tags: ["Tech", "Growth"],
      strategy: {
        overview: "Invest in early-stage tech companies",
        approach: "Hands-on support for portfolio companies",
        target: "20% IRR",
        stage: "Early Stage",
        geography: "North America",
        sectors: ["Software", "AI"],
        expectedReturn: "20% annually",
        benchmarks: ["S&P 500", "Nasdaq"]
      },
      platform: "OurPlatform",
      category: "private-equity",
      investorQualification: "Accredited Investors",
      liquidity: "Illiquid",
      subscriptions: "Monthly",
      performance: "20%"
    },
    {
      id: 2,
      name: "Beta Innovation Fund",
      description: "Focuses on innovative healthcare solutions",
      minimumInvestment: "$50,000",
      lockupPeriod: "7 years",
      lockUp: "7 years",
      firm: "Beta Capital",
      tags: ["Healthcare", "Innovation"],
      strategy: {
        overview: "Invest in cutting-edge healthcare technologies",
        approach: "Partner with leading research institutions",
        target: "25% IRR",
        stage: "Seed",
        geography: "Global",
        sectors: ["Biotech", "Medical Devices"],
        expectedReturn: "22% annually",
        benchmarks: ["S&P 500", "MSCI World"]
      },
      platform: "BetaPlatform",
      category: "private-equity",
      investorQualification: "Qualified Purchasers",
      liquidity: "Illiquid",
      subscriptions: "Quarterly",
      performance: "22%"
    }
  ],
  "private-debt": [
    {
      id: 3,
      name: "Omega Credit Fund",
      description: "Provides direct loans to mid-sized companies",
      minimumInvestment: "$100,000",
      lockupPeriod: "3 years",
      lockUp: "3 years",
      firm: "Omega Investments",
      tags: ["Debt", "Mid-Sized"],
      strategy: {
        overview: "Offer flexible financing solutions to growing businesses",
        approach: "Focus on companies with strong cash flow",
        target: "10% yield",
        stage: "Growth",
        geography: "United States",
        sectors: ["Manufacturing", "Services"],
        expectedReturn: "10% annually",
        benchmarks: ["Bloomberg Barclays Aggregate Bond Index"]
      },
      platform: "OmegaPlatform",
      category: "private-debt",
      investorQualification: "Accredited Investors",
      liquidity: "Illiquid",
      subscriptions: "Monthly",
      performance: "10%"
    },
    {
      id: 4,
      name: "Delta Income Fund",
      description: "Specializes in distressed debt opportunities",
      minimumInvestment: "$75,000",
      lockupPeriod: "4 years",
      lockUp: "4 years",
      firm: "Delta Partners",
      tags: ["Distressed", "Income"],
      strategy: {
        overview: "Acquire undervalued debt of struggling companies",
        approach: "Restructure debt to maximize recovery",
        target: "15% IRR",
        stage: "Turnaround",
        geography: "Europe",
        sectors: ["Retail", "Energy"],
        expectedReturn: "14% annually",
        benchmarks: ["Credit Suisse Leveraged Loan Index"]
      },
      platform: "DeltaPlatform",
      category: "private-debt",
      investorQualification: "Qualified Clients",
      liquidity: "Illiquid",
      subscriptions: "Quarterly",
      performance: "14%"
    }
  ],
  "digital-assets": [
    {
      id: 5,
      name: "Crypto Alpha Fund",
      description: "Invests in a diversified portfolio of cryptocurrencies",
      minimumInvestment: "$25,000",
      lockupPeriod: "1 year",
      lockUp: "1 year",
      firm: "Crypto Investments",
      tags: ["Crypto", "Diversified"],
      strategy: {
        overview: "Capitalize on the growth of digital currencies",
        approach: "Active trading and staking strategies",
        target: "30% return",
        stage: "All Stages",
        geography: "Global",
        sectors: ["Blockchain", "DeFi"],
        expectedReturn: "28% annually",
        benchmarks: ["Bitcoin", "Ethereum"]
      },
      platform: "CryptoPlatform",
      category: "digital-assets",
      investorQualification: "Accredited Investors",
      liquidity: "Limited",
      subscriptions: "Weekly",
      performance: "28%"
    },
    {
      id: 6,
      name: "NFT Innovation Fund",
      description: "Focuses on high-value non-fungible tokens",
      minimumInvestment: "$50,000",
      lockupPeriod: "2 years",
      lockUp: "2 years",
      firm: "NFT Capital",
      tags: ["NFT", "Innovation"],
      strategy: {
        overview: "Invest in unique digital assets with high growth potential",
        approach: "Curate and manage a portfolio of rare NFTs",
        target: "40% return",
        stage: "Early Stage",
        geography: "Global",
        sectors: ["Art", "Collectibles"],
        expectedReturn: "35% annually",
        benchmarks: ["NFT Market Index"]
      },
      platform: "NFTPlatform",
      category: "digital-assets",
      investorQualification: "Qualified Purchasers",
      liquidity: "Illiquid",
      subscriptions: "Monthly",
      performance: "35%"
    }
  ],
  "real-assets": [
    {
      id: 7,
      name: "Green Infrastructure Fund",
      description: "Invests in sustainable infrastructure projects",
      minimumInvestment: "$100,000",
      lockupPeriod: "10 years",
      lockUp: "10 years",
      firm: "Eco Investments",
      tags: ["Infrastructure", "Sustainable"],
      strategy: {
        overview: "Develop and manage eco-friendly infrastructure",
        approach: "Partner with governments and private entities",
        target: "8% yield",
        stage: "Development",
        geography: "Emerging Markets",
        sectors: ["Renewable Energy", "Water Treatment"],
        expectedReturn: "7% annually",
        benchmarks: ["Infrastructure Index"]
      },
      platform: "EcoPlatform",
      category: "real-assets",
      investorQualification: "Accredited Investors",
      liquidity: "Illiquid",
      subscriptions: "Annually",
      performance: "7%"
    },
    {
      id: 8,
      name: "Urban Real Estate Fund",
      description: "Focuses on prime real estate in urban centers",
      minimumInvestment: "$75,000",
      lockupPeriod: "8 years",
      lockUp: "8 years",
      firm: "City Properties",
      tags: ["Real Estate", "Urban"],
      strategy: {
        overview: "Acquire and develop high-value properties in key cities",
        approach: "Focus on properties with strong rental income",
        target: "12% return",
        stage: "Acquisition",
        geography: "North America",
        sectors: ["Commercial", "Residential"],
        expectedReturn: "11% annually",
        benchmarks: ["Real Estate Index"]
      },
      platform: "CityPlatform",
      category: "real-assets",
      investorQualification: "Qualified Clients",
      liquidity: "Illiquid",
      subscriptions: "Quarterly",
      performance: "11%"
    }
  ]
};

export const getCategoryDetails = (categoryId: string): { name: string, description: string } => {
  switch(categoryId) {
    case "private-equity":
      return {
        name: "Private Equity",
        description: "Direct investments in private companies, leveraged buyouts, and growth capital strategies."
      };
    case "private-debt":
      return {
        name: "Private Debt",
        description: "Direct lending, mezzanine financing, and distressed debt investments across sectors."
      };
    case "digital-assets":
      return {
        name: "Digital Assets",
        description: "Cryptocurrencies, blockchain technologies, and Web3 infrastructure investments."
      };
    case "real-assets":
      return {
        name: "Real Assets",
        description: "Real estate, infrastructure, natural resources, and tangible assets with intrinsic value."
      };
    case "hedge-fund":
      return {
        name: "Hedge Fund",
        description: "Alternative investment strategies with active management and flexible investment approaches."
      };
    case "venture-capital":
      return {
        name: "Venture Capital",
        description: "Funding for early-stage, high-potential startups and emerging companies."
      };
    case "collectibles":
      return {
        name: "Collectibles",
        description: "Art, rare items, trading cards, and memorabilia with potential investment value."
      };
    case "structured-investments":
      return {
        name: "Structured Investments",
        description: "Custom financial products with defined outcomes and specific risk-return profiles."
      };
    default:
      return {
        name: "Alternative Investments",
        description: "Various alternative investment strategies beyond traditional stocks and bonds."
      };
  }
};
