
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
  Mail,
  Star,
  TrendingUp,
  Receipt,
  Building,
  Briefcase,
  Users,
  DollarSign,
  Scroll,
  Shield
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

  const getIcon = () => {
    switch (listing.category) {
      case "wealth-management":
        return <TrendingUp className="h-10 w-10 text-blue-500" />;
      case "tax-planning":
        return <Receipt className="h-10 w-10 text-emerald-500" />;
      case "estate-planning":
        return <Scroll className="h-10 w-10 text-purple-500" />;
      case "business-services":
        return <Building className="h-10 w-10 text-orange-500" />;
      case "concierge-services":
        return <Briefcase className="h-10 w-10 text-indigo-500" />;
      case "family-governance":
        return <Users className="h-10 w-10 text-red-500" />;
      case "boutique-services":
        return <DollarSign className="h-10 w-10 text-amber-500" />;
      default:
        return <Shield className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border transition-all hover:shadow-md">
      <div className="relative p-6 bg-muted/30">
        <div className="flex justify-between items-start">
          {getIcon()}
          {listing.featured && (
            <Badge className="bg-primary/90 hover:bg-primary">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </Badge>
          )}
        </div>
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
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-primary">
                {listing.provider.name.charAt(0)}
              </span>
            </div>
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
        <Button variant="gold" size="sm" className="w-full gap-1.5">
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
