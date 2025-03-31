
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MarketplaceHeader({ 
  searchQuery, 
  setSearchQuery 
}: MarketplaceHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Family Office Marketplace</h1>
      </div>
      
      <p className="text-muted-foreground max-w-4xl">
        Explore our comprehensive suite of professional services designed specifically for high-net-worth individuals and families. 
        Browse by category or search for specific services that match your needs.
      </p>
      
      <div className="flex items-center gap-4 mt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
