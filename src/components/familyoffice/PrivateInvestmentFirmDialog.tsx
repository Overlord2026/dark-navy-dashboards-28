
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDetailsSection } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrivateInvestmentFirm } from "@/types/privateInvestments";
import { 
  Briefcase, 
  Building, 
  Calendar, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Globe, 
  Link, 
  Mail, 
  Phone, 
  TrendingUp, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PrivateInvestmentFirmDialogProps {
  firm: PrivateInvestmentFirm;
  isOpen: boolean;
  onClose: () => void;
}

export function PrivateInvestmentFirmDialog({ 
  firm, 
  isOpen, 
  onClose 
}: PrivateInvestmentFirmDialogProps) {
  const handleContactRequest = () => {
    toast.success("Contact request sent!", {
      description: `We'll connect you with the ${firm.name} team shortly.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 flex items-center">
              <img 
                src={firm.logo} 
                alt={`${firm.name} logo`}
                className={cn(
                  "max-h-10 max-w-28 object-contain",
                  // Special case for logos that need dark backgrounds
                  firm.id === "apollo" && "bg-black p-1 rounded"
                )}
              />
            </div>
            <div>
              <DialogTitle className="text-2xl">{firm.name}</DialogTitle>
              <DialogDescription>
                {firm.headquarters} • Founded {firm.founded} • {firm.aum} AUM
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Firm Overview</TabsTrigger>
            <TabsTrigger value="strategies">Investment Strategies</TabsTrigger>
            <TabsTrigger value="performance">Performance & Partnership</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">About {firm.name}</h3>
              <p className="text-muted-foreground">
                {firm.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Firm Details</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Headquarters</p>
                        <p className="text-sm text-muted-foreground">{firm.headquarters}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Founded</p>
                        <p className="text-sm text-muted-foreground">{firm.founded}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Assets Under Management</p>
                        <p className="text-sm text-muted-foreground">{firm.aum}</p>
                      </div>
                    </div>
                    {firm.websiteUrl.startsWith("http") && (
                      <div className="flex gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a 
                            href={firm.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {firm.websiteUrl.replace(/(^\w+:|^)\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Areas of Specialization</h4>
                  <div className="flex flex-wrap gap-2">
                    {firm.specialties.map((specialty, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Investor Qualifications</h4>
                    <ul className="space-y-2">
                      {firm.investorQualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-1" />
                          <span className="text-sm">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-6">
            <h3 className="text-lg font-medium mb-3">Investment Strategies</h3>
            
            <div className="space-y-4">
              {firm.strategies.map((strategy, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{strategy.name}</h4>
                        <Badge variant="outline" className="mt-1">
                          {strategy.assetClass}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground my-3">
                      {strategy.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Minimum Investment</p>
                        <p className="font-medium">{strategy.minimumInvestment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Lock-up Period</p>
                        <p className="font-medium">{strategy.lockupPeriod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Target Returns</p>
                        <p className="font-medium">{strategy.expectedReturns || "Not disclosed"}</p>
                      </div>
                    </div>
                    
                    {strategy.benchmarks && strategy.benchmarks.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Benchmarks</p>
                        <ul className="list-disc list-inside">
                          {strategy.benchmarks.map((benchmark, i) => (
                            <li key={i} className="text-sm">{benchmark}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Performance Highlights</h4>
                  {firm.performanceHighlights ? (
                    <ul className="space-y-2">
                      {firm.performanceHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-1" />
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Detailed performance information available upon request.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Partnership Details</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {firm.partnershipDetails}
                  </p>
                  
                  {firm.contactInfo && (
                    <div className="mt-4 space-y-3">
                      <h5 className="text-sm font-medium">Contact Information</h5>
                      {firm.contactInfo.contactPerson && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{firm.contactInfo.contactPerson}</span>
                        </div>
                      )}
                      {firm.contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{firm.contactInfo.email}</span>
                        </div>
                      )}
                      {firm.contactInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{firm.contactInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-4" />
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0 sm:mr-auto">
            <p>
              All investment opportunities are subject to qualification requirements
              and regulatory considerations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleContactRequest}>
              Request More Information
            </Button>
            {firm.websiteUrl.startsWith("http") && (
              <Button variant="outline" asChild>
                <a href={firm.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
