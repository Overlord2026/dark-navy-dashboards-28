
import React from "react";
import { ServiceCategory } from "./MarketplaceNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MarketplaceListings } from "./MarketplaceListings";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceListing } from "@/hooks/useMarketplace";

interface MarketplaceContentProps {
  activeCategory: string;
  activeSubcategory: string | null;
  serviceCategories: ServiceCategory[];
  filteredListings?: MarketplaceListing[];
  isSearching?: boolean;
}

export function MarketplaceContent({
  activeCategory,
  activeSubcategory,
  serviceCategories,
  filteredListings,
  isSearching = false
}: MarketplaceContentProps) {
  const { listings, isLoading } = useMarketplace();
  
  // Find the active category and subcategory objects
  const currentCategory = serviceCategories.find(category => category.id === activeCategory);
  const currentSubcategory = currentCategory?.subcategories.find(sub => sub.id === activeSubcategory);

  // If filtered listings are provided, use them; otherwise, filter the listings
  const displayListings = filteredListings || listings.filter(listing => {
    // If viewing a specific subcategory
    if (activeSubcategory) {
      return listing.category === activeCategory && listing.subcategory === activeSubcategory;
    }
    // If viewing a main category
    return listing.category === activeCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {isSearching 
            ? `Search Results for "${isSearching}"`
            : currentSubcategory 
              ? currentSubcategory.name 
              : currentCategory?.name || "All Services"}
        </h1>
        <p className="text-muted-foreground">
          {isSearching
            ? `Found ${displayListings.length} service${displayListings.length !== 1 ? 's' : ''} matching your search.`
            : currentSubcategory 
              ? `Browse our selection of ${currentSubcategory.name.toLowerCase()} services.`
              : currentCategory?.description || "Browse our complete selection of family office services."}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Available Services</CardTitle>
          <CardDescription>
            {displayListings.length} service{displayListings.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarketplaceListings 
            listings={displayListings} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
