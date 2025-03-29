
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
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const Investments = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const holdings = [
    { id: 1, symbol: "VTI", name: "Vanguard Total Stock Market ETF", shares: 152, price: 245.68, value: 37343.36, change: 1.23 },
    { id: 2, symbol: "VXUS", name: "Vanguard Total International Stock ETF", shares: 320, price: 58.92, value: 18854.40, change: -0.52 },
    { id: 3, symbol: "BND", name: "Vanguard Total Bond Market ETF", shares: 275, price: 72.15, value: 19841.25, change: 0.37 },
    { id: 4, symbol: "AAPL", name: "Apple Inc.", shares: 45, price: 175.24, value: 7885.80, change: 2.15 },
    { id: 5, symbol: "MSFT", name: "Microsoft Corporation", shares: 32, price: 338.11, value: 10819.52, change: 1.87 },
    { id: 6, symbol: "AMZN", name: "Amazon.com Inc.", shares: 28, price: 145.22, value: 4066.16, change: 0.94 }
  ];

  const portfolioPerformance = [
    { period: "1 Day", return: 0.75, amount: 1932.25 },
    { period: "1 Week", return: 1.35, amount: 3478.12 },
    { period: "1 Month", return: 2.75, amount: 7082.50 },
    { period: "3 Months", return: 4.85, amount: 12489.75 },
    { period: "YTD", return: 8.25, amount: 21255.00 },
    { period: "1 Year", return: 12.65, amount: 32594.75 }
  ];

  const allocation = [
    { type: "US Stocks", percentage: 45, color: "bg-blue-500" },
    { type: "International", percentage: 20, color: "bg-green-500" },
    { type: "Bonds", percentage: 25, color: "bg-amber-500" },
    { type: "Tech Sector", percentage: 10, color: "bg-purple-500" }
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Investments</h1>
          <Button className="bg-white text-black hover:bg-slate-100">
            <Plus className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                +5.3% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Gain/Loss YTD</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+$21,255.00</div>
              <p className="text-xs text-muted-foreground">
                +8.25% year to date
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Cash Balance</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450.00</div>
              <p className="text-xs text-muted-foreground">
                Available for investment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Dividend Yield</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.85%</div>
              <p className="text-xs text-muted-foreground">
                $7,342.23 in the last year
              </p>
            </CardContent>
          </Card>
        </div>
        
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
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Returns over different time periods</CardDescription>
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
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Performance metrics over various timeframes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
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
                    <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Alpha (1 Year)</p>
                        <p className="text-2xl font-semibold text-green-500">+2.34%</p>
                        <p className="text-xs text-gray-400 mt-1">Outperformed benchmark by 2.34%</p>
                      </div>
                      
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Beta (1 Year)</p>
                        <p className="text-2xl font-semibold">0.87</p>
                        <p className="text-xs text-gray-400 mt-1">Less volatile than the market</p>
                      </div>
                      
                      <div className="p-4 bg-[#121a2c] rounded-lg">
                        <p className="text-sm text-gray-400">Sharpe Ratio</p>
                        <p className="text-2xl font-semibold">1.85</p>
                        <p className="text-xs text-gray-400 mt-1">Good risk-adjusted return</p>
                      </div>
                    </div>
                  </div>
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
    </ThreeColumnLayout>
  );
};

export default Investments;

