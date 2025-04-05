
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter, 
  Download 
} from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  peRatio: number | null;
  sector: string;
}

const defaultStocks: Stock[] = [
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    price: 182.63, 
    change: 1.25, 
    changePercent: 0.69, 
    volume: 57_846_321, 
    marketCap: "2.85T", 
    peRatio: 30.4,
    sector: "Technology"
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corporation", 
    price: 417.55, 
    change: 2.87, 
    changePercent: 0.69, 
    volume: 22_764_123, 
    marketCap: "3.12T", 
    peRatio: 37.1,
    sector: "Technology"
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com, Inc.", 
    price: 178.75, 
    change: -1.23, 
    changePercent: -0.68, 
    volume: 32_674_534, 
    marketCap: "1.89T", 
    peRatio: 61.3,
    sector: "Consumer Cyclical"
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    price: 165.12, 
    change: 0.76, 
    changePercent: 0.46, 
    volume: 18_765_432, 
    marketCap: "2.07T", 
    peRatio: 28.2,
    sector: "Technology"
  },
  { 
    symbol: "META", 
    name: "Meta Platforms, Inc.", 
    price: 498.72, 
    change: -3.45, 
    changePercent: -0.69, 
    volume: 15_765_234, 
    marketCap: "1.27T", 
    peRatio: 33.8,
    sector: "Technology"
  },
  { 
    symbol: "TSLA", 
    name: "Tesla, Inc.", 
    price: 175.34, 
    change: 4.23, 
    changePercent: 2.47, 
    volume: 89_234_567, 
    marketCap: "560.2B", 
    peRatio: 47.6,
    sector: "Automotive"
  },
  { 
    symbol: "NVDA", 
    name: "NVIDIA Corporation", 
    price: 925.61, 
    change: 15.32, 
    changePercent: 1.68, 
    volume: 45_876_543, 
    marketCap: "2.28T", 
    peRatio: 68.9,
    sector: "Technology"
  },
  { 
    symbol: "JPM", 
    name: "JPMorgan Chase & Co.", 
    price: 198.56, 
    change: -0.87, 
    changePercent: -0.44, 
    volume: 9_876_543, 
    marketCap: "572.1B", 
    peRatio: 12.1,
    sector: "Financial Services"
  },
  { 
    symbol: "JNJ", 
    name: "Johnson & Johnson", 
    price: 152.78, 
    change: 0.23, 
    changePercent: 0.15, 
    volume: 5_678_912, 
    marketCap: "368.4B", 
    peRatio: 17.8,
    sector: "Healthcare"
  },
  { 
    symbol: "V", 
    name: "Visa Inc.", 
    price: 279.45, 
    change: 1.23, 
    changePercent: 0.44, 
    volume: 7_654_321, 
    marketCap: "587.6B", 
    peRatio: 31.5,
    sector: "Financial Services"
  }
];

const StockScreener: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(defaultStocks);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock;
    direction: "ascending" | "descending";
  } | null>(null);

  const handleSort = (key: keyof Stock) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
    
    const sortedStocks = [...stocks].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    
    setStocks(sortedStocks);
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-semibold">Stock Screener</h2>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search stocks..."
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border rounded-md hover:bg-accent">
            <Filter className="h-5 w-5" />
          </button>
          <button className="p-2 border rounded-md hover:bg-accent">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th 
                className="text-left py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center">
                  Symbol
                  {sortConfig?.key === "symbol" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "symbol" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
              <th 
                className="text-left py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig?.key === "name" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "name" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
              <th 
                className="text-right py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end">
                  Price
                  {sortConfig?.key === "price" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "price" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
              <th 
                className="text-right py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("change")}
              >
                <div className="flex items-center justify-end">
                  Change
                  {sortConfig?.key === "change" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "change" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
              <th 
                className="text-right py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("volume")}
              >
                <div className="flex items-center justify-end">
                  Volume
                  {sortConfig?.key === "volume" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "volume" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
              <th 
                className="text-right py-2 px-4 cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort("sector")}
              >
                <div className="flex items-center justify-end">
                  Sector
                  {sortConfig?.key === "sector" && (
                    sortConfig.direction === "ascending" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortConfig?.key !== "sector" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                <td className="py-3 px-4">{stock.name}</td>
                <td className="py-3 px-4 text-right">${stock.price.toFixed(2)}</td>
                <td className={`py-3 px-4 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </td>
                <td className="py-3 px-4 text-right">{(stock.volume).toLocaleString()}</td>
                <td className="py-3 px-4 text-right">{stock.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredStocks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No stocks found matching your search.</p>
        </div>
      )}
    </Card>
  );
};

export default StockScreener;
