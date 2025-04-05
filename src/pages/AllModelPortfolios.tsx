
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Search, SlidersHorizontal, Briefcase, ArrowUpDown } from "lucide-react";

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
  assetClass?: string;
  strategy?: string;
  fees?: string;
}

// Sample portfolio models data with extended properties
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
    },
    assetClass: "Fixed Income",
    strategy: "Income",
    fees: "0.35%"
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
    },
    assetClass: "Multi-Asset",
    strategy: "Balanced",
    fees: "0.45%"
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
    },
    assetClass: "Equity",
    strategy: "Growth",
    fees: "0.40%"
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
    },
    assetClass: "Multi-Asset",
    strategy: "Sustainable",
    fees: "0.55%"
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
    },
    assetClass: "Multi-Asset",
    strategy: "Tactical",
    fees: "0.60%"
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
    },
    assetClass: "Equity",
    strategy: "International",
    fees: "0.50%"
  },
  {
    id: "emerging-markets",
    name: "Emerging Markets",
    provider: "Dimensional Fund Advisors",
    description: "Focused exposure to emerging market equities",
    returnRate: "+11.2%",
    riskLevel: "High",
    badge: {
      text: "Specialized",
      color: "orange"
    },
    assetClass: "Equity",
    strategy: "Specialized",
    fees: "0.65%"
  },
  {
    id: "technology-sector",
    name: "Technology Sector",
    provider: "Vanguard",
    description: "Concentrated portfolio of technology companies",
    returnRate: "+15.7%",
    riskLevel: "High",
    badge: {
      text: "Sector",
      color: "violet"
    },
    assetClass: "Equity",
    strategy: "Sector",
    fees: "0.42%"
  },
  {
    id: "bond-aggregate",
    name: "Bond Aggregate",
    provider: "BlackRock",
    description: "Diversified fixed income exposure across sectors",
    returnRate: "+3.9%",
    riskLevel: "Low",
    badge: {
      text: "Conservative",
      color: "blue"
    },
    assetClass: "Fixed Income",
    strategy: "Core",
    fees: "0.25%"
  },
  {
    id: "high-yield-credit",
    name: "High Yield Credit",
    provider: "Alpha Architect",
    description: "Higher income potential with credit risk",
    returnRate: "+7.2%",
    riskLevel: "Medium-High",
    badge: {
      text: "Income",
      color: "yellow"
    },
    assetClass: "Fixed Income",
    strategy: "Income",
    fees: "0.55%"
  },
  {
    id: "global-allocation",
    name: "Global Allocation",
    provider: "Boutique Family Office",
    description: "Globally diversified multi-asset portfolio",
    returnRate: "+9.1%",
    riskLevel: "Medium",
    badge: {
      text: "Global",
      color: "red"
    },
    assetClass: "Multi-Asset",
    strategy: "Global",
    fees: "0.58%"
  },
  {
    id: "tax-efficient",
    name: "Tax-Efficient Growth",
    provider: "Vanguard",
    description: "Tax-optimized portfolio for taxable accounts",
    returnRate: "+8.6%",
    riskLevel: "Medium",
    badge: {
      text: "Tax-Efficient",
      color: "green"
    },
    assetClass: "Multi-Asset",
    strategy: "Tax-Efficient",
    fees: "0.38%"
  },
];

