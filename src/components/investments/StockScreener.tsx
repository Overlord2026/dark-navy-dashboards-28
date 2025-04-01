
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchStockData } from "@/services/stockScreenerService";
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
  CircleDollarSign
} from "lucide-react";
import { toast } from "sonner";

export const StockScreener: React.FC = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!symbol.trim()) {
      toast.error("Please enter a stock symbol");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStockData(symbol);
      
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setStockData(data);
        
        // Add to recent searches if not already there
        if (!recentSearches.includes(data.symbol)) {
          setRecentSearches(prev => [data.symbol, ...prev].slice(0, 5));
        }
        
        toast.success(`Loaded data for ${data.companyName} (${data.symbol})`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stock data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${stockData?.symbol || "stock investments"} with your advisor.`,
    });
  };

  const formatPercent = (num: number | null) => {
    if (num === null) return 'N/A';
    return `${num.toFixed(2)}%`;
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
            
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Button className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Add to Portfolio
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleScheduleAppointment}
              >
                <CalendarClock className="h-4 w-4" /> Consult with Advisor
              </Button>
            </div>
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
