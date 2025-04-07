
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Heart, Download } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { toast } from "sonner";

interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  lockupPeriod: string;
  lockUp: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
}

// This component would typically be in a separate file
const OfferingDetailsTabs = ({ offering }: { offering: Offering }) => {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Investment Strategy</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Overview</h4>
          <p className="mt-1">{offering.strategy.overview || "Strategy details will be shared by your advisor."}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Approach</h4>
          <p className="mt-1">{offering.strategy.approach || "Approach details will be shared by your advisor."}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Target Sectors</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {(offering.strategy.sectors && offering.strategy.sectors.length > 0) ? 
              offering.strategy.sectors.map((sector, i) => (
                <Badge key={i} variant="outline" className="text-xs">{sector}</Badge>
              )) : 
              <p className="text-sm">Sector details will be shared by your advisor.</p>
            }
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Expected Return Profile</h4>
          <p className="mt-1">{offering.strategy.expectedReturn || "Expected returns will be discussed during your consultation."}</p>
        </div>
      </div>
    </div>
  );
};

interface OfferingCardProps {
  offering: Offering;
  categoryId: string;
  onLike?: (assetName: string) => void;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ offering, categoryId, onLike }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked && onLike) {
      onLike(offering.name);
    }
  };

  const handleDownloadFactSheet = () => {
    toast.success(`Downloading fact sheet for ${offering.name}`, {
      description: "Your download will begin shortly."
    });
    // In a real app this would trigger an actual download
  };

  return (
    <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl mb-1">{offering.name}</CardTitle>
            <CardDescription className="line-clamp-2">{offering.description}</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="sr-only">Like</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {offering.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className={`text-xs ${i === 0 ? "bg-blue-50" : i === 1 ? "bg-green-50" : "bg-purple-50"}`}>{tag}</Badge>
          ))}
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md flex items-center">
          <div>
            <p className="text-sm font-semibold text-blue-700">Minimum Investment</p>
            <p className="font-bold text-blue-900">{offering.minimumInvestment}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Lock-up Period</p>
            <p className="font-medium">{offering.lockupPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Firm</p>
            <p className="font-medium">{offering.firm}</p>
          </div>
          {offering.investorQualification && (
            <div>
              <p className="text-sm text-muted-foreground">Investor Type</p>
              <p className="font-medium">{offering.investorQualification}</p>
            </div>
          )}
          {offering.platform && (
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="font-medium">{offering.platform}</p>
            </div>
          )}
          {offering.liquidity && (
            <div>
              <p className="text-sm text-muted-foreground">Liquidity</p>
              <p className="font-medium">{offering.liquidity}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1"
            onClick={handleDownloadFactSheet}
          >
            <FileText className="h-4 w-4" />
            Fact Sheet
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">View Details</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/investments/alternative/${categoryId}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <SheetTitle className="text-xl">{offering.name}</SheetTitle>
                </div>
                <SheetDescription>
                  {offering.description}
                </SheetDescription>
              </SheetHeader>
              
              <OfferingDetailsTabs offering={offering} />
              
              <div className="mt-6 flex gap-2">
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="flex-1"
                >
                  Schedule Meeting
                </Button>
                <InterestedButton 
                  assetName={offering.name} 
                  onInterested={() => {
                    if (onLike) onLike(offering.name);
                  }} 
                  className="flex-1"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            variant="default" 
            size="sm" 
            className="flex-1"
          >
            Schedule Meeting
          </Button>
          <InterestedButton 
            assetName={offering.name} 
            onInterested={() => {
              if (onLike) onLike(offering.name);
            }}
            className="flex-1"
          />
        </div>
      </CardContent>
      
      {/* Use Dialog component for scheduling meetings */}
      <ScheduleMeetingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        assetName={offering.name}
      />
    </Card>
  );
};
