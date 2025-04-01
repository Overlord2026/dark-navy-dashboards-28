
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { OfferingsList } from "@/components/investments/OfferingsList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Mock data - in a real application, this would come from an API
const mockOfferings = {
  "private-equity": [
    {
      id: 1,
      name: "Growth Equity Fund I",
      description: "Focus on high-growth technology companies with established revenue models.",
      minimumInvestment: "$250,000",
      performance: "+18.7% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Sequoia Capital",
      tags: ["Technology", "Growth Stage", "Late Stage"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly liquidity windows after 2-year lockup",
      subscriptions: "Quarterly",
      category: "private-equity",
      strategy: {
        overview: "The fund targets established technology companies with proven business models seeking capital for expansion.",
        approach: "Active management with board participation and operational guidance.",
        target: "Companies with $10M-$50M in revenue growing at 30%+ annually.",
        stage: "Growth Stage / Late Stage",
        geography: "North America, Europe",
        sectors: ["Enterprise Software", "FinTech", "Healthcare IT", "Consumer Internet"],
        expectedReturn: "18-25% gross IRR",
        benchmarks: ["Cambridge Associates US PE Index", "S&P 500"]
      }
    },
    {
      id: 2,
      name: "Venture Capital Fund III",
      description: "Early-stage investments in disruptive technologies across healthcare and enterprise software.",
      minimumInvestment: "$100,000",
      performance: "+22.3% IRR",
      lockupPeriod: "7-10 years",
      lockUp: "7-10 years",
      firm: "Andreessen Horowitz",
      tags: ["Venture Capital", "Early Stage", "Healthcare"],
      investorQualification: "Accredited Investor",
      liquidity: "Illiquid until exit",
      subscriptions: "Initial closing plus 18-month investment period",
      category: "private-equity",
      strategy: {
        overview: "The fund provides early capital to innovative startups with transformative technology solutions.",
        approach: "Hands-on approach with portfolio companies, providing strategic guidance and network access.",
        target: "Pre-Series A to Series B companies with strong product-market fit.",
        stage: "Early Stage",
        geography: "Primarily US with select international opportunities",
        sectors: ["Artificial Intelligence", "Biotechnology", "Enterprise SaaS", "Fintech"],
        expectedReturn: "25-30% gross IRR",
        benchmarks: ["Cambridge Associates US VC Index", "NASDAQ Composite"]
      }
    },
    {
      id: 3,
      name: "Buyout Opportunities Fund",
      description: "Focused on mature businesses in need of operational improvements and strategic repositioning.",
      minimumInvestment: "$500,000",
      performance: "+15.8% IRR",
      lockupPeriod: "5-8 years",
      lockUp: "5-8 years",
      firm: "Blackstone Group",
      tags: ["Buyout", "Mature Markets", "Value Add"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary sales permitted after 3 years",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund acquires controlling stakes in established companies with transformation potential.",
        approach: "Active ownership with operational improvements, M&A, and strategic repositioning.",
        target: "Companies with $50M-$500M in enterprise value with stable cash flows.",
        stage: "Mature / Later Stage",
        geography: "North America, Western Europe",
        sectors: ["Industrials", "Consumer Goods", "Business Services", "Healthcare Services"],
        expectedReturn: "15-20% gross IRR",
        benchmarks: ["Cambridge Associates Global Buyout Index", "Russell 3000"]
      }
    },
    {
      id: 4,
      name: "Technology Growth Fund II",
      description: "Investments in rapidly scaling technology platforms with proven revenue models.",
      minimumInvestment: "$150,000",
      performance: "+19.5% IRR",
      lockupPeriod: "6-8 years",
      lockUp: "6-8 years",
      firm: "Insight Partners",
      tags: ["Growth Equity", "Software", "Tech-Enabled Services"],
      investorQualification: "Accredited Investor",
      liquidity: "Annual liquidity windows after 3-year lockup",
      subscriptions: "Semi-annual",
      category: "private-equity",
      strategy: {
        overview: "The fund provides growth capital to software companies with established product-market fit.",
        approach: "Provides strategic guidance, operational expertise, and access to Insight's platform.",
        target: "SaaS and software businesses with $10M-$30M ARR growing 40%+ annually.",
        stage: "Growth Stage",
        geography: "Global with focus on North America and Europe",
        sectors: ["Enterprise Software", "Data & Analytics", "Security", "E-commerce"],
        expectedReturn: "20-25% gross IRR",
        benchmarks: ["Cambridge Associates Growth Equity Index", "Nasdaq-100"]
      }
    },
    {
      id: 5,
      name: "Emerging Markets PE Fund",
      description: "Diversified portfolio of high-growth businesses in developing economies.",
      minimumInvestment: "$300,000",
      performance: "+14.2% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "Advent International",
      tags: ["Emerging Markets", "Growth Capital", "Diversified"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund captures growth opportunities in rapidly developing economies with expanding middle classes.",
        approach: "Partners with local management teams and entrepreneurs with deep market knowledge.",
        target: "Market leaders in their respective niches with significant scale-up potential.",
        stage: "Growth Stage / Late Stage",
        geography: "Asia, Latin America, Africa, Eastern Europe",
        sectors: ["Consumer", "Financial Services", "Healthcare", "Technology"],
        expectedReturn: "20-25% gross IRR",
        benchmarks: ["MSCI Emerging Markets Index", "Cambridge Associates EM PE Index"]
      }
    },
    {
      id: 6,
      name: "Healthcare Innovation Fund",
      description: "Specialized investments in transformative healthcare technologies and services.",
      minimumInvestment: "$200,000",
      performance: "+21.7% IRR",
      lockupPeriod: "7-9 years",
      lockUp: "7-9 years",
      firm: "OrbiMed Advisors",
      tags: ["Healthcare", "Life Sciences", "Biotech"],
      investorQualification: "Accredited Investor",
      liquidity: "Limited secondary transfers with GP approval",
      subscriptions: "Initial closing with follow-on closings",
      category: "private-equity",
      strategy: {
        overview: "The fund invests in innovative healthcare companies developing novel therapeutics and care delivery models.",
        approach: "Scientific and clinical expertise guides investment decisions and portfolio support.",
        target: "Companies with disruptive solutions addressing large medical needs.",
        stage: "Early to Growth Stage",
        geography: "Global with focus on North America and Europe",
        sectors: ["Biotechnology", "Medical Devices", "Digital Health", "Diagnostics"],
        expectedReturn: "20-30% gross IRR",
        benchmarks: ["NASDAQ Biotechnology Index", "S&P Healthcare Select"]
      }
    }
  ],
  "private-debt": [
    {
      id: 7,
      name: "Direct Lending Fund IV",
      description: "Senior secured loans to middle-market companies with stable cash flows.",
      minimumInvestment: "$100,000",
      performance: "+9.5% IRR",
      lockupPeriod: "4-6 years",
      lockUp: "4-6 years",
      firm: "Ares Management",
      tags: ["Direct Lending", "Senior Secured", "Income"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly liquidity after 1-year lockup with 5% early redemption fee",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides senior secured loans to established mid-market businesses.",
        approach: "Rigorous credit analysis with focus on capital preservation and consistent income.",
        target: "Companies with $10M-$50M EBITDA in stable industries.",
        stage: "Established companies",
        geography: "United States, Western Europe",
        sectors: ["Business Services", "Healthcare", "Manufacturing", "Software"],
        expectedReturn: "8-12% net IRR with 7-9% current income component",
        benchmarks: ["Credit Suisse Leveraged Loan Index", "S&P/LSTA Leveraged Loan 100 Index"]
      }
    },
    {
      id: 8,
      name: "Mezzanine Debt Fund II",
      description: "Subordinated debt with equity kickers targeting middle-market growth companies.",
      minimumInvestment: "$250,000",
      performance: "+12.7% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Golub Capital",
      tags: ["Mezzanine", "Subordinated Debt", "Equity Upside"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Semi-annual liquidity windows after 2-year lockup",
      subscriptions: "Quarterly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides subordinated debt with equity participation to growing mid-market companies.",
        approach: "Combines current income with potential capital appreciation through equity participation rights.",
        target: "Companies with $20M-$100M EBITDA seeking growth or acquisition capital.",
        stage: "Growth stage companies",
        geography: "North America",
        sectors: ["Technology", "Consumer", "Healthcare", "Business Services"],
        expectedReturn: "12-15% net IRR with 8-10% current income component",
        benchmarks: ["Credit Suisse High Yield Index", "Alerian MLP Index"]
      }
    },
    {
      id: 9,
      name: "Distressed Debt Opportunities",
      description: "Investments in stressed and distressed corporate debt with potential for restructuring gains.",
      minimumInvestment: "$500,000",
      performance: "+16.2% IRR",
      lockupPeriod: "5-8 years",
      lockUp: "5-8 years",
      firm: "Oaktree Capital",
      tags: ["Distressed", "Special Situations", "Restructuring"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-debt",
      strategy: {
        overview: "The fund acquires debt of companies experiencing financial distress at significant discounts.",
        approach: "Deep value investing with active involvement in restructuring and turnaround processes.",
        target: "Companies undergoing financial stress with viable business models and valuable assets.",
        stage: "Stressed/Distressed companies",
        geography: "Global with focus on North America and Europe",
        sectors: ["Energy", "Retail", "Media", "Transportation", "Real Estate"],
        expectedReturn: "15-20% net IRR",
        benchmarks: ["HFRI ED: Distressed/Restructuring Index", "BofA Merrill Lynch US High Yield Index"]
      }
    },
    {
      id: 10,
      name: "Specialty Finance Fund",
      description: "Focused on non-traditional lending opportunities across consumer and commercial markets.",
      minimumInvestment: "$150,000",
      performance: "+10.8% IRR",
      lockupPeriod: "3-5 years",
      lockUp: "3-5 years",
      firm: "Fortress Investment Group",
      tags: ["Specialty Finance", "Asset-Backed", "Niche Lending"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly liquidity with 60 days notice after 1-year lockup",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides financing solutions in specialty niches overlooked by traditional lenders.",
        approach: "Focuses on asset-backed lending opportunities with strong collateral protection.",
        target: "Specialty finance companies, asset pools, and structured lending opportunities.",
        stage: "Various",
        geography: "Primarily United States",
        sectors: ["Consumer Finance", "Equipment Leasing", "Litigation Finance", "Royalties", "Transportation Assets"],
        expectedReturn: "10-14% net IRR with 8-10% current yield component",
        benchmarks: ["S&P/LSTA Leveraged Loan Index", "Bloomberg Barclays US Corporate High Yield Index"]
      }
    }
  ],
  "digital-assets": [
    {
      id: 11,
      name: "Blockchain Opportunities Fund",
      description: "Diversified portfolio of blockchain protocols, digital assets, and related infrastructure.",
      minimumInvestment: "$50,000",
      performance: "+42.3% IRR",
      lockupPeriod: "2-3 years",
      lockUp: "2-3 years",
      firm: "Pantera Capital",
      tags: ["Digital Assets", "Blockchain", "Tokens"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly liquidity after 1-year lockup",
      subscriptions: "Monthly",
      category: "digital-assets",
      strategy: {
        overview: "The fund invests across the digital asset ecosystem to capture technological transformation.",
        approach: "Fundamental research-driven approach focusing on protocols with strong network effects.",
        target: "Layer 1 protocols, DeFi tokens, Web3 applications, and infrastructure providers.",
        stage: "Various stages from early to established protocols",
        geography: "Global",
        sectors: ["Smart Contract Platforms", "Decentralized Finance", "Web3", "Infrastructure"],
        expectedReturn: "30-50% net IRR with significant volatility",
        benchmarks: ["Bitwise 10 Large Cap Crypto Index", "Bloomberg Galaxy Crypto Index"]
      }
    },
    {
      id: 12,
      name: "Bitcoin Trust",
      description: "A regulated investment vehicle providing secure exposure to Bitcoin.",
      minimumInvestment: "$25,000",
      performance: "+65.4% IRR",
      lockupPeriod: "No lockup",
      lockUp: "No lockup",
      firm: "Grayscale Investments",
      tags: ["Bitcoin", "Single Asset", "Passive"],
      investorQualification: "Accredited Investor",
      liquidity: "Daily NAV with monthly redemptions",
      subscriptions: "Daily",
      category: "digital-assets",
      strategy: {
        overview: "The trust provides secure, regulated exposure to Bitcoin without dealing with custody challenges.",
        approach: "Passive single-asset holding with institutional-grade security and custody.",
        target: "Bitcoin",
        stage: "Established digital asset",
        geography: "Global",
        sectors: ["Cryptocurrency"],
        expectedReturn: "Tracks Bitcoin performance minus a 2% annual fee",
        benchmarks: ["Bitcoin (BTC/USD)"]
      }
    },
    {
      id: 13,
      name: "DeFi Yield Fund",
      description: "Actively managed portfolio generating yield through decentralized finance protocols.",
      minimumInvestment: "$100,000",
      performance: "+28.7% IRR",
      lockupPeriod: "1-2 years",
      lockUp: "1-2 years",
      firm: "ParaFi Capital",
      tags: ["DeFi", "Yield", "Active Management"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly with 60 days notice after 1-year lockup",
      subscriptions: "Monthly",
      category: "digital-assets",
      strategy: {
        overview: "The fund capitalizes on yield opportunities across decentralized finance protocols.",
        approach: "Active management with continuous risk assessment and yield optimization.",
        target: "Lending protocols, liquidity provision, staking, and yield farming strategies.",
        stage: "Established DeFi protocols with proven security",
        geography: "Global",
        sectors: ["Decentralized Lending", "AMMs", "Derivatives", "Insurance"],
        expectedReturn: "20-30% net IRR",
        benchmarks: ["DeFi Pulse Index", "S&P 500 Index"]
      }
    },
    {
      id: 14,
      name: "Crypto Venture Fund I",
      description: "Early-stage investments in blockchain protocols and digital asset infrastructure.",
      minimumInvestment: "$250,000",
      performance: "+37.5% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Dragonfly Capital",
      tags: ["Venture", "Early Stage", "Infrastructure"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Illiquid until exit",
      subscriptions: "Closed-end fund",
      category: "digital-assets",
      strategy: {
        overview: "The fund invests in early-stage blockchain protocols and companies building critical infrastructure.",
        approach: "Deep technical diligence with hands-on support for protocol development and go-to-market.",
        target: "Pre-launch protocols, early-stage blockchain startups, and infrastructure providers.",
        stage: "Seed to Series B",
        geography: "Global with focus on Asia and North America",
        sectors: ["Layer 1/2 Protocols", "DeFi Infrastructure", "NFT/Gaming", "Web3 Applications"],
        expectedReturn: "35-50% net IRR",
        benchmarks: ["Cambridge Associates Venture Capital Index", "Bitwise 10 Crypto Index"]
      }
    }
  ],
  "real-assets": [
    {
      id: 15,
      name: "Core-Plus Real Estate Fund",
      description: "Diversified portfolio of income-producing commercial properties with value-add components.",
      minimumInvestment: "$100,000",
      performance: "+9.8% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Blackstone Real Estate",
      tags: ["Real Estate", "Core-Plus", "Income"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly redemptions after 1-year lockup, subject to fund limits",
      subscriptions: "Monthly",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in high-quality, substantially leased assets with opportunities for enhancement.",
        approach: "Combines stable income from core properties with value creation through operational improvements.",
        target: "Office, multifamily, industrial, and select retail properties in primary markets.",
        stage: "Stabilized assets with enhancement potential",
        geography: "United States, Western Europe, select Asian markets",
        sectors: ["Office", "Multifamily", "Industrial", "Retail"],
        expectedReturn: "8-12% net IRR with 4-6% current income component",
        benchmarks: ["NCREIF Property Index", "FTSE NAREIT All Equity REITs Index"]
      }
    },
    {
      id: 16,
      name: "Infrastructure Income Fund",
      description: "Essential infrastructure investments generating stable, inflation-protected cash flows.",
      minimumInvestment: "$75,000",
      performance: "+8.5% IRR",
      lockupPeriod: "4-6 years",
      lockUp: "4-6 years",
      firm: "Brookfield Asset Management",
      tags: ["Infrastructure", "Income", "Inflation Protection"],
      investorQualification: "Accredited Investor",
      liquidity: "Semi-annual with 90 days notice after 1-year lockup",
      subscriptions: "Quarterly",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in essential infrastructure assets with predictable, long-term cash flows.",
        approach: "Focus on contracted or regulated assets with inflation-linked revenue streams.",
        target: "Energy transmission, transportation, utilities, and digital infrastructure.",
        stage: "Operational assets with established revenue history",
        geography: "OECD countries",
        sectors: ["Utilities", "Transportation", "Energy", "Communications"],
        expectedReturn: "8-10% net IRR with 5-7% current yield",
        benchmarks: ["S&P Global Infrastructure Index", "FTSE Developed Core Infrastructure Index"]
      }
    },
    {
      id: 17,
      name: "Farmland Opportunities Fund",
      description: "Income-producing agricultural properties with water rights and organic conversion potential.",
      minimumInvestment: "$150,000",
      performance: "+10.7% IRR",
      lockupPeriod: "7-10 years",
      lockUp: "7-10 years",
      firm: "Hancock Natural Resource Group",
      tags: ["Agriculture", "Farmland", "Sustainable"],
      investorQualification: "Accredited Investor",
      liquidity: "Annual liquidity windows after 3-year lockup",
      subscriptions: "Semi-annual",
      category: "real-assets",
      strategy: {
        overview: "The fund acquires productive farmland with opportunities for sustainable conversion and water value.",
        approach: "Partners with experienced operators focusing on high-value permanent crops and organic transitions.",
        target: "Row crop and permanent crop farmland with water rights in prime growing regions.",
        stage: "Productive farmland with improvement potential",
        geography: "United States, Australia, South America",
        sectors: ["Permanent Crops", "Row Crops", "Water Rights"],
        expectedReturn: "9-12% net IRR with 3-5% current income component",
        benchmarks: ["NCREIF Farmland Index", "S&P GSCI Agriculture Index"]
      }
    },
    {
      id: 18,
      name: "Global Natural Resources Fund",
      description: "Diversified portfolio of energy, mining, and timber assets with sustainable focus.",
      minimumInvestment: "$200,000",
      performance: "+11.2% IRR",
      lockupPeriod: "6-8 years",
      lockUp: "6-8 years",
      firm: "KKR",
      tags: ["Natural Resources", "Energy", "Minerals"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in natural resource assets positioned for the energy transition and sustainability.",
        approach: "Active management with operational improvements and sustainability enhancements.",
        target: "Energy infrastructure, mining assets, transition metals, and timber properties.",
        stage: "Operating assets with value-add potential",
        geography: "Global with focus on North America and Australia",
        sectors: ["Energy", "Mining", "Forestry", "Transition Metals"],
        expectedReturn: "12-15% net IRR",
        benchmarks: ["S&P Global Natural Resources Index", "Bloomberg Commodity Index"]
      }
    },
    {
      id: 19,
      name: "Opportunistic Real Estate Fund",
      description: "Value-add and opportunistic real estate investments across property types.",
      minimumInvestment: "$250,000",
      performance: "+14.5% IRR",
      lockupPeriod: "7-9 years",
      lockUp: "7-9 years",
      firm: "Starwood Capital Group",
      tags: ["Real Estate", "Opportunistic", "Value-Add"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Closed-end fund with limited secondary transfers",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund targets properties requiring significant repositioning, redevelopment, or recapitalization.",
        approach: "Active asset management with substantial capital improvements and business plan execution.",
        target: "Distressed or underperforming properties with significant upside potential.",
        stage: "Value-add and opportunistic",
        geography: "United States and Europe",
        sectors: ["Hospitality", "Multifamily", "Office", "Retail", "Specialty"],
        expectedReturn: "14-18% net IRR",
        benchmarks: ["NCREIF Property Index + 300bps", "FTSE NAREIT All Equity REITs Index"]
      }
    },
    {
      id: 20,
      name: "Energy Transition Fund",
      description: "Investments in renewable energy infrastructure and storage solutions.",
      minimumInvestment: "$100,000",
      performance: "+12.8% IRR",
      lockupPeriod: "6-8 years",
      lockUp: "6-8 years",
      firm: "Global Infrastructure Partners",
      tags: ["Renewable Energy", "Sustainability", "Infrastructure"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly liquidity after 2-year lockup subject to gates",
      subscriptions: "Quarterly",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in renewable energy generation, storage, and distribution infrastructure.",
        approach: "Primarily greenfield and brownfield projects with long-term contracts or regulated returns.",
        target: "Solar, wind, battery storage, and related infrastructure assets.",
        stage: "Development to operational",
        geography: "North America, Europe, select Asia-Pacific markets",
        sectors: ["Wind", "Solar", "Storage", "Transmission"],
        expectedReturn: "10-14% net IRR with 4-6% current yield once assets operational",
        benchmarks: ["S&P Global Clean Energy Index", "FTSE Global Core Infrastructure Index"]
      }
    }
  ]
};

const ViewAllOfferings = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    
    // Get offerings for the category
    if (categoryId && mockOfferings[categoryId as keyof typeof mockOfferings]) {
      setOfferings(mockOfferings[categoryId as keyof typeof mockOfferings]);
      
      // Set category name
      switch(categoryId) {
        case "private-equity":
          setCategoryName("Private Equity");
          break;
        case "private-debt":
          setCategoryName("Private Debt");
          break;
        case "digital-assets":
          setCategoryName("Digital Assets");
          break;
        case "real-assets":
          setCategoryName("Real Assets");
          break;
        default:
          setCategoryName("Alternative Investments");
      }
    }
    
    setIsLoading(false);
  }, [categoryId]);

  return (
    <ThreeColumnLayout activeMainItem="investments" title={`${categoryName} - All Offerings`}>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(`/investments/alternative/${categoryId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {categoryName}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading offerings...</p>
          </div>
        ) : (
          <OfferingsList 
            offerings={offerings} 
            categoryId={categoryId || ""} 
            isFullView={true}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default ViewAllOfferings;
