import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Download, CalendarClock } from "lucide-react";
import { OfferingsList } from "@/components/investments/OfferingsList";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import ScheduleMeetingDialog from "@/components/investments/ScheduleMeetingDialog";

const mockOfferings = {
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
      subscriptions: "Monthly"
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
      subscriptions: "Quarterly"
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
      subscriptions: "Monthly"
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
      subscriptions: "Quarterly"
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
      subscriptions: "Weekly"
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
      subscriptions: "Monthly"
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
      subscriptions: "Annually"
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
      subscriptions: "Quarterly"
    }
  ]
};

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
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
        case "hedge-fund":
          setCategoryName("Hedge Fund");
          setCategoryDescription("Alternative investment strategies with active management and flexible investment approaches.");
          break;
        case "venture-capital":
          setCategoryName("Venture Capital");
          setCategoryDescription("Funding for early-stage, high-potential startups and emerging companies.");
          break;
        case "collectibles":
          setCategoryName("Collectibles");
          setCategoryDescription("Art, rare items, trading cards, and memorabilia with potential investment value.");
          break;
        case "structured-investments":
          setCategoryName("Structured Investments");
          setCategoryDescription("Custom financial products with defined outcomes and specific risk-return profiles.");
          break;
        default:
          setCategoryName("Alternative Investments");
          setCategoryDescription("Various alternative investment strategies beyond traditional stocks and bonds.");
      }
    }
    
    if (categoryId && mockOfferings[categoryId as keyof typeof mockOfferings]) {
      setOfferings(mockOfferings[categoryId as keyof typeof mockOfferings]);
    } else {
      setOfferings([]);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [categoryId]);

  const handleUserAction = (actionType: string, assetName: string) => {
    const userId = "current-user";
    
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

  const handleDownloadFactSheet = () => {
    toast.success(`Downloading fact sheet for ${categoryName}`, {
      description: "Your download will begin shortly.",
    });
  };
  
  const handleCategoryInterest = () => {
    const userId = "current-user";
    
    auditLog.log(
      userId,
      "investment_category_interest",
      "success",
      {
        resourceType: "investment_category",
        resourceId: categoryId,
        details: {
          action: "expressed_interest",
          category: categoryId
        }
      }
    );
  };

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
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{categoryName}</h1>
              <p className="text-muted-foreground mt-1">{categoryDescription}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadFactSheet}
            >
              <FileText className="h-4 w-4 mr-1" />
              Download Fact Sheet
            </Button>
          </div>
          
          {!isLoading && (
            <CategoryOverview 
              name={categoryName}
              description={categoryDescription}
            />
          )}
          
          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-4">
              <InterestedButton 
                assetName={categoryName}
                onInterested={handleCategoryInterest}
                variant="default"
                size="default"
                className="flex-1"
              />
              
              <Button 
                variant="outline" 
                size="default"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={() => setScheduleMeetingOpen(true)}
              >
                <CalendarClock className="h-4 w-4" />
                Schedule a Meeting
              </Button>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Available Offerings</h2>
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
      </div>
      
      <ScheduleMeetingDialog 
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        assetName={categoryName}
      />
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
