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
import { getAllInvestmentCategoryData } from "@/services/marketDataService";

// Portfolio model type definition
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

const Investments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("private-market");
  const [alternativeData, setAlternativeData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Parse the URL query parameters to check for tab selection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["private-market", "model-portfolios", "intelligent", "stock-screener"].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [location.search]);
  
  // Fetch market data for alternative investments
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInvestmentCategoryData();
        setAlternativeData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Set fallback data
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
  
  // Portfolio models data definition
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

  // Handler for portfolio model cards
  const handlePortfolioClick = (model: PortfolioModel) => {
    navigate(`/investments/models/${model.id}`);
  };

  // Handler for the View All button
  const handleViewAllModels = () => {
    navigate("/investments/models/all");
  };

  // Handler for the Start Building button
  const handleStartBuildingClick = () => {
    navigate("/investments/builder");
  };

  // Handler for View Details buttons on portfolio cards
  const handleViewDetails = (e: React.MouseEvent, model: PortfolioModel) => {
    e.stopPropagation();
    navigate(`/investments/models/${model.id}`);
  };

  // Handler for scheduling appointments
  const handleScheduleAppointment = (e: React.MouseEvent, assetName: string) => {
    e.stopPropagation();
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${assetName} with your advisor.`,
    });
  };

  // Handler for tab changes to update URL
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    navigate(`/investments?tab=${value}`, { replace: true });
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="space-y-8">
        <Tabs value={selectedTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="private-market" className="flex-1">Private Market Alpha</TabsTrigger>
            <TabsTrigger value="model-portfolios" className="flex-1">Model Portfolios</TabsTrigger>
            <TabsTrigger value="intelligent" className="flex-1">Intelligent Allocation</TabsTrigger>
            <TabsTrigger value="stock-screener" className="flex-1">
              <SearchIcon className="h-4 w-4 mr-2" />
              Stock Screener
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="private-market" className="space-y-8">
            {/* Private Market Alpha Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Private Market Alpha</h2>
                <Button variant="outline" asChild className="flex items-center gap-1">
                  <Link to="/investments/alternative/all">
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
                  <Link to="/investments/alternative/private-equity" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
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
                  </Link>
                  
                  <Link to="/investments/alternative/private-debt" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
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
                  </Link>
                  
                  <Link to="/investments/alternative/digital-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
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
                  </Link>
                  
                  <Link to="/investments/alternative/real-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
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
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Model Portfolios Tab */}
          <TabsContent value="model-portfolios" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Model Portfolios</h2>
                <Button variant="outline" onClick={handleViewAllModels} className="flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Portfolios Available</div>
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-muted-foreground text-sm">Strategically designed allocations</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Historical Performance</div>
                    <div className="text-3xl font-bold text-emerald-500">+8.7%</div>
                    <div className="text-muted-foreground text-sm">Average 5-year return</div>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground text-sm">Customization Options</div>
                    <div className="text-3xl font-bold">6</div>
                    <div className="text-muted-foreground text-sm">Risk profiles to choose from</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Featured Model Portfolios</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioModels.map((model) => (
                    <div 
                      key={model.id} 
                      className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer"
                      onClick={() => handlePortfolioClick(model)}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <Briefcase className="h-10 w-10 text-blue-500" />
                          <Badge 
                            className={`bg-${model.badge.color}-50 text-${model.badge.color}-700 dark:bg-${model.badge.color}-900 dark:text-${model.badge.color}-300 border-${model.badge.color}-200 dark:border-${model.badge.color}-800`}
                          >
                            {model.badge.text}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">{model.name}</h4>
                          <p className="text-muted-foreground text-sm mt-1">{model.description}</p>
                          <p className="text-xs text-blue-600 mt-1">Provider: {model.provider}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <p className="text-muted-foreground">Return (5Y)</p>
                            <p className="font-medium text-emerald-500">{model.returnRate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Risk Level</p>
                            <p className="font-medium">{model.riskLevel}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={(e) => handleViewDetails(e, model)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="w-full mt-2"
                            onClick={(e) => handleScheduleAppointment(e, model.name)}
                          >
                            <CalendarClock className="h-3 w-3 mr-1" /> Consult
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4">Portfolio Builder</h3>
                <div className="bg-card border rounded-lg p-6">
                  <p className="text-muted-foreground mb-4">Create a customized model portfolio based on your risk tolerance and investment goals.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full" onClick={handleStartBuildingClick}>Start Building</Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={(e) => {
                        window.open("https://calendly.com/tonygomes/60min", "_blank");
                        toast.success("Opening scheduling page", {
                          description: "Schedule a consultation with an advisor to discuss portfolio options.",
                        });
                      }}
                    >
                      <CalendarClock className="h-4 w-4" /> Schedule Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="intelligent">
            <IntelligentAllocationTab />
          </TabsContent>

          {/* Stock Screener Tab */}
          <TabsContent value="stock-screener">
            <StockScreener />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
