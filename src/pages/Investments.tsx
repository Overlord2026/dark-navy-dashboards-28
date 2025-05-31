import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Briefcase, BarChart3, ArrowUpRight, ShieldCheck, CalendarClock, SearchIcon } from "lucide-react";
import { IntelligentAllocationTab } from "@/components/investments/IntelligentAllocationTab";
import { StockScreener } from "@/components/investments/StockScreener";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { PortfolioPickerDialog } from "@/components/investments/PortfolioPickerDialog";
import { BFOModelsTable } from "@/components/investments/BFOModelsTable";
import { useBFOModels } from "@/hooks/useBFOModels";
import { getAllInvestmentCategoryData } from "@/services/marketDataService";

interface PortfolioModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  returnRate: string;
  riskLevel: string;
  badge: {
    text: string;
    color: string;
  };
}

interface ModelPortfolio {
  name: string;
  type: string;
  taxStatus: string;
  assignedAccounts: number;
  tradingGroups: number;
}

const Investments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("intelligent-alloc");
  const [alternativeData, setAlternativeData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const [portfolioPickerOpen, setPortfolioPickerOpen] = useState(false);
  
  // BFO Models hook
  const { userAssignments, loading: bfoLoading, error: bfoError } = useBFOModels();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["intelligent-alloc", "private-markets"].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [location.search]);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInvestmentCategoryData();
        setAlternativeData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setAlternativeData({
          'private-equity': { ytdPerformance: 12.4 },
          'private-debt': { ytdPerformance: 8.7 },
          'digital-assets': { ytdPerformance: 15.8 },
          'real-assets': { ytdPerformance: 9.1 }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);

  const portfolioModels: PortfolioModel[] = [
    {
      id: "income-focus",
      name: "Income Focus",
      provider: "Dimensional Fund Advisors",
      description: "Prioritizes stable income with lower volatility",
      returnRate: "+5.8%",
      riskLevel: "Low",
      badge: {
        text: "Conservative",
        color: "blue"
      }
    },
    {
      id: "growth-income",
      name: "Growth & Income",
      provider: "BlackRock",
      description: "Balance between growth and stable income",
      returnRate: "+8.2%",
      riskLevel: "Medium",
      badge: {
        text: "Balanced",
        color: "indigo"
      }
    },
    {
      id: "maximum-growth",
      name: "Maximum Growth",
      provider: "Vanguard",
      description: "Focus on long-term capital appreciation",
      returnRate: "+12.5%",
      riskLevel: "High",
      badge: {
        text: "Aggressive",
        color: "purple"
      }
    },
    {
      id: "sustainable-future",
      name: "Sustainable Future",
      provider: "Alpha Architect",
      description: "ESG-focused investments with positive impact",
      returnRate: "+9.6%",
      riskLevel: "Medium",
      badge: {
        text: "ESG",
        color: "emerald"
      }
    },
    {
      id: "dynamic-allocation",
      name: "Dynamic Allocation",
      provider: "Boutique Family Office",
      description: "Active management with tactical shifts",
      returnRate: "+10.3%",
      riskLevel: "Medium-High",
      badge: {
        text: "Tactical",
        color: "amber"
      }
    },
    {
      id: "international-focus",
      name: "International Focus",
      provider: "BlackRock",
      description: "Diversified exposure to global markets",
      returnRate: "+7.8%",
      riskLevel: "Medium",
      badge: {
        text: "Global",
        color: "red"
      }
    },
  ];

  const modelPortfolios: ModelPortfolio[] = [
    {
      name: "Core Growth 60/40",
      type: "Strategic",
      taxStatus: "Tax-Aware",
      assignedAccounts: 2,
      tradingGroups: 1
    },
    {
      name: "Income Focus 40/60",
      type: "Income",
      taxStatus: "Tax-Exempt",
      assignedAccounts: 3,
      tradingGroups: 2
    },
    {
      name: "Aggressive Growth 80/20",
      type: "Strategic",
      taxStatus: "Taxable",
      assignedAccounts: 1,
      tradingGroups: 1
    }
  ];

  const handlePortfolioClick = (model: PortfolioModel) => {
    navigate(`/client-investments/models/${model.id}`);
  };

  const handleViewAllModels = () => {
    navigate("/client-investments/models/all");
  };

  const handleStartBuildingClick = () => {
    navigate("/client-investments/builder");
  };

  const handleViewDetails = (e: React.MouseEvent, model: PortfolioModel) => {
    e.stopPropagation();
    navigate(`/client-investments/models/${model.id}`);
  };

  const handleScheduleAppointment = (e: React.MouseEvent, assetName: string) => {
    e.stopPropagation();
    setSelectedAsset(assetName);
    setScheduleMeetingOpen(true);
  };

  const handleTabChange = (value: string) => {
    // Prevent switching to bfo-models tab
    if (value === "bfo-models") {
      toast.info("BFO Models feature is coming soon!");
      return;
    }
    setSelectedTab(value);
    navigate(`/client-investments?tab=${value}`, { replace: true });
  };

  const handleAssetClick = (path: string) => {
    navigate(path);
  };

  const alternativeCategories = [
    {
      id: "private-equity",
      title: "Private Equity",
      description: "Investments in private companies or buyouts of public companies resulting in a delisting of public equity.",
      path: "/client-investments/alternative/private-equity"
    },
    {
      id: "private-debt",
      title: "Private Debt", 
      description: "Loans made by non-bank institutions to private companies or commercial real estate owners with complex needs.",
      path: "/client-investments/alternative/private-debt"
    },
    {
      id: "hedge-fund",
      title: "Hedge Fund",
      description: "Alternative investment vehicles employing different strategies to earn returns regardless of market direction.",
      path: "/client-investments/alternative/hedge-fund"
    },
    {
      id: "venture-capital",
      title: "Venture Capital",
      description: "Investments in early stage companies with high growth potential across various industries.",
      path: "/client-investments/alternative/venture-capital"
    },
    {
      id: "collectibles",
      title: "Collectibles",
      description: "Investments in rare physical assets including art, wine, classic cars, watches and other luxury items.",
      path: "/client-investments/alternative/collectibles"
    },
    {
      id: "digital-assets",
      title: "Digital Assets",
      description: "Investments in blockchain technology, cryptocurrencies, and other digital asset infrastructure.",
      path: "/client-investments/alternative/digital-assets"
    },
    {
      id: "real-assets",
      title: "Real Assets",
      description: "Investments in physical assets including real estate, infrastructure, natural resources, and commodities.",
      path: "/client-investments/alternative/real-assets"
    },
    {
      id: "structured-investments",
      title: "Structured Investments",
      description: "Customized investment products with specific risk/return profiles using derivatives and financial engineering.",
      path: "/client-investments/alternative/structured-investments"
    }
  ];

  return (
    <ThreeColumnLayout activeMainItem="investments" title="">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Investment Management</h1>
          <p className="text-muted-foreground text-base">
            Explore a curated selection of investment options tailored to your financial goals. 
            Our solutions range from model portfolios to exclusive alternative assets.
          </p>
        </div>

        <Tabs value={selectedTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="intelligent-alloc" className="flex-1">Intelligent Alloc.</TabsTrigger>
            <TabsTrigger value="private-markets" className="flex-1">Private Markets</TabsTrigger>
            <TabsTrigger 
              value="bfo-models" 
              className="flex-1 relative cursor-not-allowed opacity-60" 
              disabled
            >
              <span className="flex items-center gap-2">
                BFO Models
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                  Coming Soon
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="intelligent-alloc">
            <IntelligentAllocationTab />
          </TabsContent>

          <TabsContent value="private-markets" className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Alternative Investment Categories</h2>
                <p className="text-muted-foreground">
                  Explore exclusive private market investment opportunities within these alternative asset classes. 
                  Click on a category to view available offerings.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alternativeCategories.map((category) => (
                  <div 
                    key={category.id}
                    onClick={() => handleAssetClick(category.path)} 
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 p-6 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-black group-hover:text-yellow-400 transition-colors">
                          {category.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed flex-1">
                        {category.description}
                      </p>
                      
                      <div className="flex justify-start">
                        <Badge 
                          variant="outline" 
                          className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs font-medium px-3 py-1"
                        >
                          Private Market Alpha
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bfo-models" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Your Model Portfolios</h2>
                <Button 
                  onClick={() => setPortfolioPickerOpen(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6"
                >
                  Pick a Model Portfolio
                </Button>
              </div>
              
              {bfoError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">Error loading portfolio data: {bfoError}</p>
                </div>
              )}
              
              <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <BFOModelsTable assignments={userAssignments} loading={bfoLoading} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {scheduleMeetingOpen && (
          <ScheduleMeetingDialog 
            assetName={selectedAsset}
            consultationType="investment"
          />
        )}

        <PortfolioPickerDialog 
          open={portfolioPickerOpen}
          onOpenChange={setPortfolioPickerOpen}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
