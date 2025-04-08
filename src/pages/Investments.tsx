
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Briefcase, SearchIcon, CalendarClock, FileText } from "lucide-react";
import { IntelligentAllocationTab } from "@/components/investments/IntelligentAllocationTab";
import { StockScreener } from "@/components/investments/StockScreener";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";

interface PortfolioModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  riskLevel: string;
  badge: {
    text: string;
    color: string;
  };
}

interface AssetCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const Investments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("private-market");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["private-market", "model-portfolios", "intelligent", "stock-screener"].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [location.search]);

  // Define asset categories for the Private Market Alpha section
  const coreAssetCategories: AssetCategory[] = [
    {
      id: 'private-equity',
      name: 'Private Equity',
      description: 'Investments in non-public companies, buyouts, growth',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      route: "/investments/alternative/private-equity"
    },
    {
      id: 'private-debt',
      name: 'Private Debt',
      description: 'Direct lending, mezzanine financing, distressed debt',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
          <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      route: "/investments/alternative/private-debt"
    },
    {
      id: 'hedge-fund',
      name: 'Hedge Fund',
      description: 'Alternative investment strategies with active management',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
          <path d="M3 4L7 8L11 4L15 8L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12L7 16L11 12L15 16L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 20L7 16L11 20L15 16L19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      route: "/investments/alternative/hedge-fund"
    },
    {
      id: 'venture-capital',
      name: 'Venture Capital',
      description: 'Funding for early-stage, high-potential startups',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 8L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 16L19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M19 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 16L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      route: "/investments/alternative/venture-capital"
    },
    {
      id: 'collectibles',
      name: 'Collectibles',
      description: 'Art, rare items, trading cards, and memorabilia',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-500">
          <path d="M21 6L15.7074 12.3839C15.4019 12.7431 14.8603 12.7583 14.5364 12.4155L12.4636 10.1345C12.1397 9.79175 11.5981 9.80693 11.2926 10.1661L3 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      route: "/investments/alternative/collectibles"
    },
    {
      id: 'digital-assets',
      name: 'Digital Assets',
      description: 'Cryptocurrencies, NFTs, blockchain investments',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      route: "/investments/alternative/digital-assets"
    },
    {
      id: 'real-assets',
      name: 'Real Assets',
      description: 'Real estate, infrastructure, commodities',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
          <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 21V10L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 15V15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      route: "/investments/alternative/real-assets"
    },
    {
      id: 'structured-investments',
      name: 'Structured Investments',
      description: 'Custom financial products with defined outcomes',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-500">
          <path d="M8 13V17M12 9V17M16 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      route: "/investments/alternative/structured-investments"
    }
  ];

  // Portfolio models data for the Model Portfolios tab
  const portfolioModels: PortfolioModel[] = [
    {
      id: "income-focus",
      name: "Income Focus",
      provider: "Dimensional Fund Advisors",
      description: "Prioritizes stable income with lower volatility",
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
      riskLevel: "Medium",
      badge: {
        text: "Global",
        color: "red"
      }
    },
  ];

  const handlePortfolioClick = (model: PortfolioModel) => {
    navigate(`/investments/models/${model.id}`);
  };

  const handleViewAllModels = () => {
    navigate("/investments/models/all");
  };

  const handleViewModelManagers = () => {
    navigate("/investments/model-portfolios");
  };

  const handleStartBuildingClick = () => {
    navigate("/investments/builder");
  };

  const handleViewDetails = (e: React.MouseEvent, model: PortfolioModel) => {
    e.stopPropagation();
    navigate(`/investments/models/${model.id}`);
  };

  const handleScheduleAppointment = (e: React.MouseEvent, assetName: string) => {
    e.stopPropagation();
    setSelectedAsset(assetName);
    setScheduleMeetingOpen(true);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    navigate(`/investments?tab=${value}`, { replace: true });
  };

  const handleAssetClick = (path: string) => {
    navigate(path);
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Private Market Alpha</h2>
                  <p className="text-sm text-muted-foreground">Alternative investment opportunities for qualified investors</p>
                </div>
                <Button variant="outline" asChild className="flex items-center gap-1">
                  <Link to="/investments/alternative/all">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Alternative Asset Categories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coreAssetCategories.map((category) => (
                    <div 
                      key={category.id}
                      onClick={() => handleAssetClick(category.route)} 
                      className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block cursor-pointer"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">{category.name}</h4>
                          <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                        </div>
                        <div className="flex justify-end">
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="model-portfolios" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Model Portfolios</h2>
                <Button variant="outline" onClick={handleViewAllModels} className="flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
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
                        <div className="grid grid-cols-1 gap-2 text-sm mt-2">
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
                <h3 className="text-xl font-medium mb-4">Investment Manager Portfolios</h3>
                <div className="bg-card border rounded-lg p-6">
                  <p className="text-muted-foreground mb-4">Explore a wide range of model portfolios from top investment managers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full" onClick={handleViewModelManagers}>View All Managers</Button>
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

          <TabsContent value="stock-screener">
            <StockScreener />
          </TabsContent>
        </Tabs>
        
        <ScheduleMeetingDialog 
          open={scheduleMeetingOpen} 
          onOpenChange={setScheduleMeetingOpen}
          assetName={selectedAsset}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
