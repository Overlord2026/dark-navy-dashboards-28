
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { OfferingsList } from "@/components/investments/OfferingsList";
import { getAllInvestmentCategoryData } from "@/services/marketDataService";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

// Mock data - expanded to include more offerings per category that were previously filtered by the sidebar
const mockOfferings = {
  "private-equity": [
    {
      id: 1,
      name: "Blackstone Private Equity (BXPE)",
      description: "Flagship private equity fund focusing on control-oriented investments in high-quality businesses.",
      minimumInvestment: "$5,000,000",
      performance: "+22.3% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Blackstone",
      tags: ["LBO", "Growth Equity", "Late Stage"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market opportunities",
      subscriptions: "Quarterly closings",
      category: "private-equity",
      strategy: {
        overview: "BXPE targets established, market-leading businesses with strong cash flows and significant opportunities for operational improvement.",
        approach: "Control-oriented investments with active management and operational expertise.",
        target: "Companies with enterprise values between $500M and $5B+.",
        stage: "Established businesses",
        geography: "Global with focus on North America and Europe",
        sectors: ["Consumer", "Healthcare", "Technology", "Financial Services", "Industrials"],
        expectedReturn: "20-25% gross IRR",
        benchmarks: ["Cambridge Associates Global PE Index", "S&P 500"]
      }
    },
    {
      id: 2,
      name: "KKR North America Fund XIII",
      description: "Large-cap buyout fund targeting established market leaders across multiple sectors.",
      minimumInvestment: "$3,000,000",
      performance: "+19.8% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "KKR",
      tags: ["Buyout", "Large Cap", "Value Creation"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary transfers with GP approval",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund targets large, established businesses with potential for operational enhancement and strategic repositioning.",
        approach: "Control investments with significant operational improvements and strategic initiatives.",
        target: "Companies with enterprise values of $500M to $5B+.",
        stage: "Mature / Later Stage",
        geography: "North America",
        sectors: ["Technology", "Healthcare", "Industrials", "Consumer", "Financial Services"],
        expectedReturn: "18-22% gross IRR",
        benchmarks: ["Cambridge Associates US Buyout Index", "Russell 3000"]
      }
    },
    {
      id: 3,
      name: "Apollo Global Private Equity",
      description: "Diverse private equity strategy focused on distressed investments and corporate carve-outs.",
      minimumInvestment: "$3,500,000",
      performance: "+21.4% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Apollo",
      tags: ["Distressed", "Value", "Corporate Carve-outs"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary opportunities",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund focuses on complex situations, distressed assets, and corporate carve-outs with value enhancement potential.",
        approach: "Value-oriented investments with operational transformation.",
        target: "Companies across multiple industries requiring financial or operational restructuring.",
        stage: "Various stages with turnaround potential",
        geography: "Global with focus on North America and Europe",
        sectors: ["Industrial", "Consumer", "Business Services", "Natural Resources"],
        expectedReturn: "20-24% gross IRR",
        benchmarks: ["Cambridge Associates Global PE Index", "S&P 500"]
      }
    },
    {
      id: 4,
      name: "StepStone Capital Partners V",
      description: "Diversified private equity fund-of-funds with primary, secondary, and co-investment strategies.",
      minimumInvestment: "$1,000,000",
      performance: "+16.7% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "StepStone",
      tags: ["Fund-of-Funds", "Diversified", "Multi-strategy"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market opportunities",
      subscriptions: "Semi-annual closings",
      category: "private-equity",
      strategy: {
        overview: "The fund provides diversified exposure to private equity through a multi-manager approach.",
        approach: "Combination of primary fund commitments, secondary purchases, and direct co-investments.",
        target: "Diversified exposure across fund managers, sectors, and vintages.",
        stage: "Multiple stages across the private equity spectrum",
        geography: "Global with core focus on North America and Europe",
        sectors: ["Diversified across sectors"],
        expectedReturn: "15-18% net IRR",
        benchmarks: ["Cambridge Associates Global PE Index", "MSCI World"]
      }
    },
    {
      id: 5,
      name: "AMG Pantheon Private Equity Fund",
      description: "Semi-liquid private equity solution with quarterly limited liquidity after initial lockup.",
      minimumInvestment: "$50,000",
      performance: "+14.8% IRR",
      lockupPeriod: "2-year initial lockup",
      lockUp: "2-year initial lockup",
      firm: "AMG Pantheon",
      tags: ["Semi-Liquid", "Fund-of-Funds", "Evergreen"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly tender offers after 2-year lockup",
      subscriptions: "Monthly",
      category: "private-equity",
      strategy: {
        overview: "The fund offers diversified private equity exposure in a more accessible format with limited liquidity features.",
        approach: "Diversified portfolio of primary and secondary fund investments plus co-investments.",
        target: "Broad private equity exposure across stages, sectors, and geographies.",
        stage: "Diversified across stages",
        geography: "Global with focus on US and Europe",
        sectors: ["Diversified across sectors"],
        expectedReturn: "12-15% net IRR",
        benchmarks: ["Cambridge Associates Global PE FOF Index", "MSCI ACWI"]
      }
    },
    {
      id: 6,
      name: "Hamilton Lane Private Equity Access Fund",
      description: "Evergreen private equity vehicle with quarterly subscription and limited liquidity.",
      minimumInvestment: "$50,000",
      performance: "+15.2% IRR",
      lockupPeriod: "1-year initial lockup",
      lockUp: "1-year initial lockup",
      firm: "Hamilton Lane",
      tags: ["Semi-Liquid", "Diversified", "Evergreen"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly tender offers after 1-year lockup",
      subscriptions: "Quarterly",
      category: "private-equity",
      strategy: {
        overview: "The fund provides access to institutional-quality private equity investments with quarterly limited liquidity.",
        approach: "Multi-strategy approach across direct investments, secondaries, and select primary commitments.",
        target: "Diversified private equity exposure with focus on middle market opportunities.",
        stage: "Various stages with emphasis on middle market",
        geography: "Global with North American focus",
        sectors: ["Diversified across sectors"],
        expectedReturn: "13-16% net IRR",
        benchmarks: ["Cambridge Associates Global PE FOF Index", "S&P 500"]
      }
    },
    {
      id: 7,
      name: "Carlyle Global Partners",
      description: "Long-duration private equity strategy with 20+ year investment horizon.",
      minimumInvestment: "$10,000,000",
      performance: "+17.1% IRR",
      lockupPeriod: "20+ years",
      lockUp: "20+ years",
      firm: "Carlyle Group",
      tags: ["Long-Duration", "Permanent Capital", "Global"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Extremely limited secondary opportunities",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund focuses on investments with multi-decade compounding potential and limited competition.",
        approach: "Patient capital with very long investment horizons and minimal pressure to exit.",
        target: "High-quality businesses with sustainable competitive advantages and long-term growth potential.",
        stage: "Established businesses across various industries",
        geography: "Global",
        sectors: ["Technology", "Healthcare", "Consumer", "Industrials"],
        expectedReturn: "15-18% gross IRR",
        benchmarks: ["Cambridge Associates Global PE Index", "MSCI World"]
      }
    },
    {
      id: 8,
      name: "TPG Growth Fund V",
      description: "Growth equity strategy targeting middle-market and growth-stage companies.",
      minimumInvestment: "$5,000,000",
      performance: "+24.3% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "TPG",
      tags: ["Growth Equity", "Middle Market", "Technology"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund targets growth-stage companies with proven business models and significant expansion opportunities.",
        approach: "Growth equity investments with active operational involvement and strategic guidance.",
        target: "Companies with $25M-$100M revenue growing at 20%+ annually.",
        stage: "Growth / Expansion",
        geography: "Global with focus on North America and Asia",
        sectors: ["Technology", "Healthcare", "Consumer", "Business Services"],
        expectedReturn: "20-25% gross IRR",
        benchmarks: ["Cambridge Associates Growth Equity Index", "Russell 2500 Growth"]
      }
    },
    {
      id: 9,
      name: "Bain Capital Fund XIII",
      description: "Large-cap buyout fund focusing on operational transformation and value creation.",
      minimumInvestment: "$5,000,000",
      performance: "+20.6% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Bain Capital",
      tags: ["Buyout", "Operational Improvement", "Large Cap"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market opportunities",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund focuses on businesses with transformation potential through operational improvements and strategic initiatives.",
        approach: "Deep operational involvement with proprietary value creation playbooks and specialized industry expertise.",
        target: "Companies with enterprise values between $300M and $5B+.",
        stage: "Established businesses",
        geography: "Global with focus on North America and Europe",
        sectors: ["Technology", "Healthcare", "Consumer", "Business Services", "Industrials"],
        expectedReturn: "18-22% gross IRR",
        benchmarks: ["Cambridge Associates Global Buyout Index", "S&P 500"]
      }
    }
  ],
  "private-debt": [
    {
      id: 7,
      name: "Ares Direct Lending Fund V",
      description: "Senior secured loans to middle-market companies with stable cash flows.",
      minimumInvestment: "$250,000",
      performance: "+9.5% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Ares Management",
      tags: ["Direct Lending", "Senior Secured", "Income"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly liquidity after 1-year lockup with redemption fees",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides senior secured loans to established mid-market businesses.",
        approach: "Rigorous credit analysis with focus on capital preservation and consistent income.",
        target: "Companies with $20M-$75M EBITDA in stable industries.",
        stage: "Established companies",
        geography: "United States, Western Europe",
        sectors: ["Business Services", "Healthcare", "Manufacturing", "Software"],
        expectedReturn: "8-12% net IRR with 7-9% current income component",
        benchmarks: ["Credit Suisse Leveraged Loan Index", "S&P/LSTA Leveraged Loan 100 Index"]
      }
    },
    {
      id: 8,
      name: "Blackstone Credit Strategic Direct Lending Fund",
      description: "Diversified private debt portfolio focused on middle-market direct lending.",
      minimumInvestment: "$1,000,000",
      performance: "+10.3% IRR",
      lockupPeriod: "6-8 years",
      lockUp: "6-8 years",
      firm: "Blackstone Credit",
      tags: ["Direct Lending", "Private Credit", "Income"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited quarterly liquidity after 2-year lockup",
      subscriptions: "Quarterly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides senior secured and unitranche loans to middle-market companies.",
        approach: "Rigorous credit underwriting leveraging Blackstone's vast information network.",
        target: "Companies with $25M-$100M EBITDA seeking growth or acquisition capital.",
        stage: "Established companies",
        geography: "North America, Europe",
        sectors: ["Technology", "Healthcare", "Business Services", "Consumer"],
        expectedReturn: "9-11% net IRR with significant current income component",
        benchmarks: ["Credit Suisse Leveraged Loan Index", "Bloomberg U.S. Aggregate Bond Index"]
      }
    },
    {
      id: 9,
      name: "Apollo Hybrid Value Fund",
      description: "Flexible capital solutions across the capital structure with both debt and equity components.",
      minimumInvestment: "$5,000,000",
      performance: "+13.7% IRR",
      lockupPeriod: "7-9 years",
      lockUp: "7-9 years",
      firm: "Apollo",
      tags: ["Hybrid", "Flexible Capital", "Value"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-debt",
      strategy: {
        overview: "The fund provides flexible capital solutions in complex situations with both debt and equity characteristics.",
        approach: "Opportunistic strategy targeting situational dislocations and complex capital structures.",
        target: "Companies with complex capital needs or in transitional situations.",
        stage: "Various stages",
        geography: "Global with focus on North America and Europe",
        sectors: ["Diversified across sectors"],
        expectedReturn: "12-15% net IRR",
        benchmarks: ["HFRI ED: Distressed/Restructuring Index", "Bloomberg High Yield Index"]
      }
    },
    {
      id: 10,
      name: "Cliffwater Corporate Lending Fund",
      description: "Semi-liquid direct lending vehicle focused on middle-market loans.",
      minimumInvestment: "$25,000",
      performance: "+8.8% IRR",
      lockupPeriod: "Open-ended with quarterly liquidity",
      lockUp: "Open-ended with quarterly liquidity",
      firm: "Cliffwater",
      tags: ["Direct Lending", "Semi-Liquid", "Income"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly (subject to gates)",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides direct lending exposure to middle-market companies in a semi-liquid structure.",
        approach: "Diversified portfolio of senior secured loans to non-cyclical businesses.",
        target: "Companies with $10M-$50M EBITDA in defensive industries.",
        stage: "Mature businesses",
        geography: "United States",
        sectors: ["Healthcare", "Business Services", "Software", "Defensive Manufacturing"],
        expectedReturn: "7-9% net yield",
        benchmarks: ["S&P/LSTA Leveraged Loan Index", "Bloomberg U.S. Aggregate Bond Index"]
      }
    },
    {
      id: 11,
      name: "StepStone Private Debt Partners",
      description: "Diversified private debt fund-of-funds with primary, secondary, and co-investment strategies.",
      minimumInvestment: "$500,000",
      performance: "+9.2% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "StepStone",
      tags: ["Fund-of-Funds", "Diversified", "Multi-strategy"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-debt",
      strategy: {
        overview: "The fund provides diversified exposure to private debt through a multi-manager approach.",
        approach: "Combination of primary fund commitments, secondary purchases, and direct co-investments.",
        target: "Diversified exposure across debt strategies, sectors, and vintages.",
        stage: "Multiple approaches across the private debt spectrum",
        geography: "Global with core focus on North America and Europe",
        sectors: ["Diversified across sectors"],
        expectedReturn: "8-10% net IRR",
        benchmarks: ["Credit Suisse Leveraged Loan Index", "ICE BofA US High Yield Index"]
      }
    },
    {
      id: 12,
      name: "KKR Credit Opportunities Fund",
      description: "Flexible strategy investing across liquid and illiquid credit opportunities.",
      minimumInvestment: "$500,000",
      performance: "+11.3% IRR",
      lockupPeriod: "Semi-annual liquidity",
      lockUp: "Semi-annual liquidity",
      firm: "KKR",
      tags: ["Opportunistic Credit", "Flexible", "Multi-strategy"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Semi-annual (subject to gates)",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund targets opportunities across the credit spectrum, from traded credit to direct lending.",
        approach: "Opportunistic approach leveraging KKR's global platform to identify dislocations.",
        target: "Diversified credit exposure across markets, industries, and credit quality.",
        stage: "Various credit strategies",
        geography: "Global",
        sectors: ["Diversified across sectors"],
        expectedReturn: "9-12% net IRR",
        benchmarks: ["ICE BofA US High Yield Index", "Credit Suisse Leveraged Loan Index"]
      }
    }
  ],
  "digital-assets": [
    {
      id: 11,
      name: "Pantera Blockchain Fund",
      description: "Diversified portfolio of blockchain protocols, digital assets, and related infrastructure.",
      minimumInvestment: "$100,000",
      performance: "+42.3% IRR",
      lockupPeriod: "3-5 years",
      lockUp: "3-5 years",
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
      name: "Grayscale Bitcoin Trust",
      description: "A regulated investment vehicle providing secure exposure to Bitcoin.",
      minimumInvestment: "$50,000",
      performance: "+65.4% IRR",
      lockupPeriod: "6-month lockup for private placements",
      lockUp: "6-month lockup for private placements",
      firm: "Grayscale Investments",
      tags: ["Bitcoin", "Single Asset", "Passive"],
      investorQualification: "Accredited Investor",
      liquidity: "Secondary market trading available through brokerage accounts (GBTC)",
      subscriptions: "Daily for accredited investors (private placement)",
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
    }
  ],
  "real-assets": [
    {
      id: 15,
      name: "Blackstone Real Estate Partners X",
      description: "Opportunistic real estate investments across property types and geographies.",
      minimumInvestment: "$5,000,000",
      performance: "+16.8% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "Blackstone Real Estate",
      tags: ["Real Estate", "Opportunistic", "Global"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund acquires high-quality real estate assets with opportunistic return potential.",
        approach: "Value creation through operational improvements, repositioning, and strategic asset management.",
        target: "Office, multifamily, industrial, hospitality, and retail properties globally.",
        stage: "Varying stages with value-add or opportunistic potential",
        geography: "Global with focus on North America, Europe, and Asia",
        sectors: ["Office", "Multifamily", "Industrial", "Hospitality", "Retail"],
        expectedReturn: "15-20% net IRR",
        benchmarks: ["NCREIF Property Index", "FTSE NAREIT All Equity REITs Index"]
      }
    },
    {
      id: 16,
      name: "Brookfield Infrastructure Fund V",
      description: "Global infrastructure investments generating stable, inflation-protected cash flows.",
      minimumInvestment: "$1,000,000",
      performance: "+12.5% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Brookfield Asset Management",
      tags: ["Infrastructure", "Income", "Inflation Protection"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in high-quality infrastructure assets with essential service characteristics.",
        approach: "Operational improvements, strategic repositioning, and platform expansions.",
        target: "Transportation, utilities, energy, and data infrastructure assets.",
        stage: "Established assets with expansion potential",
        geography: "Global with focus on OECD countries",
        sectors: ["Transportation", "Utilities", "Energy", "Data Infrastructure"],
        expectedReturn: "10-15% net IRR with 4-6% current yield component",
        benchmarks: ["S&P Global Infrastructure Index", "FTSE Developed Core Infrastructure Index"]
      }
    }
  ]
};

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState<any>(null);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [ytdPerformance, setYtdPerformance] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Set category name and description based on category ID
    if (categoryId) {
      switch(categoryId) {
        case "private-equity":
          setCategoryName("Private Equity");
          setCategoryDescription("Direct investments in private companies, leveraged buyouts, and growth capital strategies.");
          break;
        case "private-debt":
          setCategoryName("Private Debt");
          setCategoryDescription("Direct lending, mezzanine financing, and distressed debt investments across sectors.");
          break;
        case "digital-assets":
          setCategoryName("Digital Assets");
          setCategoryDescription("Cryptocurrencies, blockchain technologies, and Web3 infrastructure investments.");
          break;
        case "real-assets":
          setCategoryName("Real Assets");
          setCategoryDescription("Real estate, infrastructure, natural resources, and tangible assets with intrinsic value.");
          break;
        default:
          setCategoryName("Alternative Investments");
          setCategoryDescription("Various alternative investment strategies beyond traditional stocks and bonds.");
      }
    }
    
    // Get offerings for the category
    if (categoryId && mockOfferings[categoryId as keyof typeof mockOfferings]) {
      setOfferings(mockOfferings[categoryId as keyof typeof mockOfferings]);
    } else {
      // Handle case where category doesn't exist
      setOfferings([]);
    }
    
    // Fetch real-time market data
    const fetchMarketData = async () => {
      try {
        const data = await getAllInvestmentCategoryData();
        if (categoryId && data[categoryId as keyof typeof data]) {
          setCategoryData(data[categoryId as keyof typeof data]);
          setYtdPerformance(data[categoryId as keyof typeof data].ytdPerformance);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Set fallback performance data
        switch(categoryId) {
          case "private-equity":
            setYtdPerformance(12.4);
            break;
          case "private-debt":
            setYtdPerformance(8.7);
            break;
          case "digital-assets":
            setYtdPerformance(15.8);
            break;
          case "real-assets":
            setYtdPerformance(9.1);
            break;
          default:
            setYtdPerformance(10.5);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, [categoryId]);

  const handleUserAction = (actionType: string, assetName: string) => {
    const userId = "current-user"; // In a real app, get from auth context
    
    if (actionType === "like") {
      auditLog.log(
        userId,
        "document_access",
        "success",
        {
          resourceType: "investment_offering",
          resourceId: assetName,
          details: {
            action: "expressed_interest",
            category: categoryId
          }
        }
      );
      
      toast.success(`You've expressed interest in ${assetName}`, {
        description: "Your advisor will be notified about your interest.",
      });
    }
  };

  // If no category found, redirect to investments page
  useEffect(() => {
    if (!isLoading && categoryId && !mockOfferings[categoryId as keyof typeof mockOfferings]) {
      navigate("/investments");
      toast.error("Investment category not found");
    }
  }, [categoryId, isLoading, navigate]);

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryName}>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate("/investments?tab=private-market")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Investments
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground mt-1">{categoryDescription}</p>
          </div>
          
          {/* Market performance card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-1">Recent Performance</h3>
                  <p className="text-sm text-muted-foreground">Year-to-date category performance</p>
                </div>
                <div className="text-2xl font-bold text-emerald-500">
                  {isLoading ? "Loading..." : `+${ytdPerformance?.toFixed(1)}%`}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Available Offerings */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading offerings...</p>
            </div>
          ) : (
            <OfferingsList 
              offerings={offerings} 
              categoryId={categoryId || ""} 
              onLike={(assetName) => handleUserAction("like", assetName)}
              isFullView={true}
            />
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
