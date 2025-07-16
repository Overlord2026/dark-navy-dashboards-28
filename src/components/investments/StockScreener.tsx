import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchStockData, fetchStockPriceHistory } from "@/services/stockScreenerService";
import { generateStockAnalysis } from "@/services/aiAnalysisService";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  SearchIcon, 
  TrendingUp, 
  BarChart, 
  DollarSign, 
  Building, 
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  Brain,
  LineChart,
  CandlestickChart
} from "lucide-react";
import { toast } from "sonner";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Interface for the price history data
interface PriceHistoryDataPoint {
  date: string;
  price: number;
}

export const StockScreener: React.FC = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryDataPoint[]>([]);
  const [historyTimeframe, setHistoryTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("1M");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchPriceHistory = async (stockSymbol: string, timeframe: "1M" | "3M" | "6M" | "1Y") => {
    if (!stockSymbol) return;
    
    setLoadingHistory(true);
    try {
      // Use the fetchStockPriceHistory function from the service
      const historyData = await fetchStockPriceHistory(stockSymbol, timeframe);
      setPriceHistory(historyData);
    } catch (err) {
      console.error("Error in fetchPriceHistory:", err);
      // Generate mock data based on the current price as fallback
      const currentPrice = stockData?.price || 100;
      const daysToGenerate = calculateDaysFromTimeframe(timeframe);
      const mockHistory = generateMockPriceHistory(currentPrice, daysToGenerate);
      setPriceHistory(mockHistory);
      toast.error("Could not fetch real price history. Using estimated data.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const calculateDaysFromTimeframe = (timeframe: "1M" | "3M" | "6M" | "1Y"): number => {
    switch(timeframe) {
      case "3M": return 90;
      case "6M": return 180;
      case "1Y": return 365;
      default: return 30; // 1M is default
    }
  };

  const generateMockPriceHistory = (currentPrice: number, days: number = 30): PriceHistoryDataPoint[] => {
    if (!currentPrice) return [];
    
    const today = new Date();
    const data: PriceHistoryDataPoint[] = [];
    let price = currentPrice * 0.9; // Start ~10% lower than current
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // More realistic price movement simulation
      const volatility = 0.01; // 1% daily volatility
      const change = (Math.random() - 0.45) * (price * volatility); // Slightly biased upward
      price += change;
      
      // Ensure price doesn't go negative
      if (price <= 0) price = 0.01;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      });
    }
    
    // Ensure the last price matches the current price
    if (data.length > 0) {
      data[data.length - 1].price = currentPrice;
    }
    
    return data;
  };

  const handleSearch = async () => {
    if (!symbol.trim()) {
      toast.error("Please enter a stock symbol");
      return;
    }
    
    setLoading(true);
    setError(null);
    setAiAnalysis(null);
    setPriceHistory([]);
    
    try {
      const data = await fetchStockData(symbol);
      
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setStockData(data);
        
        if (!recentSearches.includes(data.symbol)) {
          setRecentSearches(prev => [data.symbol, ...prev].slice(0, 5));
        }
        
        toast.success(`Loaded data for ${data.companyName} (${data.symbol})`);
        
        // Fetch price history after getting stock data
        await fetchPriceHistory(data.symbol, historyTimeframe);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stock data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTimeframe = async (timeframe: "1M" | "3M" | "6M" | "1Y") => {
    setHistoryTimeframe(timeframe);
    if (stockData?.symbol) {
      await fetchPriceHistory(stockData.symbol, timeframe);
    }
  };

  const handleGetAIAnalysis = async () => {
    if (!stockData) return;
    
    setIsAnalyzing(true);
    toast.info(`Generating AI analysis for ${stockData.symbol}...`);
    
    try {
      const analysis = await generateStockAnalysis(stockData);
      setAiAnalysis(analysis);
      toast.success("AI analysis complete");
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      toast.error("Failed to generate AI analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatLargeNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const handleScheduleAppointment = () => {
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${stockData?.symbol || "stock investments"} with your advisor.`,
    });
  };

  const formatPercent = (num: number | null) => {
    if (num === null) return 'N/A';
    return `${num.toFixed(2)}%`;
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'var(--color-emerald)' : 'var(--color-destructive)';
  };

  const chartConfig = {
    price: {
      label: "Price",
      theme: {
        light: "#0ea5e9",
        dark: "#38bdf8",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="stock-symbol" className="block text-sm font-medium mb-2">
            Enter Stock Symbol
          </label>
          <div className="relative">
            <Input
              id="stock-symbol"
              placeholder="e.g., AAPL, MSFT, GOOGL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
        </div>
        <Button onClick={handleSearch} disabled={loading} className="mb-0">
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Recent:</span>
          {recentSearches.map((sym) => (
            <Button 
              key={sym} 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSymbol(sym);
                setTimeout(handleSearch, 100);
              }}
            >
              {sym}
            </Button>
          ))}
        </div>
      )}

      {loading && (
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      )}

      {!loading && stockData && !error && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{stockData.companyName} ({stockData.symbol})</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    <span>{stockData.sector} • {stockData.industry}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${stockData.price.toFixed(2)}</div>
                <div className={`flex items-center justify-end ${stockData.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stockData.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Card className="mb-6 border border-muted">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Price History
                  </CardTitle>
                  <div className="flex gap-3">
                    <Button 
                      variant={historyTimeframe === "1M" ? "outline" : "ghost"} 
                      size="sm"
                      onClick={() => handleChangeTimeframe("1M")}
                    >
                      1M
                    </Button>
                    <Button 
                      variant={historyTimeframe === "3M" ? "outline" : "ghost"} 
                      size="sm"
                      onClick={() => handleChangeTimeframe("3M")}
                    >
                      3M
                    </Button>
                    <Button 
                      variant={historyTimeframe === "6M" ? "outline" : "ghost"} 
                      size="sm"
                      onClick={() => handleChangeTimeframe("6M")}
                    >
                      6M
                    </Button>
                    <Button 
                      variant={historyTimeframe === "1Y" ? "outline" : "ghost"} 
                      size="sm"
                      onClick={() => handleChangeTimeframe("1Y")}
                    >
                      1Y
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] mt-4">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : priceHistory.length > 0 ? (
                    <ChartContainer config={chartConfig}>
                      <RechartsLineChart
                        data={priceHistory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${value}`}
                          width={60}
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="Price"
                          stroke={getPriceChangeColor(stockData.change)}
                          strokeWidth={2}
                          dot={false}
                        />
                      </RechartsLineChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No price history data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-sm flex items-center">
                    <CircleDollarSign className="h-4 w-4 mr-1" /> Market Cap
                  </div>
                  <div className="text-xl font-bold">
                    {formatLargeNumber(stockData.marketCap)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total company value
                  </div>
                </div>
              </div>
              
              <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-sm flex items-center">
                    <BarChart className="h-4 w-4 mr-1" /> P/E Ratio
                  </div>
                  <div className="text-xl font-bold">
                    {stockData.peRatio !== null ? stockData.peRatio.toFixed(2) : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Price to Earnings ratio
                  </div>
                </div>
              </div>
              
              <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" /> Dividend Yield
                  </div>
                  <div className="text-xl font-bold">
                    {formatPercent(stockData.dividendYield)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Annual dividend/stock price
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-muted-foreground text-sm">Volume</div>
                <div className="font-medium">{stockData.volume.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Avg Volume</div>
                <div className="font-medium">{stockData.avgVolume.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">52W High</div>
                <div className="font-medium">${stockData.week52High?.toFixed(2) || 'N/A'}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">52W Low</div>
                <div className="font-medium">${stockData.week52Low?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>

            {!aiAnalysis && (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Button 
                  onClick={handleGetAIAnalysis} 
                  disabled={isAnalyzing} 
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" /> 
                  {isAnalyzing ? "Analyzing..." : "Get AI Analysis"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleScheduleAppointment}
                >
                  <CalendarClock className="h-4 w-4" /> Consult with Advisor
                </Button>
                <Button className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Add to Portfolio
                </Button>
              </div>
            )}
            
            {aiAnalysis && (
              <div className="space-y-6">
                <Card className="bg-muted/20 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5" /> AI Investment Analysis
                    </CardTitle>
                    <CardDescription>
                      AI-powered insights for {stockData.symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-3 leading-relaxed">
                      {aiAnalysis.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleScheduleAppointment}
                  >
                    <CalendarClock className="h-4 w-4" /> Consult with Advisor
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Add to Portfolio
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try another symbol or check if you entered a valid stock ticker.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
