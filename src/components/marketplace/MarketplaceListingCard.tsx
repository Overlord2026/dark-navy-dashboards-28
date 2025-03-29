
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { StarIcon, BookmarkIcon, Star } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MarketplaceListingDetails } from "./MarketplaceListingDetails";

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingCard({ listing }: MarketplaceListingCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="h-48 w-full object-cover"
        />
        {listing.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-grow p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
            <p className="text-sm text-muted-foreground">by {listing.provider}</p>
          </div>
          
          <p className="text-sm line-clamp-3">{listing.description}</p>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(listing.rating) 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-300"}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">({listing.reviewCount} reviews)</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {listing.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 border-t mt-auto">
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-semibold">
            ${listing.price.toLocaleString()}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button>View Details</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <MarketplaceListingDetails listing={listing} />
            </SheetContent>
          </Sheet>
        </div>
      </CardFooter>
    </Card>
  );
}
