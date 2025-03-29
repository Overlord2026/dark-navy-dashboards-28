
import React from "react";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, CalendarDays, FileText, HelpCircle, MessageCircle, BookmarkPlus } from "lucide-react";

interface MarketplaceListingDetailsProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingDetails({ listing }: MarketplaceListingDetailsProps) {
  return (
    <>
      <SheetHeader className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <SheetTitle className="text-2xl">{listing.title}</SheetTitle>
            <SheetDescription className="mt-1">
              Provided by {listing.provider}
            </SheetDescription>
          </div>
          <Button variant="ghost" size="icon">
            <BookmarkPlus className="h-5 w-5" />
          </Button>
        </div>
      </SheetHeader>
      
      <div className="space-y-8">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-60 object-cover rounded-md"
        />
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${i < Math.floor(listing.rating) 
                  ? "text-yellow-500 fill-yellow-500" 
                  : "text-gray-300"}`} 
              />
            ))}
            <span className="ml-2 font-medium">{listing.rating}</span>
            <span className="text-sm text-muted-foreground ml-1">({listing.reviewCount} reviews)</span>
          </div>
          
          <div className="space-x-2">
            {listing.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">
                {listing.description}
              </p>
              <p className="text-muted-foreground mt-4">
                This comprehensive service is designed for individuals looking to optimize their financial strategy.
                Our team of experts will analyze your current situation and provide personalized recommendations.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Initial consultation and needs assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Comprehensive financial analysis and report</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Strategy implementation plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>30-day follow-up consultation</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Timeframe</p>
                    <p className="text-sm text-muted-foreground">2-3 weeks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Documentation</p>
                    <p className="text-sm text-muted-foreground">Digital + Print</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Client Requirements</h3>
              <p className="text-muted-foreground mb-4">
                To get the most out of this service, please be prepared to provide:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Financial statements from the past 2 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Current investment portfolio details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Retirement and estate planning documents</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="provider" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About {listing.provider}</h3>
              <p className="text-muted-foreground">
                {listing.provider} is a leading financial services firm specializing in wealth management
                and financial planning for high net worth individuals and families. With over 20 years 
                of experience, our team of certified professionals delivers personalized strategies
                tailored to each client's unique needs and goals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Provider Credentials</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                  Certified Financial Planner
                </Badge>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                  Registered Investment Advisor
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">
                  Chartered Financial Analyst
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button className="flex-1" size="lg">Schedule Consultation</Button>
          <Button variant="outline" className="flex-1 gap-2" size="lg">
            <MessageCircle className="h-4 w-4" />
            Contact Provider
          </Button>
        </div>
        
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
          <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Have questions about this service? Contact our marketplace support team for assistance.
          </p>
        </div>
      </div>
    </>
  );
}
