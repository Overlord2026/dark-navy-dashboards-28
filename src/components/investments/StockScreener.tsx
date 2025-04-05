
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ArrowUpDown,
  Search,
  RefreshCw,
} from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  marketCap: string;
  volume: string;
  sector: string;
}

const mockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 172.62,
    change: 3.42,
    percentChange: 2.02,
    marketCap: "$2.7T",
    volume: "64.2M",
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 380.55,
    change: 6.30,
    percentChange: 1.68,
    marketCap: "$2.8T",
    volume: "25.6M",
    sector: "Technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.22,
    change: -1.32,
    percentChange: -0.74,
    marketCap: "$1.8T",
    volume: "33.9M",
    sector: "Consumer Discretionary"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.30,
    change: 2.15,
    percentChange: 1.53,
    marketCap: "$1.8T",
    volume: "23.8M",
    sector: "Communication Services"
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 218.32,
    change: -9.67,
    percentChange: -4.24,
    marketCap: "$680B",
    volume: "113.2M",
    sector: "Consumer Discretionary"
  },
];

const StockScreener: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const sectors = Array.from(
    new Set(mockStocks.map((stock) => stock.sector))
  );

  // Filter stocks based on search query and selected sector
  const filteredStocks = mockStocks.filter((stock) => {
    const matchesQuery =
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = !selectedSector || stock.sector === selectedSector;
    
    return matchesQuery && matchesSector;
  });

  // Sort stocks based on sortConfig
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.direction === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });

  const handleSort = (key: keyof Stock) => {
    let direction: "asc" | "desc" | null = "asc";
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by symbol or name"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {selectedSector || "All Sectors"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedSector(null)}>
                All Sectors
              </DropdownMenuItem>
              {sectors.map((sector) => (
                <DropdownMenuItem
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium">
                <button
                  className="flex items-center justify-end focus:outline-none ml-auto"
                  onClick={() => handleSort("price")}
                >
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium">
                <button
                  className="flex items-center justify-end focus:outline-none ml-auto"
                  onClick={() => handleSort("percentChange")}
                >
                  Change %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium">
                <button
                  className="flex items-center justify-end focus:outline-none ml-auto"
                  onClick={() => handleSort("marketCap")}
                >
                  Market Cap
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium">
                <button
                  className="flex items-center justify-end focus:outline-none ml-auto"
                  onClick={() => handleSort("sector")}
                >
                  Sector
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                <td className="py-3 px-4">{stock.name}</td>
                <td className="py-3 px-4 text-right">${stock.price.toFixed(2)}</td>
                <td
                  className={`py-3 px-4 text-right ${
                    stock.percentChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.percentChange >= 0 ? "+" : ""}
                  {stock.percentChange.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-right">{stock.marketCap}</td>
                <td className="py-3 px-4 text-right">{stock.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredStocks.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No stocks found matching your search criteria.
        </div>
      )}
    </Card>
  );
};

export default StockScreener;
