
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, BarChart3, Download, RefreshCcw, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const StockScreener = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarketCap, setSelectedMarketCap] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedPERatio, setSelectedPERatio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedMarketCap("");
    setSelectedSector("");
    setSelectedPERatio("");
  };

  // Mock search results
  const searchResults = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 182.52,
      change: 1.24,
      changePercent: 0.68,
      marketCap: "2.97T",
      sector: "Technology",
      peRatio: 31.2,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      price: 407.75,
      change: 3.58,
      changePercent: 0.89,
      marketCap: "3.03T",
      sector: "Technology",
      peRatio: 37.4,
    },
    {
      ticker: "AMZN",
      name: "Amazon.com Inc.",
      price: 182.15,
      change: -1.32,
      changePercent: -0.72,
      marketCap: "1.89T",
      sector: "Consumer Cyclical",
      peRatio: 65.8,
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      price: 942.89,
      change: 15.78,
      changePercent: 1.7,
      marketCap: "2.32T",
      sector: "Technology",
      peRatio: 89.3,
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      price: 152.63,
      change: 0.45,
      changePercent: 0.30,
      marketCap: "1.92T",
      sector: "Communication Services",
      peRatio: 28.7,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Stock Screener</h2>
          <p className="text-muted-foreground">Find and analyze individual stocks</p>
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4 mr-1" /> Export Data
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Stock Filters</CardTitle>
          <CardDescription>Set criteria to filter stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search by Ticker or Company Name</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="e.g. AAPL, Apple Inc."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="market-cap">Market Cap</Label>
              <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                <SelectTrigger id="market-cap" className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="mega">Mega ($200B+)</SelectItem>
                  <SelectItem value="large">Large ($10B-$200B)</SelectItem>
                  <SelectItem value="mid">Mid ($2B-$10B)</SelectItem>
                  <SelectItem value="small">Small ($300M-$2B)</SelectItem>
                  <SelectItem value="micro">Micro (Under $300M)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector" className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="pe-ratio">P/E Ratio</Label>
              <Select value={selectedPERatio} onValueChange={setSelectedPERatio}>
                <SelectTrigger id="pe-ratio" className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="low">Low (< 15)</SelectItem>
                  <SelectItem value="moderate">Moderate (15-30)</SelectItem>
                  <SelectItem value="high">High (30-60)</SelectItem>
                  <SelectItem value="very-high">Very High (60+)</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              className="flex-1 md:flex-none" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-2" /> Apply Filters
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="portfolios">In Portfolios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="mt-4">
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">Symbol</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Name</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-right p-3 font-medium">Change</th>
                  <th className="text-right p-3 font-medium hidden sm:table-cell">Market Cap</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Sector</th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">P/E</th>
                  <th className="text-right p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((stock) => (
                  <tr key={stock.ticker} className="border-t hover:bg-muted/20">
                    <td className="p-3 font-medium">{stock.ticker}</td>
                    <td className="p-3 hidden md:table-cell">{stock.name}</td>
                    <td className="p-3 text-right">${stock.price.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <span className={stock.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.change >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="p-3 text-right hidden sm:table-cell">${stock.marketCap}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <Badge variant="outline" className="bg-primary/5">{stock.sector}</Badge>
                    </td>
                    <td className="p-3 text-right hidden md:table-cell">{stock.peRatio.toFixed(1)}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Info className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing 5 of 547 results</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist" className="mt-4">
          <div className="p-8 text-center border rounded-md">
            <h3 className="font-medium text-lg">Your Watchlist is Empty</h3>
            <p className="text-muted-foreground mt-2">Add stocks to your watchlist to track their performance</p>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolios" className="mt-4">
          <div className="p-8 text-center border rounded-md">
            <h3 className="font-medium text-lg">Portfolio Holdings</h3>
            <p className="text-muted-foreground mt-2">View stocks that are included in your investment portfolios</p>
            <Button className="mt-4">View Portfolios</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
