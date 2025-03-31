
import React from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Star, ExternalLink, Clock, DollarSign } from "lucide-react";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MarketplaceListingDetailsProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingDetails({ listing }: MarketplaceListingDetailsProps) {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
              <CardDescription className="text-base">
                {listing.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-6">
              <div className="flex items-center space-x-2">
                <Avatar>
                  {listing.provider.logo ? (
                    <AvatarImage src={listing.provider.logo} alt={listing.provider.name} />
                  ) : (
                    <AvatarFallback>{listing.provider.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{listing.provider.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatPrice()}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {listing.priceType === "one-time" ? "One-time fee" : "Subscription"}
                </Badge>
              </div>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="provider">Provider</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Service Overview</h3>
                    <p className="text-muted-foreground">
                      {listing.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What's Included</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Personalized service tailored to your needs</li>
                      <li>Regular updates and communications</li>
                      <li>Expert guidance and support</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Service Details</h3>
                    <p className="text-muted-foreground">
                      Detailed information about this service will be provided during your initial consultation.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="provider" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About {listing.provider.name}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <Avatar>
                        {listing.provider.logo ? (
                          <AvatarImage src={listing.provider.logo} alt={listing.provider.name} />
                        ) : (
                          <AvatarFallback>{listing.provider.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{listing.provider.name}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {listing.provider.name} is a trusted provider in the family office services marketplace.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get Started</CardTitle>
              <CardDescription>
                Learn more about this service or inquire directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">
                {formatPrice()}
              </p>
              
              <div className="space-y-2">
                <Button className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Inquire About Service
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Consultation
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Provider Website
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center mt-4">
                By inquiring, you agree to our marketplace terms and conditions
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
