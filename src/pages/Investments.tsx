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
  const [selectedTab, setSelectedTab] = useState("bfo-models");
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
    if (tabParam && ["bfo-models", "intelligent-alloc", "private-markets"].includes(tabParam)) {
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
    setSelectedTab(value);
    navigate(`/client-investments?tab=${value}`, { replace: true });
  };

  const handleAssetClick = (path: string) => {
    navigate(path);
  };

  return (
    <ThreeColumnLayout activeMainItem="investments">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Investment Management</h1>
          <p className="text-muted-foreground text-lg">
            Explore a curated selection of investment options tailored to your financial goals. 
            Our solutions range from model portfolios to exclusive alternative assets.
          </p>
        </div>

        <Tabs value={selectedTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="bfo-models" className="flex-1">BFO Models</TabsTrigger>
            <TabsTrigger value="intelligent-alloc" className="flex-1">Intelligent Alloc.</TabsTrigger>
            <TabsTrigger value="private-markets" className="flex-1">Private Markets</TabsTrigger>
          </TabsList>
          
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
          
          <TabsContent value="intelligent-alloc">
            <IntelligentAllocationTab />
          </TabsContent>

          <TabsContent value="private-markets" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Private Market Alpha</h2>
                <Button variant="outline" asChild className="flex items-center gap-1">
                  <Link to="/client-investments/alternative/all">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Total Private Market Value</div>
                    <div className="text-3xl font-bold">$580,000</div>
                    <div className="text-emerald-500 text-sm">↑ 12.7% from last year</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Average Performance</div>
                    <div className="text-3xl font-bold text-emerald-500">+10.9%</div>
                    <div className="text-muted-foreground text-sm">Annualized returns</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Risk Assessment</div>
                    <div className="text-3xl font-bold">Medium-High</div>
                    <div className="text-muted-foreground text-sm">Overall portfolio risk level</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Private Market Categories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => handleAssetClick("/client-investments/alternative/private-equity")} 
                    className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block cursor-pointer"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-emerald-500">
                          {isLoading 
                            ? "Loading..." 
                            : `+${alternativeData['private-equity']?.ytdPerformance?.toFixed(1) || '12.4'}% YTD`
                          }
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Private Equity</h4>
                        <p className="text-muted-foreground text-sm mt-1">Investments in non-public companies, buyouts, growth</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleAssetClick("/client-investments/alternative/private-debt")} 
                    className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block cursor-pointer"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                          <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M17 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-emerald-500">
                          {isLoading 
                            ? "Loading..." 
                            : `+${alternativeData['private-debt']?.ytdPerformance?.toFixed(1) || '8.7'}% YTD`
                          }
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Private Debt</h4>
                        <p className="text-muted-foreground text-sm mt-1">Direct lending, mezzanine financing, distressed debt</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleAssetClick("/client-investments/alternative/digital-assets")} 
                    className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block cursor-pointer"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className={alternativeData['digital-assets']?.ytdPerformance < 0 ? "text-red-500" : "text-emerald-500"}>
                          {isLoading 
                            ? "Loading..." 
                            : `${alternativeData['digital-assets']?.ytdPerformance < 0 ? "" : "+"}${alternativeData['digital-assets']?.ytdPerformance?.toFixed(1) || '15.8'}% YTD`
                          }
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Digital Assets</h4>
                        <p className="text-muted-foreground text-sm mt-1">Cryptocurrencies, NFTs, blockchain investments</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleAssetClick("/client-investments/alternative/real-assets")} 
                    className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block cursor-pointer"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                          <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 21V10L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 15V15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-emerald-500">
                          {isLoading 
                            ? "Loading..." 
                            : `+${alternativeData['real-assets']?.ytdPerformance?.toFixed(1) || '9.1'}% YTD`
                          }
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Real Assets</h4>
                        <p className="text-muted-foreground text-sm mt-1">Real estate, infrastructure, commodities</p>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
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
