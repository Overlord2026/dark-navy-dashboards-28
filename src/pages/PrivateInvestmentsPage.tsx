
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, ArrowUpDown } from "lucide-react";
import { PrivateInvestmentsFirmList } from "@/components/familyoffice/PrivateInvestmentsFirmList";
import { usePrivateInvestments } from "@/hooks/usePrivateInvestments";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function PrivateInvestmentsPage() {
  const { firms, isLoading } = usePrivateInvestments();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Track search analytics
  useEffect(() => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        setSearchHistory(prev => {
          const newHistory = [searchQuery.trim(), ...prev].slice(0, 5);
          console.log("Search history updated:", newHistory);
          return newHistory;
        });
      }, 1000); // Save search after 1 second of inactivity
      
      setSearchTimeout(timeout);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    toast.success(`Searching for "${searchQuery}"`);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    toast.success(`Filtered by: ${category === "all" ? "All Categories" : category}`);
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    toast.success(`Sorted by: ${sortOrder === "asc" ? "Descending" : "Ascending"}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    toast.success("Search cleared");
  };

  return (
    <ThreeColumnLayout title="Private Investments - Family Office Services">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Marketplace
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Private Investments</h1>
            <p className="text-lg text-muted-foreground">
              Access exclusive private investment opportunities through our strategic partnerships with industry-leading investment firms.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by firm name, strategy, minimum investment or specialties..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1.5"
                  onClick={clearSearch}
                >
                  ✕
                </Button>
              )}
            </div>
            <Button type="submit">Search</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSortChange}>
                  Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  Sort by Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  Sort by Minimum Investment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </form>
          
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-muted-foreground">Recent searches:</span>
              {searchHistory.map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-6 bg-muted/20 p-4 rounded-md">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Filter by Investment Category:</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground"
                onClick={() => setActiveCategory("all")}
              >
                Clear filters
              </Button>
            </div>
            <Button 
              variant={activeCategory === "all" ? "default" : "outline"} 
              onClick={() => handleCategoryClick("all")}
              size="sm"
            >
              All Categories
            </Button>
            <Button 
              variant={activeCategory === "private-equity" ? "default" : "outline"} 
              onClick={() => handleCategoryClick("private-equity")}
              size="sm"
            >
              Private Equity
            </Button>
            <Button 
              variant={activeCategory === "private-credit" ? "default" : "outline"} 
              onClick={() => handleCategoryClick("private-credit")}
              size="sm"
            >
              Private Credit
            </Button>
            <Button 
              variant={activeCategory === "real-estate" ? "default" : "outline"} 
              onClick={() => handleCategoryClick("real-estate")}
              size="sm"
            >
              Real Estate
            </Button>
            <Button 
              variant={activeCategory === "infrastructure" ? "default" : "outline"} 
              onClick={() => handleCategoryClick("infrastructure")}
              size="sm"
            >
              Infrastructure
            </Button>
          </div>
          
          <PrivateInvestmentsFirmList 
            firms={firms} 
            isLoading={isLoading}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
