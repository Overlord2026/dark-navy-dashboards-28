
import React, { useMemo, useState } from "react";
import { PrivateInvestmentFirm } from "@/types/privateInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateInvestmentFirmCard } from "./PrivateInvestmentFirmCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface PrivateInvestmentsFirmListProps {
  firms: PrivateInvestmentFirm[];
  isLoading: boolean;
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PrivateInvestmentsFirmList({ 
  firms, 
  isLoading,
  activeCategory,
  searchQuery,
  setSearchQuery,
}: PrivateInvestmentsFirmListProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredFirms = useMemo(() => {
    let filtered = firms.filter(firm => {
      // Filter by category if not "all"
      const matchesCategory = activeCategory === "all" || firm.categories.includes(activeCategory);
      
      // Filter by search query
      const matchesSearch = searchQuery === "" || 
        firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
    
    // Sort the results
    filtered = filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    
    return filtered;
  }, [firms, activeCategory, searchQuery, sortOrder]);

  const handleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-36" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-24 w-full mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredFirms.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by firm name, description, or specialties..."
            className="pl-10 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No investment firms found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
          }}>
            Reset Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by firm name, description, or specialties..."
            className="pl-10 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSort}
            className="transition-all hover:bg-muted"
            aria-label={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          
          {isMobile && (
            <Button
              variant="outline"
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredFirms.length}</span> investment firms
          {activeCategory !== "all" && (
            <> in <span className="font-medium text-foreground">{activeCategory.replace("-", " ")}</span></>
          )}
          {searchQuery && (
            <> matching "<span className="font-medium text-foreground">{searchQuery}</span>"</>
          )}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs ${(!searchQuery && activeCategory === "all") ? "invisible" : ""}`}
          onClick={() => {
            setSearchQuery("");
          }}
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFirms.map((firm) => (
          <PrivateInvestmentFirmCard key={firm.id} firm={firm} />
        ))}
      </div>
    </div>
  );
}
