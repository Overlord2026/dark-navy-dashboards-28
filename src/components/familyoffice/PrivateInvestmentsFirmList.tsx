
import React, { useMemo } from "react";
import { PrivateInvestmentFirm } from "@/types/privateInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateInvestmentFirmCard } from "./PrivateInvestmentFirmCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PrivateInvestmentsFirmListProps {
  firms: PrivateInvestmentFirm[];
  isLoading: boolean;
  activeCategory: string;
  searchQuery: string;
  setSearchQuery?: (query: string) => void;
}

export function PrivateInvestmentsFirmList({ 
  firms, 
  isLoading,
  activeCategory,
  searchQuery,
  setSearchQuery
}: PrivateInvestmentsFirmListProps) {
  
  const filteredFirms = useMemo(() => {
    if (!firms || !Array.isArray(firms)) return [];
    
    return firms.filter(firm => {
      // Filter by category if not "all"
      const matchesCategory = activeCategory === "all" || firm.categories.includes(activeCategory);
      
      // Filter by search query
      const matchesSearch = searchQuery === "" || 
        firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [firms, activeCategory, searchQuery]);

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
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No investment firms found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by firm name, description, or specialties..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery ? setSearchQuery(e.target.value) : null}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFirms.map((firm) => (
          <PrivateInvestmentFirmCard key={firm.id} firm={firm} />
        ))}
      </div>
    </div>
  );
}
