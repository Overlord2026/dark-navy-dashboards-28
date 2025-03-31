
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customTitle?: string;
  customDescription?: string;
}

export function MarketplaceHeader({ 
  searchQuery, 
  setSearchQuery,
  customTitle,
  customDescription
}: MarketplaceHeaderProps) {
  const title = customTitle || "Family Office Marketplace";
  const description = customDescription || "Discover trusted service providers for your wealth management needs";
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for services or providers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </div>
    </div>
  );
}
