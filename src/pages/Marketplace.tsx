
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceCategories } from "@/components/marketplace/MarketplaceCategories";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { useMarketplace } from "@/hooks/useMarketplace";

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { listings, categories, isLoading } = useMarketplace();

  const filteredListings = listings.filter(listing => {
    const matchesCategory = activeCategory === "all" || listing.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <ThreeColumnLayout title="Marketplace">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <MarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <MarketplaceCategories 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            
            <MarketplaceFilters />
          </div>
          
          <div className="md:col-span-3">
            <MarketplaceListings 
              listings={filteredListings}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
