import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingDialog } from "../dialogs/ScheduleMeetingDialog";
import { CalendarClock, Download, File, Heart } from "lucide-react";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { InvestmentOffering } from "@/data/mock/investments";

interface OfferingDetailsTabsProps {
  offering: InvestmentOffering;
}

export const OfferingDetailsTabs: React.FC<OfferingDetailsTabsProps> = ({ offering }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  const handleDownloadPPM = () => {
    const userId = "current-user"; // In a real app, get from auth context
    
    auditLog.log(
      userId,
      "document_access",
      "success",
      {
        resourceType: "investment_document",
        resourceId: offering.name,
        details: {
          action: "download",
          documentType: "PPM"
        }
      }
    );
    
    toast.success("Preparing download", {
      description: `The Private Placement Memorandum for ${offering.name} will download shortly.`,
    });
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    
    if (!isLiked) {
      const userId = "current-user"; // In a real app, get from auth context
      
      auditLog.log(
        userId,
        "document_access",
        "success",
        {
          resourceType: "investment_offering",
          resourceId: offering.name,
          details: {
            action: "expressed_interest",
            category: offering.category
          }
        }
      );
      
      toast.success(`You've expressed interest in ${offering.name}`, {
        description: "Your advisor will be notified about your interest.",
      });
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="strategy">Strategy</TabsTrigger>
        <TabsTrigger value="terms">Terms</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Investment Overview</h3>
          <p className="text-sm">{offering.description}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Key Highlights</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-medium">Minimum Investment</p>
              <p className="text-lg font-bold">{offering.minimumInvestment}</p>
            </div>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-medium">Performance</p>
              <p className="text-lg font-bold text-emerald-500">{offering.performance}</p>
            </div>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-medium">Lock-up Period</p>
              <p className="text-lg font-bold">{offering.lockupPeriod}</p>
            </div>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-medium">Investor Qualification</p>
              <p className="text-lg font-bold">{offering.investorQualification || "Not specified"}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">About {offering.firm}</h3>
          <p className="text-sm">
            {offering.firm} is a leading investment manager with extensive experience in {offering.tags.join(", ")} investments.
            They have a strong track record of delivering consistent returns to investors.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="strategy" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Investment Strategy</h3>
          <p className="text-sm">{offering.strategy.overview}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Approach</h3>
          <p className="text-sm">{offering.strategy.approach}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-sm font-medium">Target</h4>
            <p className="text-sm mt-1">{offering.strategy.target}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Stage</h4>
            <p className="text-sm mt-1">{offering.strategy.stage}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Geography</h4>
            <p className="text-sm mt-1">{offering.strategy.geography}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Expected Return</h4>
            <p className="text-sm mt-1 text-emerald-500">{offering.strategy.expectedReturn}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sectors</h4>
          <div className="flex flex-wrap gap-2">
            {offering.strategy.sectors.map((sector, i) => (
              <span key={i} className="text-xs bg-muted rounded-full px-2.5 py-1">{sector}</span>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Benchmarks</h4>
          <ul className="list-disc pl-5 text-sm">
            {offering.strategy.benchmarks.map((benchmark, i) => (
              <li key={i}>{benchmark}</li>
            ))}
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="terms" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Minimum Investment</p>
            <p className="text-lg font-bold">{offering.minimumInvestment}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Lock-up Period</p>
            <p className="text-lg font-bold">{offering.lockupPeriod}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Liquidity</p>
            <p className="text-lg font-bold">{offering.liquidity || "Limited"}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Subscriptions</p>
            <p className="text-lg font-bold">{offering.subscriptions || "Quarterly"}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Fee Structure</h3>
          <div className="bg-muted rounded-md p-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Management Fee</p>
                <p className="text-sm">1.5-2.0% annually</p>
              </div>
              <div>
                <p className="text-sm font-medium">Performance Fee</p>
                <p className="text-sm">20% over 8% hurdle</p>
              </div>
              <div>
                <p className="text-sm font-medium">Early Redemption Fee</p>
                <p className="text-sm">2-5% (if applicable)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Other Expenses</p>
                <p className="text-sm">Capped at 0.5% annually</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              For detailed fee information, please refer to the offering documents.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Investor Eligibility</h3>
          <p className="text-sm">
            This investment is available to {offering.investorQualification || "qualified investors"} only.
            Speak with your advisor to determine if you meet the eligibility requirements.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="materials" className="space-y-4">
        <div className="space-y-4">
          <div className="rounded-md border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Private Placement Memorandum</p>
                <p className="text-sm text-muted-foreground">PDF, 2.8MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadPPM}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
          
          <div className="rounded-md border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Subscription Agreement</p>
                <p className="text-sm text-muted-foreground">PDF, 1.5MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadPPM}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
          
          <div className="rounded-md border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Investor Presentation</p>
                <p className="text-sm text-muted-foreground">PDF, 4.2MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadPPM}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
          
          <div className="rounded-md border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Performance History</p>
                <p className="text-sm text-muted-foreground">PDF, 950KB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadPPM}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant={isLiked ? "default" : "outline"} 
          className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} />
          {isLiked ? "Interested" : "Express Interest"}
        </Button>
        
        <ScheduleMeetingDialog assetName={offering.name} />
      </div>
    </Tabs>
  );
};