const AllModelPortfolios = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterProvider, setFilterProvider] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  const [filterStrategy, setFilterStrategy] = useState<string | null>(null);
  
  // Get unique providers for filter
  const providers = Array.from(new Set(portfolioModels.map(model => model.provider)));
  
  // Get unique risk levels for filter
  const riskLevels = Array.from(new Set(portfolioModels.map(model => model.riskLevel)));
  
  // Get unique strategies for filter
  const strategies = Array.from(new Set(portfolioModels.map(model => model.strategy).filter(Boolean)));

  // Filter and sort portfolios
  const filteredPortfolios = portfolioModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesProvider = !filterProvider || model.provider === filterProvider;
    const matchesRisk = !filterRisk || model.riskLevel === filterRisk;
    const matchesStrategy = !filterStrategy || model.strategy === filterStrategy;
    
    return matchesSearch && matchesProvider && matchesRisk && matchesStrategy;
  }).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "return") {
      return parseFloat(b.returnRate.replace('+', '').replace('%', '')) - 
             parseFloat(a.returnRate.replace('+', '').replace('%', ''));
    } else if (sortBy === "risk") {
      const riskOrder = { "Low": 1, "Medium-Low": 2, "Medium": 3, "Medium-High": 4, "High": 5 };
      return (riskOrder[a.riskLevel as keyof typeof riskOrder] || 0) - 
             (riskOrder[b.riskLevel as keyof typeof riskOrder] || 0);
    } else if (sortBy === "provider") {
      return a.provider.localeCompare(b.provider);
    }
    return 0;
  });

  const handlePortfolioClick = (model: PortfolioModel) => {
    navigate(`/investments/models/${model.id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterProvider(null);
    setFilterRisk(null);
    setFilterStrategy(null);
  };

  return (
    <ThreeColumnLayout title="All Model Portfolios">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate('/investments')} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Investments
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Model Portfolios</CardTitle>
                <CardDescription>Browse all available model portfolios</CardDescription>
              </div>
              <Button onClick={() => navigate('/investments/builder')} className="md:self-end">
                Create Custom Portfolio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search portfolios..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => document.getElementById("filters-dialog")?.classList.toggle("hidden")}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div id="filters-dialog" className="mb-6 p-4 border rounded-lg hidden">
                <div className="text-sm font-medium mb-3">Filter Portfolios</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Provider</label>
                    <Select value={filterProvider || ""} onValueChange={(value) => setFilterProvider(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Providers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Providers</SelectItem>
                        {providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Risk Level</label>
                    <Select value={filterRisk || ""} onValueChange={(value) => setFilterRisk(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Risk Levels</SelectItem>
                        {riskLevels.map((risk) => (
                          <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Strategy</label>
                    <Select value={filterStrategy || ""} onValueChange={(value) => setFilterStrategy(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Strategies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Strategies</SelectItem>
                        {strategies.map((strategy) => (
                          <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Sort By</label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="return">Highest Return</SelectItem>
                        <SelectItem value="risk">Risk Level (Low-High)</SelectItem>
                        <SelectItem value="provider">Provider (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              <TabsContent value="grid" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolios.map((model) => (
                    <div 
                      key={model.id} 
                      className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer transition-colors"
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
                        <Button 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/investments/models/${model.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredPortfolios.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No matching portfolios found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
                    <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="table" className="mt-0">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">
                          <button className="flex items-center gap-1" onClick={() => setSortBy("name")}>
                            Name
                            {sortBy === "name" && <ArrowUpDown className="h-3 w-3" />}
                          </button>
                        </th>
                        <th className="text-left p-3 font-medium">
                          <button className="flex items-center gap-1" onClick={() => setSortBy("provider")}>
                            Provider
                            {sortBy === "provider" && <ArrowUpDown className="h-3 w-3" />}
                          </button>
                        </th>
                        <th className="text-center p-3 font-medium">
                          <button className="flex items-center gap-1" onClick={() => setSortBy("risk")}>
                            Risk Level
                            {sortBy === "risk" && <ArrowUpDown className="h-3 w-3" />}
                          </button>
                        </th>
                        <th className="text-center p-3 font-medium">
                          <button className="flex items-center gap-1" onClick={() => setSortBy("return")}>
                            5Y Return
                            {sortBy === "return" && <ArrowUpDown className="h-3 w-3" />}
                          </button>
                        </th>
                        <th className="text-center p-3 font-medium">Strategy</th>
                        <th className="text-center p-3 font-medium">Fees</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPortfolios.map((model) => (
                        <tr key={model.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => handlePortfolioClick(model)}>
                          <td className="p-3">
                            <div className="font-medium">{model.name}</div>
                          </td>
                          <td className="p-3">{model.provider}</td>
                          <td className="p-3 text-center">{model.riskLevel}</td>
                          <td className="p-3 text-center text-emerald-500 font-medium">{model.returnRate}</td>
                          <td className="p-3 text-center">{model.strategy}</td>
                          <td className="p-3 text-center">{model.fees}</td>
                          <td className="p-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/investments/models/${model.id}`);
                              }}
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredPortfolios.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No matching portfolios found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
                    <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default AllModelPortfolios;
