
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

interface FundSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offering: any;
}

const FundSummaryDialog: React.FC<FundSummaryDialogProps> = ({ 
  isOpen, 
  onClose, 
  offering 
}) => {
  const handleContactAdvisor = () => {
    // Open Calendly link in a new tab
    window.open("https://calendly.com/your-advisor-link", "_blank");
  };
  
  const formatCategory = (category: string) => {
    if (!category) return "";
    return category
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto bg-[#0f1628] border-gray-800 text-white">
        <SheetHeader className="flex flex-col items-start">
          <SheetClose onClick={onClose} />
          <SheetTitle className="text-2xl font-bold text-white mt-4">{offering.name}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-300">{formatCategory(offering.category)} Offering</h3>
            <p className="text-gray-300">{offering.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-300">About</h3>
            <p className="text-gray-300">
              {offering.about || offering.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-300">How It Works</h3>
            <p className="text-gray-300">
              Your advisor will work with you to select the best offering and fill out the required information. 
              You may be required to sign certain documents. Once completed, your advisor will help you transfer assets 
              to fund the investment.
            </p>
          </div>
          
          <div className="bg-[#1a283e] p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-white">Get Started</h3>
            <p className="text-gray-300 mb-4">
              To get started, schedule a meeting with your advisor or tell them you're interested in this offering.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="text-white border-gray-600 hover:bg-gray-800 flex-1"
              >
                I'm Interested
              </Button>
              <Button 
                onClick={handleContactAdvisor}
                className="bg-primary hover:bg-primary/90 text-white flex-1 flex items-center gap-2"
              >
                <CalendarClock className="h-4 w-4" />
                Schedule a Meeting
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-300">Details</h3>
            <div className="grid grid-cols-1 gap-4 border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Firm</span>
                <span className="text-gray-200 font-medium">{offering.firm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Minimum Investment</span>
                <span className="text-gray-200 font-medium">{offering.minimumInvestment}</span>
              </div>
              {offering.performance && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Performance</span>
                  <span className="text-gray-200 font-medium">{offering.performance}</span>
                </div>
              )}
              {(offering.lockUp || offering.lockupPeriod) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Lock-up Period</span>
                  <span className="text-gray-200 font-medium">{offering.lockUp || offering.lockupPeriod}</span>
                </div>
              )}
            </div>
          </div>
          
          {offering.tags && offering.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-800">
              {offering.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="outline" className="bg-gray-800 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FundSummaryDialog;
