
import React from "react";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { MarketplaceListingCard } from "./MarketplaceListingCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownUp } from "lucide-react";
import { StaggeredList, StaggeredItem } from "@/components/animations/StaggeredList";

interface MarketplaceListingsProps {
  listings: MarketplaceListing[];
  isLoading: boolean;
}

export function MarketplaceListings({ listings, isLoading }: MarketplaceListingsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <StaggeredItem key={i}>
              <Card className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            </StaggeredItem>
          ))}
        </StaggeredList>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No listings found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filter criteria
        </p>
        <Button variant="outline">Clear Filters</Button>
      </div>
    );
  }

  // Separate featured listings
  const featuredListings = listings.filter(listing => listing.featured);
  const regularListings = listings.filter(listing => !listing.featured);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-muted-foreground">Showing {listings.length} results</span>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4" />
          Sort
        </Button>
      </div>
      
      {featuredListings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Featured Listings</h2>
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <StaggeredItem key={listing.id}>
                <MarketplaceListingCard listing={listing} />
              </StaggeredItem>
            ))}
          </StaggeredList>
        </div>
      )}
      
      <div className="space-y-4">
        {featuredListings.length > 0 && <h2 className="text-xl font-medium">All Listings</h2>}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularListings.map(listing => (
            <StaggeredItem key={listing.id}>
              <MarketplaceListingCard listing={listing} />
            </StaggeredItem>
          ))}
        </StaggeredList>
      </div>
    </div>
  );
}
