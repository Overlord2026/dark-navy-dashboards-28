
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import { OfferingsList } from "@/components/investments/OfferingsList";

// Updated database of offerings for each category
const CATEGORY_DATA = {
  "private-equity": {
    name: "Private Equity",
    description: "Investment in companies not listed on a public exchange, aiming for substantial long-term returns through active management and eventual sale or public offering.",
    icon: "Briefcase",
    color: "text-purple-500",
    offerings: [
      {
        id: 1,
        name: "AMG Pantheon Fund, LLC",
        description: "Provides Accredited Investors unique exposure to a diversified private equity portfolio assembled by Pantheon's Global Investment Team. The Fund offers differentiated private equity solutions.",
        minimumInvestment: "$25,000",
        performance: "+15.7% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "AMG Funds",
        tags: ["Private Equity", "Multi-Strategy", "Accredited Investor"],
        platform: "CAIS",
        category: "Multi-Strategy",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity portfolio",
          approach: "Multi-manager approach",
          target: "Various private equity strategies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 2,
        name: "Arcs Private Markets Fund",
        description: "The Fund seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. The Fund's differentiated solution provides access to a diversified portfolio of private companies through a professional investment team with the oversight of an experienced manager and investment firm.",
        minimumInvestment: "$25,000",
        performance: "+18.2% IRR",
        lockupPeriod: "Semi-annual liquidity",
        lockUp: "Semi-annual liquidity",
        firm: "Arcs",
        tags: ["Private Equity", "Secondaries", "Non-Accredited"],
        platform: "Arcs",
        category: "Diversified",
        investorQualification: "Non-Accredited",
        liquidity: "Semi-annual",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity investment solution",
          approach: "Multi-manager approach",
          target: "Private companies across stages",
          stage: "Various",
          geography: "North America, Europe",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 3,
        name: "Blackstone Private Equity Strategies Fund, (TE) L.P. (\"BXPE Tax Exempt\")",
        description: "BXPE seeks to provide institutional-quality exposure to Blackstone's private equity platform designed for tax-exempt investors such as IRAs, 401(k)s and other retirement accounts. Access to Blackstone's private capital platform with $300+ billion in AUM.",
        minimumInvestment: "$10,000",
        performance: "+17.5% IRR",
        lockupPeriod: "Quarterly after 2-year lock-up",
        lockUp: "2-year initial, then quarterly",
        firm: "Blackstone",
        tags: ["Private Equity", "Buyout & Growth Equity", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Buyout & Growth",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly after 2-year lock-up",
        subscriptions: "Monthly",
        strategy: {
          overview: "Institutional-quality exposure to Blackstone's private equity platform",
          approach: "Multi-manager approach",
          target: "Buyout and growth equity investments",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 4,
        name: "CAIS Vista Foundation Fund V, L.P.",
        description: "Vista Foundation Fund V, L.P. (\"the Partnership\", the \"Fund\" or \"VFF V\") was formed by Vista Equity Partners Management, LLC (and, when the context requires, together with its affiliates, \"Vista\" or the \"Firm\") primarily to pursue controlling interests in small- and middle-market enterprise software, data and technology-enabled solutions companies with enterprise values generally between $200 million and $750 million.",
        minimumInvestment: "$100,000",
        performance: "+22.3% IRR",
        lockupPeriod: "7-10 years",
        lockUp: "7-10 years",
        firm: "Vista Equity Partners",
        tags: ["Private Equity", "Buyout", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Technology Buyout",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Technology-focused buyout fund",
          approach: "Control investments",
          target: "Enterprise software companies",
          stage: "Small and middle-market",
          geography: "North America",
          sectors: ["Enterprise Software", "Technology-enabled Services"],
          expectedReturn: "20-25% IRR",
          benchmarks: ["Cambridge US Tech PE Index"],
        }
      },
      {
        id: 5,
        name: "JP Morgan Private Markets Fund",
        description: "JP Morgan Private Markets Fund has a small-mid market PE focus, multi-manager approach, simplified structure & terms, and between 8 depth of resources offered by one of the largest investment managers in the world.",
        minimumInvestment: "$250,000",
        performance: "+16.8% IRR",
        lockupPeriod: "Limited liquidity",
        lockUp: "Limited liquidity",
        firm: "JP Morgan",
        tags: ["Private Equity", "Equity", "Qualified Client"],
        platform: "JP Morgan",
        category: "Multi-Strategy",
        investorQualification: "Qualified Client",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        strategy: {
          overview: "Small-mid market PE focus",
          approach: "Multi-manager approach",
          target: "Small and mid-market companies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 6,
        name: "AMG Pantheon Fund, LLC (Class I)",
        description: "AMG Pantheon Fund, LLC (The Fund) seeks to provide Accredited Investors exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund works to offer benefits like enhanced liquidity, unique strategy mix and necessary through a single allocation. With a lower investment minimum, a simplified 1099 tax report, and streamlined onboarding process, the Fund aims to deliver private equity portfolios while addressing practical challenges.",
        minimumInvestment: "$50,000",
        performance: "+15.7% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "AMG Funds",
        tags: ["Private Equity", "Buyout", "Qualified Purchaser"],
        platform: "CAIS",
        category: "Multi-Strategy",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity portfolio",
          approach: "Multi-manager approach",
          target: "Various private equity strategies",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 7,
        name: "Arcs Private Markets Fund iCapital Offshore Access Fund SP1",
        description: "Arcs Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, that seeks to deliver attractive, long-term capital appreciation through a professionally-managed, diversified portfolio of private companies.",
        minimumInvestment: "$50,000",
        performance: "+18.2% IRR",
        lockupPeriod: "Limited liquidity",
        lockUp: "Limited liquidity",
        firm: "Arcs/iCapital",
        tags: ["Private Equity", "Buyout & Growth Equity", "Qualified Client"],
        platform: "iCapital",
        category: "Diversified",
        investorQualification: "Qualified Client",
        liquidity: "Limited",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private equity investment solution",
          approach: "Secondary investments focus",
          target: "Private companies across stages",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      },
      {
        id: 8,
        name: "BlackRock Private Investment Fund",
        description: "With stocks at all-time highs and bond yields at sustained lows, we expect long-term public market gains to be more muted. Look to potentially amplify returns through BlackRock Private Investment Fund (BPIF), which offers investors the opportunity to access private investments in a continuously offered fund.",
        minimumInvestment: "$50,000",
        performance: "+16.9% IRR",
        lockupPeriod: "Quarterly after 1-year lock-up",
        lockUp: "1-year initial, then quarterly",
        firm: "BlackRock",
        tags: ["Private Equity", "Fund of Funds", "Accredited Investor"],
        platform: "BlackRock",
        category: "Fund of Funds",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly after 1-year",
        subscriptions: "Monthly",
        strategy: {
          overview: "Multi-asset private market exposure",
          approach: "Fund of funds",
          target: "Private equity, credit, and real assets",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "12-15% IRR",
          benchmarks: ["Cambridge Global Private Equity Index"],
        }
      },
      {
        id: 9,
        name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
        description: "With stocks at all-time highs and bond yields at sustained lows, we expect long-term public market gains to be more muted. Look to potentially amplify returns through BlackRock Private Investment Fund (BPIF), which offers investors the opportunity to access private investments in a continuously offered fund.",
        minimumInvestment: "$100,000",
        performance: "+16.9% IRR",
        lockupPeriod: "Quarterly after 1-year lock-up",
        lockUp: "1-year initial, then quarterly",
        firm: "BlackRock/iCapital",
        tags: ["Private Equity", "Fund of Funds", "Accredited Investor"],
        platform: "iCapital",
        category: "Fund of Funds",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly after 1-year",
        subscriptions: "Monthly",
        strategy: {
          overview: "Multi-asset private market exposure",
          approach: "Fund of funds",
          target: "Private equity, credit, and real assets",
          stage: "Various",
          geography: "Global",
          sectors: ["Diversified"],
          expectedReturn: "12-15% IRR",
          benchmarks: ["Cambridge Global Private Equity Index"],
        }
      },
      {
        id: 10,
        name: "Bonaccord Capital Partners Fund III",
        description: "Bonaccord Capital Partners II (\"the Fund\") is a middle market GP stakes fund with a focus on making growth capital investments in mid-market private markets sponsors across private equity, private credit, real assets, and real estate. The fund aims to deliver attractive risk-adjusted returns driven by both dividend yields and capital appreciation.",
        minimumInvestment: "$250,000",
        performance: "+19.5% IRR",
        lockupPeriod: "8-10 years",
        lockUp: "8-10 years",
        firm: "Bonaccord Capital Partners",
        tags: ["Private Equity", "GP Stakes", "Accredited Investor"],
        platform: "CAIS",
        category: "GP Stakes",
        investorQualification: "Accredited Investor",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "GP stakes investment in middle market managers",
          approach: "Growth capital investments",
          target: "Private markets sponsors",
          stage: "Middle market",
          geography: "North America, Europe",
          sectors: ["Private Equity", "Private Credit", "Real Assets", "Real Estate"],
          expectedReturn: "15-20% IRR",
          benchmarks: ["Cambridge US PE Index"],
        }
      }
    ]
  },
  "private-debt": {
    name: "Private Debt",
    description: "Direct lending and credit investments with consistent income potential, typically offering lower volatility than equity investments.",
    icon: "Landmark",
    color: "text-blue-500",
    offerings: [
      {
        id: 1,
        name: "Blackstone Private Credit Fund (BCRED)",
        description: "A perpetual-life, non-traded BDC that seeks to deliver attractive risk-adjusted returns with downside protection and diversification across private credit markets.",
        minimumInvestment: "$25,000",
        performance: "+9.4% IRR",
        lockupPeriod: "Quarterly liquidity with restrictions",
        lockUp: "Quarterly liquidity with restrictions",
        firm: "Blackstone",
        tags: ["Private Debt", "BDC", "Accredited Investor"],
        platform: "Blackstone",
        category: "Direct Lending",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly with restrictions",
        subscriptions: "Monthly",
        strategy: {
          overview: "Diversified private credit portfolio",
          approach: "Direct origination and secondary market investments",
          target: "Middle market companies",
          stage: "Various",
          geography: "North America, Europe",
          sectors: ["Diversified"],
          expectedReturn: "8-10% IRR",
          benchmarks: ["Credit Suisse Leveraged Loan Index"],
        }
      },
      {
        id: 2,
        name: "Cliffwater Corporate Lending Fund (CCLFX)",
        description: "Investment objective is to generate current income and, to a lesser extent, long-term capital appreciation by investing primarily in a portfolio of private debt and debt-like securities.",
        minimumInvestment: "$50,000",
        performance: "+8.7% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "Cliffwater",
        tags: ["Private Debt", "Corporate Lending", "Qualified Client"],
        platform: "CAIS",
        category: "Corporate Lending",
        investorQualification: "Qualified Client",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Direct corporate lending",
          approach: "Middle market lending",
          target: "US middle market companies",
          stage: "Established",
          geography: "United States",
          sectors: ["Diversified"],
          expectedReturn: "7-9% IRR",
          benchmarks: ["S&P/LSTA Leveraged Loan Index"],
        }
      },
      {
        id: 3,
        name: "Goldman Sachs Private Middle Market Credit Fund II",
        description: "Primarily invests in directly originated and privately negotiated senior secured loans to middle market companies based in the United States.",
        minimumInvestment: "$250,000",
        performance: "+10.2% IRR",
        lockupPeriod: "Limited liquidity",
        lockUp: "Limited liquidity",
        firm: "Goldman Sachs",
        tags: ["Private Debt", "Middle Market", "Qualified Purchaser"],
        platform: "Goldman Sachs",
        category: "Direct Lending",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        strategy: {
          overview: "US middle market lending",
          approach: "Direct origination",
          target: "Middle market companies",
          stage: "Established",
          geography: "United States",
          sectors: ["Diversified"],
          expectedReturn: "9-11% IRR",
          benchmarks: ["Credit Suisse Leveraged Loan Index"],
        }
      },
      {
        id: 4,
        name: "Carlyle Tactical Private Credit Fund",
        description: "Seeks to produce income by opportunistically investing in private debt and the debt and income-producing securities of U.S. middle-market companies.",
        minimumInvestment: "$25,000",
        performance: "+8.5% IRR",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "Carlyle",
        tags: ["Private Debt", "Opportunistic", "Accredited Investor"],
        platform: "CAIS",
        category: "Opportunistic Credit",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Opportunistic private credit",
          approach: "Flexible investment strategy",
          target: "Middle market companies",
          stage: "Various",
          geography: "North America",
          sectors: ["Diversified"],
          expectedReturn: "8-10% IRR",
          benchmarks: ["ICE BofA High Yield Index"],
        }
      }
    ]
  },
  "digital-assets": {
    name: "Digital Assets",
    description: "Investments in blockchain technologies, cryptocurrencies, and digital tokens that offer potential for growth through participation in the evolving digital economy.",
    icon: "Bitcoin",
    color: "text-orange-500",
    offerings: [
      {
        id: 1,
        name: "Grayscale Bitcoin Trust (GBTC)",
        description: "The first digital currency investment vehicle to attain the status of an SEC reporting company. GBTC enables investors to gain exposure to Bitcoin in the form of a security while avoiding the challenges of buying, storing, and safekeeping Bitcoin directly.",
        minimumInvestment: "$25,000",
        performance: "+43.2% YTD",
        lockupPeriod: "Daily liquidity",
        lockUp: "Daily liquidity",
        firm: "Grayscale",
        tags: ["Digital Assets", "Bitcoin", "Accredited Investor"],
        platform: "Grayscale",
        category: "Single Asset",
        investorQualification: "Accredited Investor",
        liquidity: "Daily",
        subscriptions: "Daily",
        strategy: {
          overview: "Pure Bitcoin exposure",
          approach: "Passive holding",
          target: "Bitcoin",
          stage: "N/A",
          geography: "Global",
          sectors: ["Cryptocurrency"],
          expectedReturn: "Variable based on Bitcoin price",
          benchmarks: ["Bitcoin Price"],
        }
      },
      {
        id: 2,
        name: "Grayscale Ethereum Trust (ETHE)",
        description: "Provides investors with exposure to Ethereum in the form of a security, eliminating the need to buy, store, and safekeep Ethereum directly. ETHE is an SEC reporting company.",
        minimumInvestment: "$25,000",
        performance: "+29.8% YTD",
        lockupPeriod: "Daily liquidity",
        lockUp: "Daily liquidity",
        firm: "Grayscale",
        tags: ["Digital Assets", "Ethereum", "Accredited Investor"],
        platform: "Grayscale",
        category: "Single Asset",
        investorQualification: "Accredited Investor",
        liquidity: "Daily",
        subscriptions: "Daily",
        strategy: {
          overview: "Pure Ethereum exposure",
          approach: "Passive holding",
          target: "Ethereum",
          stage: "N/A",
          geography: "Global",
          sectors: ["Cryptocurrency"],
          expectedReturn: "Variable based on Ethereum price",
          benchmarks: ["Ethereum Price"],
        }
      },
      {
        id: 3,
        name: "Bitwise 10 Crypto Index Fund",
        description: "The first cryptocurrency index fund, holding Bitcoin, Ethereum, and other major cryptocurrencies, weighted by market capitalization. Offers diversified exposure to the crypto asset class.",
        minimumInvestment: "$10,000",
        performance: "+32.5% YTD",
        lockupPeriod: "Weekly liquidity",
        lockUp: "Weekly liquidity",
        firm: "Bitwise",
        tags: ["Digital Assets", "Index Fund", "Accredited Investor"],
        platform: "Bitwise",
        category: "Index",
        investorQualification: "Accredited Investor",
        liquidity: "Weekly",
        subscriptions: "Weekly",
        strategy: {
          overview: "Diversified cryptocurrency exposure",
          approach: "Market cap weighted index",
          target: "Top 10 cryptocurrencies",
          stage: "N/A",
          geography: "Global",
          sectors: ["Cryptocurrency"],
          expectedReturn: "Variable based on crypto market",
          benchmarks: ["Bitwise 10 Large Cap Crypto Index"],
        }
      },
      {
        id: 4,
        name: "Galaxy Vision Hill Opportunistic Fund",
        description: "Actively managed fund investing in cryptocurrency tokens, equities, and venture capital opportunities in the blockchain ecosystem.",
        minimumInvestment: "$100,000",
        performance: "+18.7% YTD",
        lockupPeriod: "Quarterly liquidity",
        lockUp: "Quarterly liquidity",
        firm: "Galaxy Digital",
        tags: ["Digital Assets", "Multi-Strategy", "Qualified Purchaser"],
        platform: "Galaxy Digital",
        category: "Multi-Strategy",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly",
        subscriptions: "Monthly",
        strategy: {
          overview: "Active management across digital assets",
          approach: "Opportunistic allocation",
          target: "Cryptocurrencies, tokens, equities",
          stage: "Various",
          geography: "Global",
          sectors: ["Blockchain", "Cryptocurrency"],
          expectedReturn: "15-25% IRR target",
          benchmarks: ["Bitwise 10 Large Cap Crypto Index"],
        }
      },
      {
        id: 5,
        name: "Pantera Blockchain Fund",
        description: "Venture capital fund investing in early-stage blockchain companies and protocols with significant growth potential.",
        minimumInvestment: "$250,000",
        performance: "+22.3% IRR",
        lockupPeriod: "7-10 years",
        lockUp: "7-10 years",
        firm: "Pantera Capital",
        tags: ["Digital Assets", "Venture Capital", "Qualified Purchaser"],
        platform: "Pantera Capital",
        category: "Venture Capital",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Early-stage blockchain investments",
          approach: "Venture capital",
          target: "Blockchain startups and protocols",
          stage: "Seed, Series A, B",
          geography: "Global",
          sectors: ["Blockchain", "Web3", "DeFi"],
          expectedReturn: "20-30% IRR target",
          benchmarks: ["Cambridge Associates Global Venture Capital Index"],
        }
      }
    ]
  },
  "real-assets": {
    name: "Real Assets",
    description: "Investments in physical assets including real estate, infrastructure, natural resources, and commodities that provide portfolio diversification and potential inflation protection.",
    icon: "Building",
    color: "text-indigo-500",
    offerings: [
      {
        id: 1,
        name: "Blackstone Real Estate Income Trust (BREIT)",
        description: "A non-traded REIT that invests primarily in stabilized income-generating commercial real estate properties with a focus on providing current income to investors.",
        minimumInvestment: "$2,500",
        performance: "+8.4% Annualized",
        lockupPeriod: "Monthly liquidity with restrictions",
        lockUp: "Monthly liquidity with restrictions",
        firm: "Blackstone",
        tags: ["Real Assets", "REIT", "Accredited Investor"],
        platform: "Blackstone",
        category: "Real Estate",
        investorQualification: "Accredited Investor",
        liquidity: "Monthly with restrictions",
        subscriptions: "Monthly",
        strategy: {
          overview: "Institutional quality real estate",
          approach: "Income-focused property acquisition",
          target: "Commercial real estate",
          stage: "Stabilized",
          geography: "United States",
          sectors: ["Multifamily", "Industrial", "Net Lease"],
          expectedReturn: "8-10% Annualized",
          benchmarks: ["MSCI US REIT Index"],
        }
      },
      {
        id: 2,
        name: "Starwood Real Estate Income Trust",
        description: "A non-listed REIT that invests in stabilized, income-producing real estate across the United States and Europe.",
        minimumInvestment: "$5,000",
        performance: "+7.8% Annualized",
        lockupPeriod: "Monthly liquidity with restrictions",
        lockUp: "Monthly liquidity with restrictions",
        firm: "Starwood Capital",
        tags: ["Real Assets", "REIT", "Accredited Investor"],
        platform: "Starwood Capital",
        category: "Real Estate",
        investorQualification: "Accredited Investor",
        liquidity: "Monthly with restrictions",
        subscriptions: "Monthly",
        strategy: {
          overview: "Stabilized real estate portfolio",
          approach: "Core-plus properties",
          target: "Commercial real estate",
          stage: "Stabilized",
          geography: "United States, Europe",
          sectors: ["Multifamily", "Office", "Industrial", "Hospitality"],
          expectedReturn: "7-9% Annualized",
          benchmarks: ["MSCI US REIT Index"],
        }
      },
      {
        id: 3,
        name: "Brookfield Infrastructure Fund IV",
        description: "Invests in high-quality, essential infrastructure assets globally with predictable cash flows and inflation protection characteristics.",
        minimumInvestment: "$250,000",
        performance: "+11.2% IRR",
        lockupPeriod: "10-12 years",
        lockUp: "10-12 years",
        firm: "Brookfield",
        tags: ["Real Assets", "Infrastructure", "Qualified Purchaser"],
        platform: "Brookfield",
        category: "Infrastructure",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Global infrastructure investments",
          approach: "Value-add infrastructure",
          target: "Essential infrastructure assets",
          stage: "Various",
          geography: "Global",
          sectors: ["Transportation", "Utilities", "Energy", "Data"],
          expectedReturn: "10-12% IRR",
          benchmarks: ["S&P Global Infrastructure Index"],
        }
      },
      {
        id: 4,
        name: "KKR Global Infrastructure Investors Fund III",
        description: "Focuses on critical infrastructure investments with defensive characteristics and stable cash flows across OECD countries.",
        minimumInvestment: "$500,000",
        performance: "+10.7% IRR",
        lockupPeriod: "10-12 years",
        lockUp: "10-12 years",
        firm: "KKR",
        tags: ["Real Assets", "Infrastructure", "Qualified Purchaser"],
        platform: "KKR",
        category: "Infrastructure",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Core infrastructure with growth potential",
          approach: "Value creation",
          target: "Mission-critical infrastructure",
          stage: "Various",
          geography: "OECD countries",
          sectors: ["Energy", "Transportation", "Telecom", "Water"],
          expectedReturn: "10-12% IRR",
          benchmarks: ["S&P Global Infrastructure Index"],
        }
      },
      {
        id: 5,
        name: "Prologis U.S. Logistics Venture",
        description: "Focused on industrial real estate and logistics facilities across key U.S. markets with strong growth potential.",
        minimumInvestment: "$100,000",
        performance: "+9.5% IRR",
        lockupPeriod: "7-10 years",
        lockUp: "7-10 years",
        firm: "Prologis",
        tags: ["Real Assets", "Logistics", "Qualified Client"],
        platform: "Prologis",
        category: "Sector-Specific Real Estate",
        investorQualification: "Qualified Client",
        liquidity: "Limited",
        subscriptions: "Closed-end fund",
        strategy: {
          overview: "Industrial real estate focus",
          approach: "Core-plus and value-add",
          target: "Logistics facilities",
          stage: "Various",
          geography: "United States",
          sectors: ["Industrial", "Logistics"],
          expectedReturn: "8-10% IRR",
          benchmarks: ["FTSE NAREIT Industrial/Office Index"],
        }
      }
    ]
  }
};

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

interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  performance: string;
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
}

interface CategoryData {
  name: string;
  description: string;
  icon: string;
  color: string;
  offerings: Offering[];
}

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState("offerings");
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  useEffect(() => {
    if (categoryId && CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA]) {
      setCategoryData(CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA]);
    }
  }, [categoryId]);

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryData.name}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/investments">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">{categoryData.name}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offerings">Offerings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <CategoryOverview name={categoryData.name} description={categoryData.description} />
          </TabsContent>
          
          <TabsContent value="offerings" className="mt-6">
            <OfferingsList offerings={categoryData.offerings} categoryId={categoryId || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
