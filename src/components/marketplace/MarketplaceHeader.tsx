
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Office Marketplace</h1>
          <p className="text-muted-foreground max-w-2xl mt-1">
            Access premium services specifically designed for high-net-worth families and their unique needs.
          </p>
        </div>
        
        <Button asChild className="gap-2">
          <Link to="/marketplace/rfp">
            <Send className="h-4 w-4" />
            Submit RFP
          </Link>
        </Button>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search services, providers, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
