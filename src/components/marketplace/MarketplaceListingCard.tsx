
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Calendar, 
  Mail,
  Star
} from "lucide-react";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingCard({ listing }: MarketplaceListingCardProps) {
  const formatPrice = () => {
    if (!listing.price) {
      return listing.priceType === "contact" 
        ? "Contact for pricing" 
        : "Custom pricing";
    }
    
    switch (listing.priceType) {
      case "monthly":
        return `$${listing.price}/month`;
      case "annual":
        return `$${listing.price}/year`;
      case "one-time":
        return `$${listing.price}`;
      default:
        return `$${listing.price}`;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border transition-all hover:shadow-md">
      <div className="relative">
        {listing.image && (
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="h-48 w-full object-cover"
          />
        )}
        {listing.featured && (
          <Badge className="absolute top-3 right-3 bg-primary/90 hover:bg-primary">
            <Star className="h-3 w-3 mr-1 fill-white" />
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{listing.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">
          {listing.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          {listing.provider.logo ? (
            <img 
              src={listing.provider.logo} 
              alt={listing.provider.name} 
              className="h-6 mr-2"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-primary">
                {listing.provider.name.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-muted-foreground">{listing.provider.name}</span>
        </div>
        
        <div className="text-sm font-medium mt-1">
          {formatPrice()}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        <Button variant="default" size="sm" className="w-full gap-1.5">
          <Mail className="h-4 w-4" />
          Inquire
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
          <Link to={`/marketplace/service/${listing.id}`}>
            <ExternalLink className="h-4 w-4" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
