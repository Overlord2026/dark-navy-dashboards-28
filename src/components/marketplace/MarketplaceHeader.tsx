
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MarketplaceHeader({ searchQuery, setSearchQuery }: MarketplaceHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover premium financial services and investment opportunities
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0891CE] shadow-sm" 
          variant="marketplace"
        >
          <PlusCircle className="h-4 w-4" />
          List Your Service
        </Button>
      </div>
      
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Search marketplace..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
