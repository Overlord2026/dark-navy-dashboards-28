import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Briefcase, 
  BarChart, 
  PieChart, 
  ArrowDown, 
  ArrowUp, 
  Plus,
  DollarSign,
  Building,
  Gem,
  Wine,
  Bitcoin,
  HardHat,
  LineChart,
  Landmark,
  Network,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { investmentCategories } from "@/components/navigation/NavigationConfig";
import { useMarketData } from "@/hooks/useMarketData";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Investments = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState("model-portfolios");
  const { marketData, isLoading: isMarketDataLoading } = useMarketData();

  const holdings = [
    { id: 1, symbol: "VTI", name: "Vanguard Total Stock Market ETF", shares: 152, price: 245.68, value: 37343.36, change: 1.23 },
    { id: 2, symbol: "VXUS", name: "Vanguard Total International Stock ETF", shares: 320, price: 58.92, value: 18854.40, change: -0.52 },
    { id: 3, symbol: "BND", name: "Vanguard Total Bond Market ETF", shares: 275, price: 72.15, value: 19841.25, change: 0.37 },
    { id: 4, symbol: "AAPL", name: "Apple Inc.", shares: 45, price: 175.24, value: 7885.80, change: 2.15 },
    { id: 5, symbol: "MSFT", name: "Microsoft Corporation", shares: 32, price: 338.11, value: 10819.52, change: 1.87 },
    { id: 6, symbol: "AMZN", name: "Amazon.com Inc.", shares: 28, price: 145.22, value: 4066.16, change: 0.94 }
  ];

  const portfolioPerformance = [
    { period: "1 Day", return: 0.75, amount: 1932.25, isHypothetical: true },
    { period: "1 Week", return: 1.35, amount: 3478.12, isHypothetical: true },
    { period: "1 Month", return: 2.75, amount: 7082.50, isHypothetical: true },
    { period: "3 Months", return: 4.85, amount: 12489.75, isHypothetical: true },
    { period: "YTD", return: 8.25, amount: 21255.00, isHypothetical: true },
    { period: "1 Year", return: 12.65, amount: 32594.75, isHypothetical: true }
  ];

  const allocation = [
    { type: "US Stocks", percentage: 45, color: "bg-blue-500" },
    { type: "International", percentage: 20, color: "bg-green-500" },
    { type: "Bonds", percentage: 25, color: "bg-amber-500" },
    { type: "Tech Sector", percentage: 10, color: "bg-purple-500" }
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  const alternativeAssets = [
    { id: 1, name: "Private Equity Fund Alpha", value: 125000, allocation: 15, performance: 18.5, risk: "High" },
    { id: 2, name: "Real Estate Trust Beta", value: 200000, allocation: 25, performance: 12.3, risk: "Medium" },
    { id: 3, name: "Private Debt Fund Gamma", value: 175000, allocation: 22, performance: 9.8, risk: "Medium-High" },
    { id: 4, name: "Digital Assets Portfolio", value: 80000, allocation: 10, performance: -5.2, risk: "Very High" }
  ];

  const totalAlternativeValue = alternativeAssets.reduce((sum, asset) => sum + asset.value, 0);

  const modelPortfolios = [
    { 
      id: 1, 
      name: "Growth Portfolio", 
      type: "Aggressive Growth", 
      taxStatus: "Taxable", 
      assignedAccounts: 3, 
      tradingGroups: 2, 
      created: "Oct 12, 2023" 
    },
    { 
      id: 2, 
      name: "Income Strategy", 
      type: "Income", 
      taxStatus: "Tax-Advantaged", 
      assignedAccounts: 2, 
      tradingGroups: 1, 
      created: "Nov 05, 2023" 
    },
    { 
      id: 3, 
      name: "Balanced Approach", 
      type: "Balanced", 
      taxStatus: "Mixed", 
      assignedAccounts: 5, 
      tradingGroups: 3, 
      created: "Jan 18, 2024" 
    },
    { 
      id: 4, 
      name: "Conservative Allocation", 
      type: "Conservative", 
      taxStatus: "Tax-Advantaged", 
      assignedAccounts: 1, 
      tradingGroups: 1, 
      created: "Feb 22, 2024" 
    },
    { 
      id: 5, 
      name: "Tech Sector Focus", 
      type: "Sector Specific", 
      taxStatus: "Taxable", 
      assignedAccounts: 2, 
      tradingGroups: 2, 
      created: "Mar 10, 2024" 
    }
  ];

  const alternativeCategories = [
    { 
      id: 1, 
      title: "Private Equity", 
      slug: "private-equity",
      description: "Investments in non-public companies, buyouts, growth equity", 
      icon: <Briefcase className="h-10 w-10 text-purple-500" />,
      trend: isMarketDataLoading ? "Loading..." : 
             `${marketData['private-equity']?.ytdPerformance >= 0 ? '+' : ''}${marketData['private-equity']?.ytdPerformance || 12.4}% YTD`
    },
    { 
      id: 2, 
      title: "Private Debt", 
      slug: "private-debt",
      description: "Direct lending, mezzanine financing, distressed debt",
      icon: <Landmark className="h-10 w-10 text-blue-500" />,
      trend: isMarketDataLoading ? "Loading..." : 
             `${marketData['private-debt']?.ytdPerformance >= 0 ? '+' : ''}${marketData['private-debt']?.ytdPerformance || 8.7}% YTD`
    },
    { 
      id: 4, 
      title: "Digital Assets", 
      slug: "digital-assets",
      description: "Cryptocurrencies, NFTs, blockchain investments",
      icon: <Bitcoin className="h-10 w-10 text-orange-500" />,
      trend: isMarketDataLoading ? "Loading..." : 
             `${marketData['digital-assets']?.ytdPerformance >= 0 ? '+' : ''}${marketData['digital-assets']?.ytdPerformance || -2.8}% YTD`
    },
    { 
      id: 5, 
      title: "Real Assets", 
      slug: "real-assets",
      description: "Real estate, infrastructure, commodities, natural resources",
      icon: <Building className="h-10 w-10 text-indigo-500" />,
      trend: isMarketDataLoading ? "Loading..." : 
             `${marketData['real-assets']?.ytdPerformance >= 0 ? '+' : ''}${marketData['real-assets']?.ytdPerformance || 9.1}% YTD`
    }
  ];

  const renderModelPortfoliosContent = () => (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Model Portfolios</h1>
        <Button className="bg-white text-black hover:bg-slate-100">
          <Plus className="mr-2 h-4 w-4" />
          Pick a Model Portfolio
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Model Portfolios</CardTitle>
          <CardDescription>Manage your investment strategies and allocations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border-collapse">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tax Status</TableHead>
                <TableHead>Assigned to Accounts</TableHead>
                <TableHead>Trading Groups Applied</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelPortfolios.map((portfolio) => (
                <TableRow 
                  key={portfolio.id}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <TableCell className="font-medium">{portfolio.name}</TableCell>
                  <TableCell>{portfolio.type}</TableCell>
                  <TableCell>{portfolio.taxStatus}</TableCell>
                  <TableCell>{portfolio.assignedAccounts}</TableCell>
                  <TableCell>{portfolio.tradingGroups}</TableCell>
                  <TableCell>{portfolio.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-32">
                        <InterestedButton assetName={portfolio.name} />
                      </div>
                      <div className="w-48">
                        <ScheduleMeetingDialog assetName={portfolio.name} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>Portfolio Performance</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">All returns shown are hypothetical and for illustrative purposes only. Past performance does not guarantee future results.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Hypothetical</div>
                </div>
                <CardDescription>Illustrative returns over different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Return</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioPerformance.map((item) => (
                      <TableRow key={item.period}>
                        <TableCell>{item.period}</TableCell>
                        <TableCell className={item.return >= 0 ? "text-green-500" : "text-red-500"}>
                          {item.return >= 0 ? "+" : ""}{item.return}%
                        </TableCell>
                        <TableCell className="text-right">
                          {item.amount >= 0 ? "+" : ""}${item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocation.map((asset) => (
                    <div key={asset.type}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{asset.type}</span>
                        <span>{asset.percentage}%</span>
                      </div>
                      <Progress value={asset.percentage} className={`h-2 ${asset.color}/20`} indicatorClassName={asset.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
                <CardDescription>Your largest investments by value</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.slice(0, 4).map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell className="font-medium">{holding.symbol}</TableCell>
                        <TableCell>{holding.name}</TableCell>
                        <TableCell>{holding.shares}</TableCell>
                        <TableCell>${holding.price.toLocaleString()}</TableCell>
                        <TableCell className={holding.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {holding.change >= 0 ? (
                            <span className="flex items-center">
                              <ArrowUp className="h-3.5 w-3.5 mr-1" />
                              {holding.change}%
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ArrowDown className="h-3.5 w-3.5 mr-1" />
                              {Math.abs(holding.change)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">${holding.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" className="mt-4 w-full">View All Holdings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="holdings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
              <CardDescription>Complete list of your investments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell className="font-medium">{holding.symbol}</TableCell>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.shares}</TableCell>
                      <TableCell>${holding.price.toLocaleString()}</TableCell>
                      <TableCell className={holding.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {holding.change >= 0 ? (
                          <span className="flex items-center">
                            <ArrowUp className="h-3.5 w-3.5 mr-1" />
                            {holding.change}%
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ArrowDown className="h-3.5 w-3.5 mr-1" />
                            {Math.abs(holding.change)}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">${holding.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Portfolio Performance</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">All returns shown are hypothetical and for illustrative purposes only. These figures do not represent actual investment results.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Hypothetical</div>
              </div>
              <CardDescription>Illustrative performance metrics over various timeframes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-1">
                    Hypothetical Performance
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Return</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioPerformance.map((item) => (
                        <TableRow key={item.period}>
                          <TableCell>{item.period}</TableCell>
                          <TableCell className={item.return >= 0 ? "text-green-500" : "text-red-500"}>
                            {item.return >= 0 ? "+" : ""}{item.return}%
                          </TableCell>
                          <TableCell className="text-right">
                            {item.amount >= 0 ? "+" : ""}${item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-1">
                    Hypothetical Metrics
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>These metrics are hypothetical and do not represent actual investment performance.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#121a2c] rounded-lg">
                      <p className="text-sm text-gray-400">Alpha (1 Year)</p>
                      <p className="text-2xl font-semibold text-green-500">+2.34%</p>
                      <p className="text-xs text-gray-400 mt-1">Hypothetical outperformance</p>
                    </div>
                    
                    <div className="p-4 bg-[#121a2c] rounded-lg">
                      <p className="text-sm text-gray-400">Beta (1 Year)</p>
                      <p className="text-2xl font-semibold">0.87</p>
                      <p className="text-xs text-gray-400 mt-1">Hypothetical volatility measure</p>
                    </div>
                    
                    <div className="p-4 bg-[#121a2c] rounded-lg">
                      <p className="text-sm text-gray-400">Sharpe Ratio</p>
                      <p className="text-2xl font-semibold">1.85</p>
                      <p className="text-xs text-gray-400 mt-1">Hypothetical risk-adjusted return</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 mt-6 text-sm rounded-md">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    <strong>Important Disclosure:</strong> The performance data shown represents hypothetical, backtested performance. 
                    Hypothetical performance is not an indicator of future actual results. The results reflect performance of a strategy not historically offered to investors and does 
                    not represent returns that any investor actually attained. Please consult with your financial advisor before making any investment decisions.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-10-15</TableCell>
                    <TableCell>Buy</TableCell>
                    <TableCell>AAPL - 5 shares @ $172.50</TableCell>
                    <TableCell className="text-right text-red-500">-$862.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-12</TableCell>
                    <TableCell>Dividend</TableCell>
                    <TableCell>VTI Quarterly Dividend</TableCell>
                    <TableCell className="text-right text-green-500">+$124.75</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-10</TableCell>
                    <TableCell>Sell</TableCell>
                    <TableCell>MSFT - 8 shares @ $335.25</TableCell>
                    <TableCell className="text-right text-green-500">+$2,682.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-05</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell>Cash Deposit</TableCell>
                    <TableCell className="text-right text-green-500">+$5,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-02</TableCell>
                    <TableCell>Buy</TableCell>
                    <TableCell>BND - 25 shares @ $71.35</TableCell>
                    <TableCell className="text-right text-red-500">-$1,783.75</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-09-28</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Management Fee</TableCell>
                    <TableCell className="text-right text-red-500">-$125.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4 w-full">View More Activity</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {allocation.map((asset) => (
                    <div key={asset.type}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{asset.type}</span>
                        <span>{asset.percentage}%</span>
                      </div>
                      <Progress value={asset.percentage} className={`h-2 ${asset.color}/20`} indicatorClassName={asset.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Target Allocation</CardTitle>
                <CardDescription>Recommended portfolio balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>US Stocks</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-blue-500/20" indicatorClassName="bg-blue-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>International</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2 bg-green-500/20" indicatorClassName="bg-green-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Bonds</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2 bg-amber-500/20" indicatorClassName="bg-amber-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Tech Sector</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2 bg-purple-500/20" indicatorClassName="bg-purple-800" />
                  </div>
                </div>
                <Button className="mt-6 w-full">Rebalance Portfolio</Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sector Breakdown</CardTitle>
                <CardDescription>Distribution across market sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Technology</p>
                    <p className="text-lg font-semibold">28.5%</p>
                    <p className="text-xs text-green-500 mt-1">+3.2% vs target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Financial</p>
                    <p className="text-lg font-semibold">15.7%</p>
                    <p className="text-xs text-red-500 mt-1">-1.3% vs target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Healthcare</p>
                    <p className="text-lg font-semibold">12.4%</p>
                    <p className="text-xs text-green-500 mt-1">+0.4% vs target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Consumer</p>
                    <p className="text-lg font-semibold">10.8%</p>
                    <p className="text-xs text-gray-400 mt-1">On target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Energy</p>
                    <p className="text-lg font-semibold">8.2%</p>
                    <p className="text-xs text-red-500 mt-1">-0.8% vs target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Industrial</p>
                    <p className="text-lg font-semibold">7.5%</p>
                    <p className="text-xs text-gray-400 mt-1">On target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Materials</p>
                    <p className="text-lg font-semibold">5.3%</p>
                    <p className="text-xs text-green-500 mt-1">+0.3% vs target</p>
                  </div>
                  <div className="p-4 bg-[#121a2c] rounded-lg">
                    <p className="text-sm text-gray-400">Other</p>
                    <p className="text-lg font-semibold">11.6%</p>
                    <p className="text-xs text-red-500 mt-1">-1.4% vs target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAlternativeAssetsContent = () => (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Alternative Assets</h1>
        <div className="space-x-3">
          <Button className="bg-white text-black hover:bg-slate-100">
            <Plus className="mr-2 h-4 w-4" />
            Add Alternative Asset
          </Button>
          <Button variant="outline" className="flex items-center">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Alternative Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAlternativeValue.toLocaleString()}</div>
            <p className="text-xs text-blue-500 flex items-center">
              <ArrowUp className="h-3.5 w-3.5 mr-1" />
              +12.7% from last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Average Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+10.9%</div>
            <p className="text-xs text-muted-foreground">
              Annualized returns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Risk Assessment</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium-High</div>
            <p className="text-xs text-muted-foreground">
              Overall portfolio risk level
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-medium mb-4">Alternative Investment Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {alternativeCategories.map((category) => (
          <HoverCard key={category.id}>
            <HoverCardTrigger asChild>
              <Link to={`/investments/alternative/${category.slug}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {category.icon}
                      <p className={`text-sm font-medium flex items-center ${
                        isMarketDataLoading ? "text-gray-500" : 
                        (category.trend.includes('-') ? 'text-red-500' : 'text-green-500')
                      }`}>
                        {isMarketDataLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        {category.trend}
                      </p>
                    </div>
                    <CardTitle className="mt-2 flex items-center">
                      {category.title}
                      <ArrowRight className="ml-1 h-4 w-4 opacity-70" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{category.title} Details</h4>
                <p className="text-xs text-muted-foreground">{category.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Annual Return</p>
                    <p className="text-sm font-medium">{category.trend}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="text-sm font-medium">
                      {category.id % 3 === 0 ? "High" : category.id % 3 === 1 ? "Medium" : "Medium-High"}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm" className="w-full" asChild>
                    <Link to={`/investments/alternative/${category.slug}`}>
                      View Opportunities
                    </Link>
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Alternative Assets</CardTitle>
          <CardDescription>Currently held non-traditional investments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternativeAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>${asset.value.toLocaleString()}</TableCell>
                  <TableCell>{asset.allocation}%</TableCell>
                  <TableCell className={asset.performance >= 0 ? "text-green-500" : "text-red-500"}>
                    {asset.performance >= 0 ? (
                      <span className="flex items-center">
                        <ArrowUp className="h-3.5 w-3.5 mr-1" />
                        {asset.performance}%
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowDown className="h-3.5 w-3.5 mr-1" />
                        {Math.abs(asset.performance)}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{asset.risk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Analysis of risk factors in alternative assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Liquidity Risk</span>
                  <span>High</span>
                </div>
                <Progress value={75} className="h-2 bg-red-500/20" indicatorClassName="bg-red-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Market Risk</span>
                  <span>Medium</span>
                </div>
                <Progress value={50} className="h-2 bg-amber-500/20" indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Credit Risk</span>
                  <span>Low</span>
                </div>
                <Progress value={25} className="h-2 bg-green-500/20" indicatorClassName="bg-green-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Operational Risk</span>
                  <span>Medium-High</span>
                </div>
                <Progress value={65} className="h-2 bg-orange-500/20" indicatorClassName="bg-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projected Returns</CardTitle>
            <CardDescription>Expected performance over different time horizons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[#121a2c] rounded-lg">
                <p className="text-sm text-gray-400">1 Year Projection</p>
                <p className="text-xl font-semibold text-green-500">+12.5%</p>
                <p className="text-xs text-gray-400 mt-1">Based on current market conditions</p>
              </div>
              
              <div className="p-4 bg-[#121a2c] rounded-lg">
                <p className="text-sm text-gray-400">3 Year Projection</p>
                <p className="text-xl font-semibold text-green-500">+42.8%</p>
                <p className="text-xs text-gray-400 mt-1">Cumulative expected return</p>
              </div>
              
              <div className="p-4 bg-[#121a2c] rounded-lg">
                <p className="text-sm text-gray-400">5 Year Projection</p>
                <p className="text-xl font-semibold text-green-500">+83.5%</p>
                <p className="text-xs text-gray-400 mt-1">Cumulative expected return</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="mb-6">
        <div className="border-b mb-4">
          <div className="flex space-x-4">
            <Button 
              variant={activeSection === "model-portfolios" ? "default" : "outline"}
              className={cn(
                "rounded-none border-0 border-b-2",
                activeSection === "model-portfolios" 
                  ? "border-primary" 
                  : "border-transparent"
              )}
              onClick={() => setActiveSection("model-portfolios")}
            >
              Model Portfolios
            </Button>
            <Button 
              variant={activeSection === "alternative-assets" ? "default" : "outline"}
              className={cn(
                "rounded-none border-0 border-b-2",
                activeSection === "alternative-assets" 
                  ? "border-primary" 
                  : "border-transparent"
              )}
              onClick={() => setActiveSection("alternative-assets")}
            >
              Alternative Assets
            </Button>
          </div>
        </div>

        {activeSection === "model-portfolios" ? renderModelPortfoliosContent() : renderAlternativeAssetsContent()}
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
