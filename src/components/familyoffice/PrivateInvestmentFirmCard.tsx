
import React, { useState } from "react";
import { PrivateInvestmentFirm } from "@/types/privateInvestments";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrivateInvestmentFirmDialog } from "./PrivateInvestmentFirmDialog";
import { Briefcase, Link, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivateInvestmentFirmCardProps {
  firm: PrivateInvestmentFirm;
}

export function PrivateInvestmentFirmCard({ firm }: PrivateInvestmentFirmCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 flex items-center">
                <img 
                  src={firm.logo} 
                  alt={`${firm.name} logo`}
                  className={cn(
                    "max-h-12 max-w-32 object-contain",
                    // Special case for logos that need dark backgrounds
                    firm.id === "apollo" && "bg-black p-1 rounded"
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{firm.name}</h3>
                <p className="text-sm text-muted-foreground">{firm.headquarters} • Founded {firm.founded}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="line-clamp-3 text-sm mb-4">
              {firm.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {firm.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {specialty}
                </Badge>
              ))}
              {firm.specialties.length > 3 && (
                <Badge variant="outline">+{firm.specialties.length - 3} more</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-muted-foreground">Assets Under Management</p>
                <p className="font-medium">{firm.aum}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Investor Qualifications</p>
                <p className="font-medium">{firm.investorQualifications[0]}{firm.investorQualifications.length > 1 ? "+" : ""}</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-medium mb-1">Partnership Details</p>
              <p className="text-muted-foreground line-clamp-2">{firm.partnershipDetails}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-muted/30 flex flex-wrap gap-3">
          <Button className="flex-1" onClick={() => setIsDialogOpen(true)}>
            View Investment Strategies
          </Button>
          
          {firm.websiteUrl.startsWith("http") && (
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href={firm.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Link className="h-4 w-4" />
                Visit Website
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <PrivateInvestmentFirmDialog 
        firm={firm} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
}
